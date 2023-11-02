'use strict';

const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { Author } = require('../models');

module.exports = class AuthController {
	static async addUser(req, res, next) {
		try {
			const { username, email, password, phoneNumber, address } = req.body;
			const newAuthor = await Author.create({
				username,
				email,
				password,
				phoneNumber,
				address,
			});

			res.status(201).json({
				id: newAuthor.id,
				email: newAuthor.email,
			});
		} catch (error) {
			next(error);
		}
	}

	static async login(req, res, next) {
		try {
			const { email, password } = req.body;
			if (!email) {
				throw {
					name: 'BadRequest',
					message: 'Email is required',
				};
			}

			if (!password) {
				throw {
					name: 'BadRequest',
					message: 'Password is required',
				};
			}

			const author = await Author.findOne({ where: { email } });

			if (!author || !comparePassword(password, author.password)) {
				throw {
					name: 'Unauthenticated',
					message: 'Invalid email/password',
				};
			}

			const access_token = signToken({ id: author.id });
			res.status(200).json({
				access_token,
				email: author.email,
				role: author.role,
			});
		} catch (error) {
			next(error);
		}
	}
};
