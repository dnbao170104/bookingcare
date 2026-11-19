import bcrypt from "bcryptjs";
const bcrypt = require("bcryptjs");

// Số round mã hóa (mặc định thường dùng là 10)
const salt = bcrypt.genSaltSync(10);

// Hàm mã hóa mật khẩu trước khi lưu vào Database
const hashUserPasswordFromBcrypt = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { hashUserPasswordFromBcrypt };
