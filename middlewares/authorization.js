'use strict';

const { Post } = require('../models');

const guardAdminOnly = (req, res, next) => {
	try {
		const { author } = req;
		// console.log(author);

		if (author.role === 'admin') {
			next();
			return;
		}

		throw {
			name: 'Forbidden',
			message: 'You are not authorized, ADMIN ONLY',
		};
	} catch (error) {
		next(error);
	}
};

const updateDeletePostAuthorization = async (req, res, next) => {
	try {
		const { id: authorId, role } = req.author;
		const { id: postId } = req.params;

		const post = await Post.findByPk(postId);

		if (!post) {
			throw {
				name: 'NotFound',
				message: `Post with id ${postId} not found`,
			};
		}

		if (role !== 'admin' && authorId !== post.authorId) {
			throw {
				name: 'Forbidden',
				message: `You don't have permission`,
			};
		}

		next();
	} catch (error) {
		next(error);
	}
};

module.exports = {
	guardAdminOnly,
	updateDeletePostAuthorization,
};
