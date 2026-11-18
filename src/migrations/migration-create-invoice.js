"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Invoices", {
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
      totalAmount: {
        type: Sequelize.FLOAT,
        allowNull: false, // Tổng số tiền thanh toán (phí khám + tiền thuốc)
      },
      paymentMethodKey: {
        type: Sequelize.STRING,
        allowNull: false, // Tham chiếu bảng Allcode (Tiền mặt, VNPay, Momo...)
      },
      paymentStatusKey: {
        type: Sequelize.STRING,
        allowNull: false, // Tham chiếu bảng Allcode (Chưa thanh toán, Đã thanh toán...)
      },
      transactionId: {
        type: Sequelize.STRING,
        allowNull: true, // Mã giao dịch nếu thanh toán qua cổng điện tử
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
    await queryInterface.dropTable("Invoices");
  },
};
