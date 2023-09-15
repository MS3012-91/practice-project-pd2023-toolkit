'use strict';
const { Model } = require('sequelize');
const {
  TRANSACTION_OPERATION_TYPES: { EXPENSE, INCOME },
} = require('../constants');

module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transactions.belongsTo(models.Users, { foreignKey: 'userId' });
    }
  }
  Transactions.init(
    {
      amount: {
        type: DataTypes.NUMERIC,
        allowNull: false,
        validate: { min: 0 },
      },
      operationType: {
        type: DataTypes.ENUM([INCOME, EXPENSE]),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Transactions',
    }
  );
  return Transactions;
};
