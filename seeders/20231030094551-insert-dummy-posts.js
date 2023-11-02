'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const posts = require('../data/posts').map((data) => {
			data.createdAt = data.updatedAt = new Date();
			return data;
		});

		await queryInterface.bulkInsert('Posts', posts);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Posts', null, {
			truncate: true,
			cascade: true,
			restartIdentity: true,
		});
	},
};
