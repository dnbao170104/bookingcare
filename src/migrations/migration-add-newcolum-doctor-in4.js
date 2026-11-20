"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("doctor_infors");

    if (!tableInfo.consultationFee) {
      await queryInterface.addColumn("doctor_infors", "consultationFee", {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
        allowNull: false,
      });
    }

    if (!tableInfo.depositRate) {
      await queryInterface.addColumn("doctor_infors", "depositRate", {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 30.0,
        allowNull: false,
      });
    }
  },

  down: async (queryInterface) => {
    const tableInfo = await queryInterface.describeTable("doctor_infors");

    if (tableInfo.depositRate) {
      await queryInterface.removeColumn("doctor_infors", "depositRate");
    }

    if (tableInfo.consultationFee) {
      await queryInterface.removeColumn("doctor_infors", "consultationFee");
    }
  },
};
