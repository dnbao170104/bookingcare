"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    static associate(models) {
      // Một phòng khám có thể chứa thông tin cấu hình của nhiều bác sĩ
      Clinic.hasMany(models.Doctor_Infor, {
        foreignKey: "clinicId",
        as: "clinicData",
      });
      // Hoặc liên kết với bảng Markdown nếu dùng chung cấu trúc quản lý bài viết
      Clinic.hasMany(models.Markdown, {
        foreignKey: "clinicId",
        as: "clinicMarkdownData",
      });
    }
  }

  Clinic.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      image: DataTypes.TEXT,
      descriptionHTML: DataTypes.TEXT("long"),
      descriptionMarkdown: DataTypes.TEXT("long"),
    },
    {
      sequelize,
      modelName: "Clinic",
      tableName: "Clinics",
    },
  );

  return Clinic;
};
