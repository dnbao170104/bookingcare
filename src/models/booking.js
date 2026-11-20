"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Giữ nguyên các quan hệ hiện có nếu em đã khai báo
    }
  }

  Booking.init(
    {
      statusId: DataTypes.STRING,
      doctorId: DataTypes.INTEGER,
      patientId: DataTypes.INTEGER,
      date: DataTypes.STRING,
      timeType: DataTypes.STRING,
      token: DataTypes.STRING,

      // Bổ sung các cột tiền cọc 30% & thanh toán
      consultationFee: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      depositRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 30.0,
      },
      depositAmount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      depositStatus: {
        type: DataTypes.STRING,
        defaultValue: "UNPAID",
      },
      paymentMethod: DataTypes.STRING,
      paymentRef: DataTypes.STRING,
      paidAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Booking",
      tableName: "bookings",
      freezeTableName: true,
    },
  );

  return Booking;
};
