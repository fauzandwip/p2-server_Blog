'use strict';

const { verifyToken } = require('../helpers/jwt');
const { Author } = require('../models');

const authentication = async (req, res, next) => {
	try {
		const { authorization } = req.headers;

		if (!authorization) {
			throw {
				name: 'Unauthenticated',
				message: 'Token must be provided',
			};
		}

		const token = authorization.replace('Bearer ', '');

		const { id } = verifyToken(token);
		const author = await Author.findByPk(id);

		if (!author) {
			throw {
				name: 'Unauthenticated',
				message: `Author doesn't exists`,
			};
		}

		req.author = {
			id: author.id,
			email: author.email,
			role: author.role,
		};

		// console.log(req.author);
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = authentication;
