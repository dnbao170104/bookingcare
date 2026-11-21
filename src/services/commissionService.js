const db = require("../models");

const DEFAULT_COMMISSION_RATE = 30;

const MESSAGES = {
  missingBookingId: {
    vi: "Thiếu mã lịch hẹn (bookingId)",
    en: "Missing bookingId",
  },
  bookingNotFound: {
    vi: "Không tìm thấy lịch hẹn",
    en: "Booking not found",
  },
  notConfirmedBooking: {
    vi: "Chỉ có thể hoàn tất khám cho lịch hẹn đã được xác nhận (S2)",
    en: "Only confirmed bookings (S2) can be marked as completed (S3)",
  },
  completeSuccess: {
    vi: "Hoàn tất khám và ghi nhận hoa hồng thành công",
    en: "Appointment completed and commission recorded successfully",
  },
  getListSuccess: {
    vi: "Lấy danh sách hoa hồng thành công",
    en: "Fetched commissions successfully",
  },
};

const getMsg = (key, lang = "vi") => {
  const safeLang = lang === "en" ? "en" : "vi";
  return MESSAGES[key]?.[safeLang] || MESSAGES[key]?.vi || "";
};

const completeBookingAndCreateCommission = async (payload, lang = "vi") => {
  const { bookingId, commissionRate: inputRate } = payload || {};

  if (!bookingId) {
    return {
      errCode: 1,
      message: getMsg("missingBookingId", lang),
    };
  }

  const transaction = await db.sequelize.transaction();

  try {
    const invoiceModel = db.Invoice || db.invoices;
    const commissionModel = db.Commission || db.Commissions || db.commissions;

    const booking = await db.Booking.findOne({
      where: { id: Number(bookingId) },
      transaction,
    });

    if (!booking) {
      await transaction.rollback();
      return {
        errCode: 2,
        message: getMsg("bookingNotFound", lang),
      };
    }

    if (booking.statusId !== "S2" && booking.statusId !== "S3") {
      await transaction.rollback();
      return {
        errCode: 3,
        message: getMsg("notConfirmedBooking", lang),
      };
    }

    const baseAmount = Number(booking.consultationFee) || 0;
    const rate =
      Number(inputRate) > 0
        ? Number(inputRate)
        : Number(booking.depositRate) > 0
          ? Number(booking.depositRate)
          : DEFAULT_COMMISSION_RATE;
    const commissionAmount = Math.round((baseAmount * rate) / 100);

    // 1. Tạo hoặc lấy hóa đơn trước (đúng các cột bảng invoices)
    const [invoice] = await invoiceModel.findOrCreate({
      where: { bookingId: booking.id },
      defaults: {
        bookingId: booking.id,
        totalAmount: baseAmount,
        paymentMethodKey:
          booking.paymentMethod || booking.paymentMethodKey || "CASH",
        paymentStatusKey: "PAID",
        transactionId: booking.paymentRef || booking.transactionId || null,
      },
      transaction,
    });

    // 2. Tạo hoặc lấy hoa hồng và gắn invoiceId vừa tạo
    const [commission] = await commissionModel.findOrCreate({
      where: { bookingId: booking.id },
      defaults: {
        bookingId: booking.id,
        doctorId: booking.doctorId,
        invoiceId: invoice.id,
        baseAmount,
        commissionRate: rate,
        commissionAmount,
        status: "CONFIRMED",
      },
      transaction,
    });

    if (!commission.invoiceId && invoice?.id) {
      await commission.update({ invoiceId: invoice.id }, { transaction });
    }

    if (booking.statusId !== "S3") {
      await booking.update({ statusId: "S3" }, { transaction });
    }

    await transaction.commit();

    const plainInvoice = invoice.get({ plain: true });
    const plainCommission = commission.get({ plain: true });
    const totalCommissionAmount = Number(plainCommission.commissionAmount) || 0;
    const remainingAmountAtClinic = Math.max(
      0,
      baseAmount - totalCommissionAmount,
    );

    return {
      errCode: 0,
      message: getMsg("completeSuccess", lang),
      lang: lang === "en" ? "en" : "vi",
      data: {
        booking: booking.get({ plain: true }),
        invoice: plainInvoice,
        commission: plainCommission,
        summary: {
          baseAmount,
          commissionRate: rate,
          commissionAmount: totalCommissionAmount,
          remainingAmountAtClinic,
        },
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getCommissionsByDoctor = async (doctorId, lang = "vi") => {
  const where = doctorId ? { doctorId: Number(doctorId) } : {};

  const rows = await db.Commission.findAll({
    where,
    order: [["id", "DESC"]],
    raw: true,
  });

  const totalCommission = rows.reduce(
    (sum, item) => sum + (Number(item.commissionAmount) || 0),
    0,
  );

  return {
    errCode: 0,
    message: getMsg("getListSuccess", lang),
    lang: lang === "en" ? "en" : "vi",
    data: {
      items: rows,
      totalCommission,
    },
  };
};

module.exports = {
  completeBookingAndCreateCommission,
  getCommissionsByDoctor,
};
