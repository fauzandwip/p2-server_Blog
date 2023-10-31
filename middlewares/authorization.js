'use strict';

const { Post } = require('../models');

const guardAdminOnly = (req, res, next) => {
	try {
		const { user } = req;
		console.log(user);

		if (user.role === 'admin') {
			next();
			return;
		}

		throw {
			name: 'Forbidden',
			message: 'Only admins can add staffs',
		};
	} catch (error) {
		next(error);
	}
};

const updateDeletePermission = async (req, res, next) => {
	try {
		const { id, role } = req.user;
		const { id: postId } = req.params;
		const { UserId } = await Post.findByPk(postId);

		if (role === 'admin') {
			next();
			return;
		}

		if (id !== UserId) {
			throw { name: 'Forbidden' };
		}

		next();
	} catch (error) {
		next(error);
	}
};

module.exports = { guardAdminOnly, updateDeletePermission };
