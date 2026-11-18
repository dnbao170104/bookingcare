"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    static associate(models) {
      History.belongsTo(models.User, {
        foreignKey: "patientId",
        targetKey: "id",
        as: "patientHistoryData",
      });
      History.belongsTo(models.User, {
        foreignKey: "doctorId",
        targetKey: "id",
        as: "doctorHistoryData",
      });
    }
  }

  History.init(
    {
      patientId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      files: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "History",
      tableName: "Histories",
    },
  );

  return History;
};
