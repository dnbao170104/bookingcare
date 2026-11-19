const userService = require("../services/userService");

const handleRegister = async (req, res) => {
  try {
    const lang = req.lang || "vi";
    const result = await userService.handleRegister(req.body, lang);
    const statusCode = result.errCode === 0 ? 201 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      errCode: -1,
      message: lang === "en" ? "Internal server error" : "Lỗi máy chủ nội bộ",
    });
  }
};

const handleLogin = async (req, res) => {
  try {
    const lang = req.lang || "vi";
    const { email, password } = req.body;
    const result = await userService.handleLogin(email, password, lang);
    const statusCode = result.errCode === 0 ? 200 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

const handleGetAllUsers = async (req, res) => {
  try {
    const lang = req.lang || "vi";
    const id = req.query.id || "ALL";
    const result = await userService.getAllUsers(id, lang);
    const statusCode = result.errCode === 0 ? 200 : 404;
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

module.exports = {
  handleRegister,
  handleLogin,
  handleGetAllUsers,
};
