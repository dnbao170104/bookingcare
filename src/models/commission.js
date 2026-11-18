"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Commission extends Model {
    static associate(models) {
      // Liên kết Commission với Booking và Invoice
      Commission.belongsTo(models.Booking, {
        foreignKey: "bookingId",
        as: "bookingCommissionData",
      });
      Commission.belongsTo(models.Invoice, {
        foreignKey: "invoiceId",
        as: "invoiceCommissionData",
      });
      Commission.belongsTo(models.User, {
        foreignKey: "doctorId",
        as: "doctorCommissionData",
      });
    }
  }

  Commission.init(
    {
      bookingId: DataTypes.INTEGER,
      invoiceId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      totalAmount: DataTypes.FLOAT,
      commissionRate: DataTypes.FLOAT,
      platformFee: DataTypes.FLOAT,
      doctorAmount: DataTypes.FLOAT,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Commission",
      tableName: "Commissions",
    },
  );

  return Commission;
};
