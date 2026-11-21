"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("doctor_infors", "priceId");
    await queryInterface.removeColumn("doctor_infors", "provinceId");
    await queryInterface.removeColumn("doctor_infors", "paymentId");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("doctor_infors", "priceId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("doctor_infors", "provinceId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("doctor_infors", "paymentId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
