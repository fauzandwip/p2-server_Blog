'use strict';

const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

const authentication = async (req, res, next) => {
	try {
		const { authorization } = req.headers;

		if (!authorization) {
			throw {
				name: 'Unauthenticated',
				message: 'Access Token is missing',
			};
		}

		const token = authorization.replace('Bearer ', '');

		const { id } = verifyToken(token);
		const user = await User.findByPk(id);

		if (!user) {
			throw {
				name: 'Unauthenticated',
				message: `User doesn't exists`,
			};
		}

		req.user = {
			id: user.id,
			email: user.email,
			role: user.role,
		};

		// console.log(req.user);
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = authentication;
