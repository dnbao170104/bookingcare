const bcrypt = require("bcryptjs");
const db = require("../models");

const SALT_ROUNDS = 10;

const MESSAGES = {
  missingFields: {
    vi: "Vui lòng nhập đầy đủ thông tin bắt buộc",
    en: "Missing required parameters",
  },
  invalidEmail: {
    vi: "Định dạng email không hợp lệ",
    en: "Invalid email format",
  },
  emailExists: {
    vi: "Email đã tồn tại trong hệ thống",
    en: "Email already exists",
  },
  userNotFound: {
    vi: "Không tìm thấy người dùng",
    en: "User not found",
  },
  wrongPassword: {
    vi: "Mật khẩu không chính xác",
    en: "Incorrect password",
  },
  registerSuccess: {
    vi: "Đăng ký tài khoản thành công",
    en: "Registered successfully",
  },
  loginSuccess: {
    vi: "Đăng nhập thành công",
    en: "Logged in successfully",
  },
  getUsersSuccess: {
    vi: "Lấy danh sách người dùng thành công",
    en: "Fetched users successfully",
  },
};

const getMsg = (key, lang = "vi") => {
  const safeLang = lang === "en" ? "en" : "vi";
  return MESSAGES[key]?.[safeLang] || MESSAGES[key]?.vi || "";
};

const hashPassword = async (password) => {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(password, salt);
};

const checkUserEmail = async (email) => {
  const user = await db.User.findOne({
    where: { email: email.trim().toLowerCase() },
    attributes: ["id", "email"],
    raw: true,
  });
  return !!user;
};

const handleRegister = async (data, lang = "vi") => {
  const { email, password, firstName, lastName, address, gender, roleId } =
    data;

  if (!email || !password || !firstName || !lastName) {
    return {
      errCode: 1,
      message: getMsg("missingFields", lang),
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return {
      errCode: 2,
      message: getMsg("invalidEmail", lang),
    };
  }

  const exists = await checkUserEmail(normalizedEmail);
  if (exists) {
    return {
      errCode: 3,
      message: getMsg("emailExists", lang),
    };
  }

  const hashedPassword = await hashPassword(password);

  // Chuẩn hóa gender về boolean (mặc định true nếu không truyền)
  let normalizedGender = true;
  if (typeof gender === "boolean") {
    normalizedGender = gender;
  } else if (
    gender === 0 ||
    gender === "0" ||
    gender === "false" ||
    gender === "F"
  ) {
    normalizedGender = false;
  }

  const createdUser = await db.User.create({
    email: normalizedEmail,
    password: hashedPassword,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    address: address ? address.trim() : null,
    gender: normalizedGender,
    roleId: roleId || "R3", // Ví dụ mặc định bệnh nhân
  });

  const userObj = createdUser.get({ plain: true });
  delete userObj.password;

  return {
    errCode: 0,
    message: getMsg("registerSuccess", lang),
    user: userObj,
  };
};

const handleLogin = async (email, password, lang = "vi") => {
  if (!email || !password) {
    return {
      errCode: 1,
      message: getMsg("missingFields", lang),
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await db.User.findOne({
    where: { email: normalizedEmail },
    raw: true,
  });

  if (!user) {
    return {
      errCode: 2,
      message: getMsg("userNotFound", lang),
    };
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return {
      errCode: 3,
      message: getMsg("wrongPassword", lang),
    };
  }

  delete user.password;

  return {
    errCode: 0,
    message: getMsg("loginSuccess", lang),
    user,
  };
};

const getAllUsers = async (userId = "ALL", lang = "vi") => {
  const attributes = [
    "id",
    "email",
    "firstName",
    "lastName",
    "address",
    "gender",
    "roleId",
    "createdAt",
    "updatedAt",
  ];

  if (userId === "ALL") {
    const users = await db.User.findAll({
      attributes,
      order: [["id", "DESC"]],
      raw: true,
    });
    return {
      errCode: 0,
      message: getMsg("getUsersSuccess", lang),
      users,
    };
  }

  const user = await db.User.findOne({
    where: { id: userId },
    attributes,
    raw: true,
  });

  if (!user) {
    return {
      errCode: 2,
      message: getMsg("userNotFound", lang),
      users: null,
    };
  }

  return {
    errCode: 0,
    message: getMsg("getUsersSuccess", lang),
    users: user,
  };
};

module.exports = {
  hashPassword,
  checkUserEmail,
  handleRegister,
  handleLogin,
  getAllUsers,
};
