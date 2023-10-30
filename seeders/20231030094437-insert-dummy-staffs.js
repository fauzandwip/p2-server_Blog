'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const staffs = require('../data/staffs')
      .map((data) => {
        data.role = 'staff';
        data.createdAt = data.updatedAt = new Date();
        return data
      });
    
    await queryInterface.bulkInsert('Users', staffs);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
