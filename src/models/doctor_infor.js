"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Doctor_Infor extends Model {
    static associate(models) {
      Doctor_Infor.belongsTo(models.User, {
        foreignKey: "doctorId",
        targetKey: "id",
        as: "Doctor_InforData",
      });

      if (models.Allcode) {
        Doctor_Infor.belongsTo(models.Allcode, {
          foreignKey: "priceId",
          targetKey: "key",
          as: "priceTypeData",
        });
      }
    }
  }

  Doctor_Infor.init(
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
      modelName: "Doctor_Infor",
      tableName: "Doctor_Infors",
    },
  );

  return Doctor_Infor;
};
