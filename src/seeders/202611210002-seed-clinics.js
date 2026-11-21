"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query("SET NAMES utf8mb4;");

    const now = new Date();
    const clinics = [
      {
        name: "Bệnh viện Chợ Rẫy",
        address: "201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP. Hồ Chí Minh",
        description:
          "<p>Bệnh viện đa khoa hạng đặc biệt tuyến trung ương tại khu vực phía Nam với nhiều chuyên khoa sâu.</p>",
        image: "",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Bệnh viện Đại học Y Dược TP.HCM",
        address: "215 Hồng Bàng, Phường 11, Quận 5, TP. Hồ Chí Minh",
        description:
          "<p>Hệ thống khám chữa bệnh chất lượng cao kết hợp đào tạo và nghiên cứu y khoa chuyên sâu.</p>",
        image: "",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Phòng khám Đa khoa FV Sài Gòn",
        address: "6 Nguyễn Lương Bằng, Tân Phú, Quận 7, TP. Hồ Chí Minh",
        description:
          "<p>Phòng khám và bệnh viện tiêu chuẩn quốc tế với trang thiết bị chẩn đoán hình ảnh hiện đại.</p>",
        image: "",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Bệnh viện Nhân dân 115",
        address: "527 Sư Vạn Hạnh, Phường 12, Quận 10, TP. Hồ Chí Minh",
        description:
          "<p>Bệnh viện đa khoa tuyến cuối tại TP. Hồ Chí Minh, thế mạnh về tim mạch, thần kinh và cấp cứu.</p>",
        image: "",
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const item of clinics) {
      const [existing] = await queryInterface.sequelize.query(
        "SELECT id FROM `Clinics` WHERE `name` = :name LIMIT 1;",
        {
          replacements: { name: item.name },
        },
      );

      if (!existing || existing.length === 0) {
        await queryInterface.bulkInsert("Clinics", [item], {});
      }
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Clinics", {
      name: [
        "Bệnh viện Chợ Rẫy",
        "Bệnh viện Đại học Y Dược TP.HCM",
        "Phòng khám Đa khoa FV Sài Gòn",
        "Bệnh viện Nhân dân 115",
      ],
    });
  },
};
