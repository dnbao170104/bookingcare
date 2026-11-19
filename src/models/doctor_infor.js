"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DoctorInfor extends Model {
    static associate(models) {
      DoctorInfor.belongsTo(models.User, {
        foreignKey: "doctorId",
        targetKey: "id",
        as: "doctorInforData",
      });

      if (models.Allcode) {
        DoctorInfor.belongsTo(models.Allcode, {
          foreignKey: "priceId",
          targetKey: "key",
          as: "priceTypeData",
        });
      }
    }
  }

  DoctorInfor.init(
    {
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      priceId: DataTypes.STRING,
      consultationFee: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      depositRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 30.0,
      },
      provinceId: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      specialtyId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      addressClinic: DataTypes.STRING,
      nameClinic: DataTypes.STRING,
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "DoctorInfor",
      tableName: "DoctorInfors",
    },
  );

  return DoctorInfor;
};
