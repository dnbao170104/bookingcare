const crypto = require("crypto");
const db = require("../models");

const DEFAULT_DEPOSIT_RATE = 30;

const MESSAGES = {
  missingFields: {
    vi: "Vui lòng nhập đầy đủ thông tin đặt lịch (doctorId, patientId, date, timeType)",
    en: "Missing required booking fields (doctorId, patientId, date, timeType)",
  },
  missingFee: {
    vi: "Chưa có giá khám cho bác sĩ này để tính tiền đặt chỗ 30%",
    en: "Consultation fee is not configured for this doctor to calculate 30% deposit",
  },
  slotBooked: {
    vi: "Khung giờ này đã có lịch đặt trong ngày đã chọn",
    en: "This time slot is already booked for the selected date",
  },
  createSuccess: {
    vi: "Tạo lịch khám thành công. Vui lòng thanh toán 30% tiền giữ chỗ",
    en: "Booking created successfully. Please pay the 30% deposit fee",
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

const createBooking = async (data, lang = "vi") => {
  const {
    doctorId,
    patientId,
    date,
    timeType,
    consultationFee: inputFee,
  } = data;

  if (!doctorId || !patientId || !date || !timeType) {
    return {
      errCode: 1,
      message: getMsg("missingFields", lang),
    };
  }

  // Lấy giá khám từ DoctorInfor nếu có, hoặc dùng giá truyền vào
  let fee = Number(inputFee) || 0;
  let rate = DEFAULT_DEPOSIT_RATE;

  if (db.DoctorInfor) {
    const doctorInfor = await db.DoctorInfor.findOne({
      where: { doctorId },
      raw: true,
    });
    if (doctorInfor) {
      if (Number(doctorInfor.consultationFee) > 0) {
        fee = Number(doctorInfor.consultationFee);
      }
      if (Number(doctorInfor.depositRate) > 0) {
        rate = Number(doctorInfor.depositRate);
      }
    }
  }

  if (fee <= 0) {
    return {
      errCode: 2,
      message: getMsg("missingFee", lang),
    };
  }

  // Kiểm tra trùng lịch theo doctorId + date + timeType (bỏ qua lịch đã hủy)
  const existing = await db.Booking.findOne({
    where: {
      doctorId,
      date: String(date).trim(),
      timeType: String(timeType).trim(),
      statusId: { [db.Sequelize.Op.ne]: "S4" }, // S4: Đã hủy
    },
    raw: true,
  });

  if (existing) {
    return {
      errCode: 3,
      message: getMsg("slotBooked", lang),
    };
  }

  const { depositAmount, remainingAmount } = calcThirtyPercent(fee, rate);
  const token = crypto.randomBytes(16).toString("hex");

  const booking = await db.Booking.create({
    statusId: "S1", // Chờ xác nhận / thanh toán giữ chỗ
    doctorId,
    patientId,
    date: String(date).trim(),
    timeType: String(timeType).trim(),
    token,
    consultationFee: fee,
    depositRate: rate,
    depositAmount,
    depositStatus: "UNPAID",
  });

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

const confirmBookingDeposit = async (payload, lang = "vi") => {
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

  const booking = await db.Booking.findOne({ where: { id: bookingId } });
  if (!booking) {
    return {
      errCode: 3,
      message: getMsg("bookingNotFound", lang),
    };
  }

  await booking.update({
    depositStatus: "PAID",
    statusId: "S2", // Đã xác nhận lịch hẹn
    paymentMethod: paymentMethod || "BANK_TRANSFER",
    paymentRef: String(paymentRef).trim(),
    paidAt: new Date(),
  });

  return {
    errCode: 0,
    message: getMsg("confirmDepositSuccess", lang),
    data: booking.get({ plain: true }),
  };
};

module.exports = {
  createBooking,
  confirmBookingDeposit,
  calcThirtyPercent,
};
