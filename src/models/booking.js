"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Liên kết Booking với trạng thái qua Allcode
      Booking.belongsTo(models.Allcode, {
        foreignKey: "statusId",
        targetKey: "key",
        as: "statusData",
      });

      // Liên kết Booking với khung giờ qua Allcode
      Booking.belongsTo(models.Allcode, {
        foreignKey: "timeType",
        targetKey: "key",
        as: "timeTypeData",
      });

      // Lịch hẹn thuộc về bệnh nhân (User) và phục vụ bác sĩ (User)
      Booking.belongsTo(models.User, {
        foreignKey: "patientId",
        targetKey: "id",
        as: "patientData",
      });
      Booking.belongsTo(models.User, {
        foreignKey: "doctorId",
        targetKey: "id",
        as: "doctorBookingData",
      });
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
    },
    {
      sequelize,
      modelName: "Booking",
      tableName: "Bookings",
    },
  );

  return Booking;
};
