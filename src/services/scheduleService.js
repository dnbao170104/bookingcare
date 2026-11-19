const db = require("../models");

const MESSAGES = {
  missingBulkFields: {
    vi: "Thiếu thông tin tạo lịch khám (doctorId, date, schedules)",
    en: "Missing schedule fields (doctorId, date, schedules)",
  },
  invalidSchedules: {
    vi: "Danh sách khung giờ schedules phải là một mảng không rỗng",
    en: "Schedules must be a non-empty array",
  },
  bulkCreateSuccess: {
    vi: "Tạo khung giờ khám thành công",
    en: "Created doctor schedules successfully",
  },
  missingQueryFields: {
    vi: "Vui lòng truyền đầy đủ doctorId và date",
    en: "Please provide both doctorId and date",
  },
  getScheduleSuccess: {
    vi: "Lấy lịch khám theo ngày thành công",
    en: "Fetched schedule by date successfully",
  },
  bookingNotFound: {
    vi: "Không tìm thấy lịch hẹn",
    en: "Booking not found",
  },
  invalidStatus: {
    vi: "Trạng thái lịch hẹn không hợp lệ",
    en: "Invalid booking status",
  },
  updateStatusSuccess: {
    vi: "Cập nhật trạng thái lịch hẹn thành công",
    en: "Updated booking status successfully",
  },
};

const getMsg = (key, lang = "vi") => {
  const safeLang = lang === "en" ? "en" : "vi";
  return MESSAGES[key]?.[safeLang] || MESSAGES[key]?.vi || "";
};

// Tạo lịch khám hàng loạt cho bác sĩ trong 1 ngày
const bulkCreateSchedule = async (data, lang = "vi") => {
  const { doctorId, date, schedules } = data;
  const maxNumber = Number(data.maxNumber) || 1;

  if (!doctorId || !date || !schedules) {
    return {
      errCode: 1,
      message: getMsg("missingBulkFields", lang),
    };
  }

  if (!Array.isArray(schedules) || schedules.length === 0) {
    return {
      errCode: 2,
      message: getMsg("invalidSchedules", lang),
    };
  }

  const normalizedDate = String(date).trim();

  // Lọc bỏ các khung giờ đã tồn tại cho bác sĩ trong ngày đó
  const existingRows = await db.Schedule.findAll({
    where: {
      doctorId,
      date: normalizedDate,
    },
    attributes: ["timeType"],
    raw: true,
  });

  const existingTimeTypes = new Set(existingRows.map((row) => row.timeType));

  const toCreate = schedules
    .map((item) => {
      const timeType = typeof item === "string" ? item : item?.timeType;
      if (!timeType || existingTimeTypes.has(timeType)) return null;
      return {
        doctorId,
        date: normalizedDate,
        timeType: String(timeType).trim(),
        currentNumber: 0,
        maxNumber:
          typeof item === "object" && item?.maxNumber
            ? Number(item.maxNumber)
            : maxNumber,
      };
    })
    .filter(Boolean);

  if (toCreate.length > 0) {
    await db.Schedule.bulkCreate(toCreate);
  }

  return {
    errCode: 0,
    message: getMsg("bulkCreateSuccess", lang),
    createdCount: toCreate.length,
    skippedCount: schedules.length - toCreate.length,
  };
};

// Lấy danh sách khung giờ khả dụng của bác sĩ theo ngày
const getScheduleByDate = async (doctorId, date, lang = "vi") => {
  if (!doctorId || !date) {
    return {
      errCode: 1,
      message: getMsg("missingQueryFields", lang),
      data: [],
    };
  }

  const rows = await db.Schedule.findAll({
    where: {
      doctorId,
      date: String(date).trim(),
    },
    include: db.Allcode
      ? [
          {
            model: db.Allcode,
            as: "timeTypeData",
            attributes: ["key", "valueVi", "valueEn"],
            required: false,
          },
        ]
      : [],
    order: [["id", "ASC"]],
  });

  const data = rows.map((row) => {
    const plain = row.get({ plain: true });
    if (plain.timeTypeData) {
      plain.timeTypeData.value =
        lang === "en" ? plain.timeTypeData.valueEn : plain.timeTypeData.valueVi;
    }
    return plain;
  });

  return {
    errCode: 0,
    message: getMsg("getScheduleSuccess", lang),
    lang: lang === "en" ? "en" : "vi",
    data,
  };
};

// Cập nhật trạng thái Booking (VD: S3 hoàn tất khám, S4 hủy lịch) + xử lý tiền cọc 30%
const updateBookingStatus = async (payload, lang = "vi") => {
  const { bookingId, statusId, depositAction } = payload;
  // depositAction tùy chọn: "REFUNDED" | "FORFEITED" (khi hủy hoặc vắng mặt)

  if (!bookingId || !statusId) {
    return {
      errCode: 1,
      message: getMsg("invalidStatus", lang),
    };
  }

  const booking = await db.Booking.findOne({ where: { id: bookingId } });
  if (!booking) {
    return {
      errCode: 2,
      message: getMsg("bookingNotFound", lang),
    };
  }

  const updateData = { statusId: String(statusId).trim() };

  if (
    depositAction &&
    ["UNPAID", "PAID", "REFUNDED", "FORFEITED"].includes(depositAction)
  ) {
    updateData.depositStatus = depositAction;
  } else if (statusId === "S4" && booking.depositStatus === "PAID") {
    // Mặc định hủy lịch khi đã cọc -> chuyển sang REFUNDED nếu không chỉ định FORFEITED
    updateData.depositStatus = "REFUNDED";
  }

  await booking.update(updateData);

  return {
    errCode: 0,
    message: getMsg("updateStatusSuccess", lang),
    data: booking.get({ plain: true }),
  };
};

module.exports = {
  bulkCreateSchedule,
  getScheduleByDate,
  updateBookingStatus,
};
