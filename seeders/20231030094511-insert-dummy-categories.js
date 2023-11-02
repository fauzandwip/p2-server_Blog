'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const categories = require('../data/categories').map((data) => {
			data.createdAt = data.updatedAt = new Date();
			return data;
		});

		await queryInterface.bulkInsert('Categories', categories);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Categories', null, {
			truncate: true,
			cascade: true,
			restartIdentity: true,
		});
	},
};
