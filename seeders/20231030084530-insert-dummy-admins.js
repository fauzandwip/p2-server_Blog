'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const admins = require('../data/admins')
      .map((data) => {
        data.role = 'admin';
        data.createdAt = data.updatedAt = new Date();
        return data
      });
    await queryInterface.bulkInsert('Users', admins);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
