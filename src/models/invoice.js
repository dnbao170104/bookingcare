"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      // Hóa đơn thuộc về một lịch hẹn cụ thể
      Invoice.belongsTo(models.Booking, {
        foreignKey: "bookingId",
        as: "bookingInvoiceData",
      });

      // Liên kết với Allcode để lấy tên phương thức thanh toán và trạng thái
      Invoice.belongsTo(models.Allcode, {
        foreignKey: "paymentMethodKey",
        targetKey: "key",
        as: "paymentMethodData",
      });
      Invoice.belongsTo(models.Allcode, {
        foreignKey: "paymentStatusKey",
        targetKey: "key",
        as: "paymentStatusData",
      });
    }
  }

  Invoice.init(
    {
      bookingId: DataTypes.INTEGER,
      totalAmount: DataTypes.FLOAT,
      paymentMethodKey: DataTypes.STRING,
      paymentStatusKey: DataTypes.STRING,
      transactionId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Invoice",
      tableName: "Invoices",
    },
  );

  return Invoice;
};
