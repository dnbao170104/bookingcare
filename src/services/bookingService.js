const crypto = require("crypto");
const { Op } = require("sequelize");
const db = require("../models");

const DEFAULT_DEPOSIT_RATE = 30;

const MESSAGES = {
  missingFields: {
    vi: "Vui lòng nhập đầy đủ thông tin đặt lịch (doctorId, patientId, date, timeType)",
    en: "Missing required booking fields (doctorId, patientId, date, timeType)",
  },
  invalidTimeType: {
    vi: "Khung giờ (timeType) không tồn tại trong hệ thống",
    en: "Invalid timeType slot",
  },
  missingFee: {
    vi: "Chưa có giá khám cho bác sĩ này để tính tiền đặt chỗ 30%",
    en: "Consultation fee is not configured for this doctor to calculate 30% deposit",
  },
  noScheduleSlot: {
    vi: "Bác sĩ chưa mở khung giờ này trong ngày đã chọn",
    en: "Doctor has not opened this time slot on the selected date",
  },
  slotBooked: {
    vi: "Khung giờ này đã có người đặt trong ngày đã chọn",
    en: "This time slot is already booked for the selected date",
  },
  createSuccess: {
    vi: "Đặt lịch khám thành công. Vui lòng thanh toán 30% tiền giữ chỗ",
    en: "Appointment booked successfully. Please pay the 30% deposit fee",
  },
  bookingNotFound: {
    vi: "Không tìm thấy lịch hẹn",
    en: "Booking not found",
  },
  missingPaymentRef: {
    vi: "Thiếu mã giao dịch thanh toán",
    en: "Missing payment reference",
  },
  confirmDepositSuccess: {
    vi: "Xác nhận thanh toán tiền giữ chỗ thành công",
    en: "Deposit payment confirmed successfully",
  },
};

const getMsg = (key, lang = "vi") => {
  const safeLang = lang === "en" ? "en" : "vi";
  return MESSAGES[key]?.[safeLang] || MESSAGES[key]?.vi || "";
};

const calcThirtyPercent = (consultationFee, rate = DEFAULT_DEPOSIT_RATE) => {
  const fee = Number(consultationFee) || 0;
  const pct = Number(rate) > 0 ? Number(rate) : DEFAULT_DEPOSIT_RATE;
  const depositAmount = Math.round((fee * pct) / 100);
  const remainingAmount = Math.max(0, fee - depositAmount);
  return { fee, pct, depositAmount, remainingAmount };
};

const createBooking = async (data = {}, lang = "vi") => {
  const { doctorId, patientId, date, timeType, reason } = data;

  if (!doctorId || !patientId || !date || !timeType) {
    return {
      errCode: 1,
      message: getMsg("missingFields", lang),
    };
  }

  const cleanDoctorId = Number(doctorId);
  const cleanPatientId = Number(patientId);
  const cleanDate = String(date).trim();
  const cleanTimeType = String(timeType).trim();

  // 0. Kiểm tra timeType có tồn tại trong Allcodes (type = 'TIME')
  if (db.Allcode) {
    const timeCode = await db.Allcode.findOne({
      where: {
        key: cleanTimeType,
        type: "TIME",
      },
      raw: true,
    });

    if (!timeCode) {
      return {
        errCode: 5,
        message: getMsg("invalidTimeType", lang),
      };
    }
  }

  // 1. Lấy giá khám & tỷ lệ cọc (mặc định 30%) từ Doctor_Infor nếu có
  let fee = 0;
  let rate = DEFAULT_DEPOSIT_RATE;

  if (db.Doctor_Infor) {
    const Doctor_Infor = await db.Doctor_Infor.findOne({
      where: { doctorId: cleanDoctorId },
      raw: true,
    });
    if (Doctor_Infor) {
      if (Number(Doctor_Infor.consultationFee) > 0) {
        fee = Number(Doctor_Infor.consultationFee);
      }
      if (Number(Doctor_Infor.depositRate) > 0) {
        rate = Number(Doctor_Infor.depositRate);
      }
    }
  }

  if (fee <= 0) {
    return {
      errCode: 2,
      message: getMsg("missingFee", lang),
    };
  }

  // 2. Nếu bác sĩ đã tạo lịch cho ngày đó trong bảng Schedules thì kiểm tra khung giờ có mở không
  if (db.Schedule) {
    const doctorSchedulesForDate = await db.Schedule.findAll({
      where: {
        doctorId: cleanDoctorId,
        date: cleanDate,
      },
      raw: true,
    });

    if (doctorSchedulesForDate.length > 0) {
      const hasSlot = doctorSchedulesForDate.some(
        (item) => String(item.timeType).trim() === cleanTimeType,
      );
      if (!hasSlot) {
        return {
          errCode: 3,
          message: getMsg("noScheduleSlot", lang),
        };
      }
    }
  }

  // 3. Kiểm tra trùng lịch theo doctorId + date + timeType (bỏ qua S4: Đã hủy)
  const existing = await db.Booking.findOne({
    where: {
      doctorId: cleanDoctorId,
      date: cleanDate,
      timeType: cleanTimeType,
      statusId: { [Op.ne]: "S4" },
    },
    raw: true,
  });

  if (existing) {
    return {
      errCode: 4,
      message: getMsg("slotBooked", lang),
    };
  }

  // 4. Tính tiền cọc 30% và tạo bản ghi Booking
  const { depositAmount, remainingAmount } = calcThirtyPercent(fee, rate);
  const token = crypto.randomBytes(16).toString("hex");

  const bookingPayload = {
    statusId: "S1", // Chờ cọc / Xác nhận
    doctorId: cleanDoctorId,
    patientId: cleanPatientId,
    date: cleanDate,
    timeType: cleanTimeType,
    token,
    consultationFee: fee,
    depositRate: rate,
    depositAmount,
    depositStatus: "UNPAID",
  };

  if (reason && db.Booking.rawAttributes?.reason) {
    bookingPayload.reason = String(reason).trim();
  }

  const booking = await db.Booking.create(bookingPayload);
  const plain = booking.get({ plain: true });

  return {
    errCode: 0,
    message: getMsg("createSuccess", lang),
    lang: lang === "en" ? "en" : "vi",
    data: {
      ...plain,
      remainingAmountAtClinic: remainingAmount,
    },
  };
};

const confirmBookingDeposit = async (payload = {}, lang = "vi") => {
  const { bookingId, paymentMethod, paymentRef } = payload;

  if (!bookingId) {
    return {
      errCode: 1,
      message: getMsg("bookingNotFound", lang),
    };
  }

  if (!paymentRef || !String(paymentRef).trim()) {
    return {
      errCode: 2,
      message: getMsg("missingPaymentRef", lang),
    };
  }

  const booking = await db.Booking.findOne({
    where: { id: Number(bookingId) },
  });
  if (!booking) {
    return {
      errCode: 3,
      message: getMsg("bookingNotFound", lang),
    };
  }

  await booking.update({
    depositStatus: "PAID",
    statusId: "S2",
    paymentMethod: paymentMethod || "BANK_TRANSFER",
    paymentRef: String(paymentRef).trim(),
    paidAt: new Date(),
  });

  return {
    errCode: 0,
    message: getMsg("confirmDepositSuccess", lang),
    lang: lang === "en" ? "en" : "vi",
    data: booking.get({ plain: true }),
  };
};

module.exports = {
  createBooking,
  confirmBookingDeposit,
  calcThirtyPercent,
};
