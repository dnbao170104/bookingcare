const bookingService = require("../services/bookingService");

const resolveLang = (req) =>
  req.lang || req.query.lang || req.headers["accept-language"] || "vi";

const handleCreateBooking = async (req, res) => {
  try {
    const lang = resolveLang(req);
    const result = await bookingService.createBooking(req.body, lang);
    const statusCode = result.errCode === 0 ? 201 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({
      errCode: -1,
      message:
        resolveLang(req) === "en"
          ? "Internal server error"
          : "Lỗi máy chủ nội bộ",
    });
  }
};

const handleConfirmDeposit = async (req, res) => {
  try {
    const lang = resolveLang(req);
    const result = await bookingService.confirmBookingDeposit(req.body, lang);
    const statusCode = result.errCode === 0 ? 200 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error("Confirm deposit error:", error);
    return res.status(500).json({
      errCode: -1,
      message:
        resolveLang(req) === "en"
          ? "Internal server error"
          : "Lỗi máy chủ nội bộ",
    });
  }
};

module.exports = {
  handleCreateBooking,
  handleConfirmDeposit,
};
