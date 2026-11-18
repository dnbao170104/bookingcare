"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    static associate(models) {
      // Allcode làm bảng danh mục cha, có thể liên kết tới nhiều bảng khác qua các khóa ngoại (như Booking, Schedule, DoctorInfor...)
      Allcode.hasMany(models.Booking, {
        foreignKey: "statusId",
        as: "statusData",
      });
      Allcode.hasMany(models.Schedule, {
        foreignKey: "timeType",
        as: "timeTypeData",
      });
    }
  }

  Allcode.init(
    {
      key: DataTypes.STRING,
      type: DataTypes.STRING,
      valueEn: DataTypes.STRING,
      valueVi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Allcode",
      tableName: "Allcodes",
    },
  );

  return Allcode;
};
