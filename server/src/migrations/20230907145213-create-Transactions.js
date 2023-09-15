'use strict';

const {
  TRANSACTION_OPERATION_TYPES: { INCOME, EXPENSE },
} = require('../constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      amount: {
        type: Sequelize.NUMERIC,
        allowNull: false,
      },
      operationType: {
        type: Sequelize.ENUM([INCOME, EXPENSE]),
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
    await queryInterface.addConstraint('Transactions', {
      type: 'check',
      fields: ['amount'],
      where: { amount: { [Sequelize.Op.gte]: 0 } },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transactions');
  },
};
