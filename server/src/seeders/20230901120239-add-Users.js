const bcrypt = require ('bcrypt');
const { SALT_ROUNDS } = require('../constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'John',
          lastName: 'Tomson',
          displayName: 'John Tomson',
          password: bcrypt.hashSync('123456', SALT_ROUNDS),
          email: 'tom@gmail.com',
          role: 'customer',
        },
        {
          firstName: 'Creator',
          lastName: 'Creator',
          displayName: 'CREATOR',
          password: bcrypt.hashSync('123456', SALT_ROUNDS),
          email: 'creator@gmail.com',
          role: 'creator',
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
