const commissionService = require("../services/commissionService");

const handleCompleteBooking = async (req, res) => {
  try {
    const lang = req.lang || req.query.lang || "vi";
    const result = await commissionService.completeBookingAndCreateCommission(
      req.body,
      lang,
    );
    const statusCode = result.errCode === 0 ? 200 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error("Complete booking error:", error);
    return res.status(500).json({
      errCode: -1,
      message:
        (req.lang || "vi") === "en"
          ? "Internal server error"
          : "Lỗi máy chủ nội bộ",
    });
  }
};

const handleGetCommissions = async (req, res) => {
  try {
    const lang = req.lang || req.query.lang || "vi";
    const { doctorId } = req.query;
    const result = await commissionService.getCommissionsByDoctor(
      doctorId,
      lang,
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error("Get commissions error:", error);
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
  handleCompleteBooking,
  handleGetCommissions,
};
