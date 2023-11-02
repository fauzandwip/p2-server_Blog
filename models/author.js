'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { hashPassword } = require('../helpers/bcrypt');

module.exports = (sequelize, DataTypes) => {
	class Author extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Author.hasMany(models.Post, { foreignKey: 'authorId' });
		}
	}
	Author.init(
		{
			username: DataTypes.STRING,
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: { msg: 'Email already exists' },
				validate: {
					notNull: { msg: 'Email is required' },
					notEmpty: { msg: 'Email is required' },
					isEmail: { msg: 'Invalid email format' },
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: 'Password is required' },
					notEmpty: { msg: 'Password is required' },
					len: {
						args: [5],
						msg: 'Password must be equal to or more than 5 characters',
					},
				},
			},
			role: {
				type: DataTypes.STRING,
				defaultValue: 'staff',
			},
			phoneNumber: DataTypes.STRING,
			address: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Author',
		}
	);

	Author.beforeCreate((instance) => {
		instance.password = hashPassword(instance.password);
	});

	return Author;
};
