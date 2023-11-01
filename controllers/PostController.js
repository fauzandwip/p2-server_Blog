'use strict';

const { Post, User } = require('../models');
const cloudinary = require('cloudinary').v2;
const { randomUUID } = require('crypto');

cloudinary.config({
	cloud_name: 'dchem6nma',
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

module.exports = class PostController {
	static async getPosts(req, res, next) {
		try {
			const posts = await Post.findAll({
				include: {
					model: User,
					attributes: {
						exclude: ['password'],
					},
				},
			});
			res.status(200).json(posts);
		} catch (error) {
			next(error);
		}
	}

	static async createPost(req, res, next) {
		try {
			const { id: UserId } = req.user;
			const { title, content, imgUrl, CategoryId } = req.body;
			const newPost = await Post.create({
				title,
				content,
				imgUrl,
				CategoryId,
				UserId,
			});

			res.status(201).json(newPost);
		} catch (error) {
			next(error);
		}
	}

	static async getPost(req, res, next) {
		try {
			const { id } = req.params;
			const post = await Post.findByPk(id);

			if (!post) {
				throw {
					name: 'NotFound',
					message: `Post with id ${id} is not found`,
				};
			}

			res.status(200).json(post);
		} catch (error) {
			next(error);
		}
	}

	static async updatePost(req, res, next) {
		try {
			// update UserId
			// const { id: UserId } = req.user;
			const { id } = req.params;
			const { title, content, imgUrl, CategoryId } = req.body;
			const post = await Post.findByPk(id);

			const updatedPost = await post.update({
				title,
				content,
				imgUrl,
				CategoryId,
			});
			res.status(200).json(updatedPost);
		} catch (error) {
			next(error);
		}
	}

	static async destroyPost(req, res, next) {
		try {
			const { id } = req.params;
			const post = await Post.findByPk(id);

			await post.destroy();
			res.status(200).json({
				message: `Post with id ${id} has been successfully deleted`,
			});
		} catch (error) {
			next(error);
		}
	}

	static async updateImageUrl(req, res, next) {
		try {
			const { id } = req.params;
			const { mimetype, buffer, originalname } = req.file;
			const post = await Post.findByPk(id);

			const base64File = Buffer.from(buffer).toString('base64');
			const dataURI = `data:${mimetype};base64,${base64File}`;

			const data = await cloudinary.uploader.upload(dataURI, {
				public_id: `${originalname}_${randomUUID()}`,
			});

			const updatedPost = await post.update({
				imgUrl: data.secure_url,
			});

			res.status(200).json(updatedPost);
		} catch (error) {
			next(error);
		}
	}
};
