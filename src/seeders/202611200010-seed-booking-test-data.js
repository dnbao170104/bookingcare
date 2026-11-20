"use strict";
const bcrypt = require("bcryptjs");

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    // 1. Seed Allcodes: Khung giờ khám (TIME) & Trạng thái Booking (STATUS)
    const allcodes = [
      // Khung giờ TIME
      {
        key: "T1",
        type: "TIME",
        valueEn: "08:00 AM - 09:00 AM",
        valueVi: "08:00 - 09:00",
        createdAt: now,
        updatedAt: now,
      },
      {
        key: "T2",
        type: "TIME",
        valueEn: "09:00 AM - 10:00 AM",
        valueVi: "09:00 - 10:00",
        createdAt: now,
        updatedAt: now,
      },
      {
        key: "T3",
        type: "TIME",
        valueEn: "10:00 AM - 11:00 AM",
        valueVi: "10:00 - 11:00",
        createdAt: now,
        updatedAt: now,
      },
      {
        key: "T4",
        type: "TIME",
        valueEn: "01:30 PM - 02:30 PM",
        valueVi: "13:30 - 14:30",
        createdAt: now,
        updatedAt: now,
      },
      // Trạng thái lịch hẹn STATUS
      {
        key: "S1",
        type: "STATUS",
        valueEn: "Pending deposit / confirmation",
        valueVi: "Chờ cọc / Xác nhận",
        createdAt: now,
        updatedAt: now,
      },
      {
        key: "S2",
        type: "STATUS",
        valueEn: "Confirmed",
        valueVi: "Đã xác nhận",
        createdAt: now,
        updatedAt: now,
      },
      {
        key: "S3",
        type: "STATUS",
        valueEn: "Completed",
        valueVi: "Đã khám xong",
        createdAt: now,
        updatedAt: now,
      },
      {
        key: "S4",
        type: "STATUS",
        valueEn: "Cancelled",
        valueVi: "Đã hủy",
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Tránh chèn trùng key + type nếu chạy lại
    for (const item of allcodes) {
      const [rows] = await queryInterface.sequelize.query(
        "SELECT id FROM Allcodes WHERE `key` = :key AND `type` = :type LIMIT 1",
        { replacements: { key: item.key, type: item.type } },
      );
      if (!rows || rows.length === 0) {
        await queryInterface.bulkInsert("Allcodes", [item]);
      }
    }

    // 2. Seed Users: 1 Bác sĩ test + 1 Bệnh nhân test
    const testUsers = [
      {
        email: "doctor.test@bookingcare.local",
        password: hashPassword("123456"),
        firstName: "Minh",
        lastName: "Bác Sĩ",
        address: "Quận 7, TP. Hồ Chí Minh",
        gender: "M",
        roleId: "R2",
        createdAt: now,
        updatedAt: now,
      },
      {
        email: "patient.test@bookingcare.local",
        password: hashPassword("123456"),
        firstName: "An",
        lastName: "Bệnh Nhân",
        address: "Quận 4, TP. Hồ Chí Minh",
        gender: "F",
        roleId: "R3",
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const user of testUsers) {
      const [rows] = await queryInterface.sequelize.query(
        "SELECT id FROM Users WHERE email = :email LIMIT 1",
        { replacements: { email: user.email } },
      );
      if (!rows || rows.length === 0) {
        await queryInterface.bulkInsert("Users", [user]);
      }
    }

    // Lấy ID thực tế của doctor.test để cấu hình DoctorInfors (tránh lệch ID nếu bảng Users đã có dữ liệu)
    const [doctorRows] = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE email = 'doctor.test@bookingcare.local' LIMIT 1",
    );
    const doctorId = doctorRows?.[0]?.id;

    if (doctorId) {
      const [inforRows] = await queryInterface.sequelize.query(
        "SELECT id FROM Doctor_Infors WHERE doctorId = :doctorId LIMIT 1",
        { replacements: { doctorId } },
      );
      if (!inforRows || inforRows.length === 0) {
        await queryInterface.bulkInsert("Doctor_Infors", [
          {
            doctorId,
            priceId: "PRI1",
            consultationFee: 500000,
            depositRate: 30.0,
            provinceId: "PRO1",
            paymentId: "PAY1",
            addressClinic: "120 Nguyễn Thị Thập, Quận 7, TP.HCM",
            nameClinic: "Phòng Khám Đa Khoa Test",
            note: "Đặt cọc 30% phí khám để giữ lịch",
            createdAt: now,
            updatedAt: now,
          },
        ]);
      }
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("DoctorInfors", null, {});
    await queryInterface.bulkDelete("Users", {
      email: [
        "doctor.test@bookingcare.local",
        "patient.test@bookingcare.local",
      ],
    });
    await queryInterface.bulkDelete("Allcodes", {
      key: ["T1", "T2", "T3", "T4", "S1", "S2", "S3", "S4"],
    });
  },
};
