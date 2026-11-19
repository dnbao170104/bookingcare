"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Commission extends Model {
    static associate(models) {
      Commission.belongsTo(models.Booking, {
        foreignKey: "bookingId",
        as: "bookingData",
      });
      Commission.belongsTo(models.User, {
        foreignKey: "doctorId",
        as: "doctorCommissionData",
      });
    }
  }

  Commission.init(
    {
      bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      baseAmount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      commissionRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 30.0,
      },
      commissionAmount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "PENDING", // PENDING | SETTLED | CANCELLED
      },
    },
    {
      sequelize,
      modelName: "Commission",
      tableName: "Commissions",
    },
  );

  return Commission;
};
