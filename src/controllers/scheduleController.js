const scheduleService = require("../services/scheduleService");

const handleBulkCreateSchedule = async (req, res) => {
  try {
    const lang = req.lang || "vi";
    const result = await scheduleService.bulkCreateSchedule(req.body, lang);
    const statusCode = result.errCode === 0 ? 201 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error("Bulk create schedule error:", error);
    return res.status(500).json({
      errCode: -1,
      message:
        (req.lang || "vi") === "en"
          ? "Internal server error"
          : "Lỗi máy chủ nội bộ",
    });
  }
};

const handleGetScheduleByDate = async (req, res) => {
  try {
    const lang = req.lang || "vi";
    const { doctorId, date } = req.query;
    const result = await scheduleService.getScheduleByDate(
      doctorId,
      date,
      lang,
    );
    const statusCode = result.errCode === 0 ? 200 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error("Get schedule by date error:", error);
    return res.status(500).json({
      errCode: -1,
      message:
        (req.lang || "vi") === "en"
          ? "Internal server error"
          : "Lỗi máy chủ nội bộ",
    });
  }
};

const handleUpdateBookingStatus = async (req, res) => {
  try {
    const lang = req.lang || "vi";
    const result = await scheduleService.updateBookingStatus(req.body, lang);
    const statusCode = result.errCode === 0 ? 200 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error("Update booking status error:", error);
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
  handleBulkCreateSchedule,
  handleGetScheduleByDate,
  handleUpdateBookingStatus,
};
