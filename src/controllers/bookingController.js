const bookingService = require("../services/bookingService");

const handleCreateBooking = async (req, res) => {
  try {
    const lang = req.lang || "vi";
    const result = await bookingService.createBooking(req.body, lang);
    const statusCode = result.errCode === 0 ? 201 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({
      errCode: -1,
      message:
        (req.lang || "vi") === "en"
          ? "Internal server error"
          : "Lỗi máy chủ nội bộ",
    });
  }
};

const handleConfirmDeposit = async (req, res) => {
  try {
    const lang = req.lang || "vi";
    const result = await bookingService.confirmBookingDeposit(req.body, lang);
    const statusCode = result.errCode === 0 ? 200 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error("Confirm deposit error:", error);
    return res.status(500).json({
      errCode: -1,
      message:
        (req.lang || "vi") === "en"
          ? "Internal server error"
          : "Lỗi máy chủ nội bộ",
    });
  }
};

module.exports = {
  handleCreateBooking,
  handleConfirmDeposit,
};
