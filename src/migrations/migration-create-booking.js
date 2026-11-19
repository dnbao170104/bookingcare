"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Bookings", "consultationFee", {
      type: Sequelize.DECIMAL(12, 2),
      defaultValue: 0,
      allowNull: false,
    });

    await queryInterface.addColumn("Bookings", "depositRate", {
      type: Sequelize.DECIMAL(5, 2),
      defaultValue: 30.0,
      allowNull: false,
    });

    await queryInterface.addColumn("Bookings", "depositAmount", {
      type: Sequelize.DECIMAL(12, 2),
      defaultValue: 0,
      allowNull: false,
    });

    await queryInterface.addColumn("Bookings", "depositStatus", {
      type: Sequelize.STRING,
      defaultValue: "UNPAID",
      allowNull: false,
    });

    await queryInterface.addColumn("Bookings", "paymentMethod", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Bookings", "paymentRef", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Bookings", "paidAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("Bookings", "paidAt");
    await queryInterface.removeColumn("Bookings", "paymentRef");
    await queryInterface.removeColumn("Bookings", "paymentMethod");
    await queryInterface.removeColumn("Bookings", "depositStatus");
    await queryInterface.removeColumn("Bookings", "depositAmount");
    await queryInterface.removeColumn("Bookings", "depositRate");
    await queryInterface.removeColumn("Bookings", "consultationFee");
  },
};
