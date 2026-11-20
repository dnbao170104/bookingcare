"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Commissions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Bookings",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      baseAmount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
        allowNull: false,
      },
      commissionRate: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 30.0,
        allowNull: false,
      },
      commissionAmount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "PENDING",
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Commissions");
  },
};
