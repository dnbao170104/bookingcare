"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Commissions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Bookings",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      invoiceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Invoices",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      totalAmount: {
        type: Sequelize.FLOAT,
        allowNull: false, // Tổng tiền khám
      },
      commissionRate: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 10.0, // Mặc định hoa hồng sàn là 10%
      },
      platformFee: {
        type: Sequelize.FLOAT,
        allowNull: false, // Tiền hoa hồng sàn hưởng
      },
      doctorAmount: {
        type: Sequelize.FLOAT,
        allowNull: false, // Tiền bác sĩ nhận sau khi trừ hoa hồng
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "UNPAID", // Trạng thái quyết toán: UNPAID / PAID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Commissions");
  },
};
