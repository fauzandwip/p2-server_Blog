'use strict';

const { hashPassword } = require('../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const admins = require('../data/admins').map((data) => {
			data.password = hashPassword(data.password);
			data.role = 'admin';
			data.createdAt = data.updatedAt = new Date();
			return data;
		});

		const staffs = require('../data/staffs').map((data) => {
			data.password = hashPassword(data.password);
			data.role = 'staff';
			data.createdAt = data.updatedAt = new Date();
			return data;
		});

		await queryInterface.bulkInsert('Authors', admins);
		await queryInterface.bulkInsert('Authors', staffs);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Authors', null, {});
	},
};
