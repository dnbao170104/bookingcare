"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Markdown extends Model {
    static associate(models) {
      // Mỗi bản ghi Markdown thuộc về một Bác sĩ cụ thể (User)
      Markdown.belongsTo(models.User, {
        foreignKey: "doctorId",
        as: "doctorMarkdownData",
      });
    }
  }

  Markdown.init(
    {
      contentHTML: DataTypes.TEXT("long"),
      contentMarkdown: DataTypes.TEXT("long"),
      description: DataTypes.TEXT,
      doctorId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Markdown",
      tableName: "Markdowns",
    },
  );

  return Markdown;
};
