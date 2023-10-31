'use strict';

const { hasPassword } = require('../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const admins = require('../data/admins').map((data) => {
			data.password = hasPassword(data.password);
			data.role = 'admin';
			data.createdAt = data.updatedAt = new Date();
			return data;
		});

		const staffs = require('../data/staffs').map((data) => {
			data.password = hasPassword(data.password);
			data.role = 'staff';
			data.createdAt = data.updatedAt = new Date();
			return data;
		});

		await queryInterface.bulkInsert('Users', admins);
		await queryInterface.bulkInsert('Users', staffs);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Users', null, {});
	},
};
