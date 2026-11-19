"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Prescription extends Model {
    static associate(models) {
      // Mỗi toa thuốc gắn liền với một lịch hẹn (Booking) cụ thể
      Prescription.belongsTo(models.Booking, {
        foreignKey: "bookingId",
        as: "bookingPrescriptionData",
      });
      Prescription.belongsTo(models.User, {
        foreignKey: "patientId",
        as: "patientPrescriptionData",
      });
      Prescription.belongsTo(models.User, {
        foreignKey: "doctorId",
        as: "doctorPrescriptionData",
      });
    }
  }

  Prescription.init(
    {
      bookingId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      patientId: DataTypes.INTEGER,
      medicineName: DataTypes.STRING,
      usage: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Prescription",
      tableName: "Prescriptions",
    },
  );

  return Prescription;
};
