'use strict';

const { Post } = require('../models');

const guardAdminOnly = (req, res, next) => {
	try {
		const { user } = req;
		// console.log(user);

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

const updateDeletePostAuthorization = async (req, res, next) => {
	try {
		const { id: UserId, role } = req.user;
		const { id: postId } = req.params;

		const post = await Post.findByPk(postId);

		if (!post) {
			throw {
				name: 'NotFound',
				message: `Post with id ${postId} is not found`,
			};
		}

		if (role === 'admin') {
			next();
			return;
		}

		if (UserId !== post.UserId) {
			throw { name: 'Forbidden' };
		}

		next();
	} catch (error) {
		next(error);
	}
};

module.exports = { guardAdminOnly, updateDeletePostAuthorization };
