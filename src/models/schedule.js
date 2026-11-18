"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      // 1 Lịch khám thuộc về 1 Bác sĩ (User)
      Schedule.belongsTo(models.User, {
        foreignKey: "doctorId",
        targetKey: "id",
        as: "doctorData",
      });

      // Liên kết với bảng Allcode để lấy tên khung giờ (Ví dụ: "08:00 - 09:00")
      Schedule.belongsTo(models.Allcode, {
        foreignKey: "timeType",
        targetKey: "key",
        as: "timeTypeData",
      });
    }
  }

  Schedule.init(
    {
      currentNumber: DataTypes.INTEGER,
      maxNumber: DataTypes.INTEGER,
      date: DataTypes.STRING,
      timeType: DataTypes.STRING,
      doctorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Schedule",
      tableName: "Schedules",
    },
  );

  return Schedule;
};
