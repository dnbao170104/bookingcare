"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Doctor_Infor extends Model {
    static associate(models) {
      if (models.User) {
        Doctor_Infor.belongsTo(models.User, {
          foreignKey: "doctorId",
          targetKey: "id",
          as: "Doctor_InforData",
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
      consultationFee: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      depositRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 30.0,
      },
    },
    {
      sequelize,
      modelName: "Doctor_Infor",
      tableName: "doctor_infors",
      freezeTableName: true,
    },
  );

  return Doctor_Infor;
};
