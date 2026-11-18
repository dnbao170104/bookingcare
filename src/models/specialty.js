"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    static associate(models) {
      // Một chuyên khoa có thể có nhiều thông tin bác sĩ (DoctorInfor)
      Specialty.hasMany(models.DoctorInfor, {
        foreignKey: "specialtyId",
        as: "specialtyData",
      });
    }
  }

  Specialty.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.TEXT,
      descriptionHTML: DataTypes.TEXT("long"),
      descriptionMarkdown: DataTypes.TEXT("long"),
    },
    {
      sequelize,
      modelName: "Specialty",
      tableName: "Specialties",
    },
  );

  return Specialty;
};
