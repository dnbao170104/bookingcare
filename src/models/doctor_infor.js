"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DoctorInfor extends Model {
    static associate(models) {
      // 1 Bản ghi DoctorInfor thuộc về 1 User (Bác sĩ)
      DoctorInfor.belongsTo(models.User, {
        foreignKey: "doctorId",
        as: "doctorInforData",
      });

      // Liên kết với bảng Allcode để lấy tên giá khám, phương thức thanh toán, tỉnh thành
      DoctorInfor.belongsTo(models.Allcode, {
        foreignKey: "priceId",
        targetKey: "key",
        as: "priceTypeData",
      });
      DoctorInfor.belongsTo(models.Allcode, {
        foreignKey: "provinceId",
        targetKey: "key",
        as: "provinceTypeData",
      });
      DoctorInfor.belongsTo(models.Allcode, {
        foreignKey: "paymentId",
        targetKey: "key",
        as: "paymentTypeData",
      });

      // Liên kết với Specialty và Clinic
      DoctorInfor.belongsTo(models.Specialty, {
        foreignKey: "specialtyId",
        as: "specialtyData",
      });
      DoctorInfor.belongsTo(models.Clinic, {
        foreignKey: "clinicId",
        as: "clinicData",
      });
    }
  }

  DoctorInfor.init(
    {
      doctorId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      priceId: DataTypes.STRING,
      provinceId: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      addressClinic: DataTypes.STRING,
      nameClinic: DataTypes.STRING,
      note: DataTypes.STRING,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DoctorInfor",
      tableName: "doctor_infors",
    },
  );

  return DoctorInfor;
};
