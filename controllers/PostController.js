'use strict';

const { Post, Author, Category } = require('../models');
const { randomUUID } = require('crypto');
const cloudinary = require('../helpers/cloudinary');
const { Op } = require('sequelize');

module.exports = class PostController {
	static async getPosts(req, res, next) {
		try {
			const posts = await Post.findAll({
				include: [
					{
						model: Category,
						attributes: ['id', 'name'],
					},
					{
						model: Author,
						attributes: {
							exclude: ['password'],
						},
					},
				],
				order: [['id', 'ASC']],
			});
			res.status(200).json(posts);
		} catch (error) {
			next(error);
		}
	}

	static async getPublicPosts(req, res, next) {
		try {
			let { search, sort, filter, page } = req.query;
			let pageNumber = 1;
			let limit = 10;
			const queryOption = {
				where: {},
				include: [
					{
						model: Category,
						attributes: ['id', 'name'],
					},
					{
						model: Author,
						attributes: {
							exclude: ['password'],
						},
					},
				],
			};

			if (search) {
				queryOption.where.title = {
					[Op.iLike]: `%${search}%`,
				};
			}

			if (sort) {
				if (sort.charAt(0) !== '-') {
					queryOption.order = [[sort, 'ASC']];
				} else {
					queryOption.order = [[sort.slice(1), 'DESC']];
				}
			}

			if (filter) {
				const query = filter.category.split(',');
				queryOption.where.categoryId = {
					[Op.or]: query,
				};
			}

			if (page) {
				if (page.size) {
					limit = page.size;
				}

				if (page.number) {
					pageNumber = page.number;
				}
			}

			queryOption.limit = limit;
			queryOption.offset = (pageNumber - 1) * limit;

			const { count, rows } = await Post.findAndCountAll(queryOption);

			res.status(200).json({
				total: count,
				size: +limit,
				totalPage: Math.ceil(count / limit),
				currentPage: +pageNumber,
				data: rows,
			});
		} catch (error) {
			next(error);
		}
	}

	static async createPost(req, res, next) {
		try {
			const { id: authorId } = req.author;
			const { title, content, imgUrl, categoryId } = req.body;
			const newPost = await Post.create({
				title,
				content,
				imgUrl,
				categoryId,
				authorId,
			});

			res.status(201).json(newPost);
		} catch (error) {
			next(error);
		}
	}

	static async getPost(req, res, next) {
		try {
			const { id } = req.params;
			const post = await Post.findByPk(id, {
				include: [
					{
						model: Category,
						attributes: ['id', 'name'],
					},
					{
						model: Author,
						attributes: {
							exclude: ['password'],
						},
					},
				],
			});

			if (!post) {
				throw {
					name: 'NotFound',
					message: `Post with id ${id} not found`,
				};
			}

			res.status(200).json(post);
		} catch (error) {
			next(error);
		}
	}

	static async updatePost(req, res, next) {
		try {
			const { id } = req.params;
			const { title, content, imgUrl, categoryId } = req.body;
			const post = await Post.findByPk(id);

			const updatedPost = await post.update({
				title,
				content,
				imgUrl,
				categoryId,
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
				message: `Post success to delete`,
			});
		} catch (error) {
			next(error);
		}
	}

	static async updateImageUrl(req, res, next) {
		try {
			const { id } = req.params;

			if (!req.file) {
				throw {
					name: 'BadRequest',
					message: 'Image file is required',
				};
			}

			const { mimetype, buffer, originalname } = req.file;
			const post = await Post.findByPk(id);

			const base64File = Buffer.from(buffer).toString('base64');
			const dataURI = `data:${mimetype};base64,${base64File}`;

			const data = await cloudinary.uploader.upload(dataURI, {
				public_id: `${originalname}_${randomUUID()}`,
			});

			await post.update({
				imgUrl: data.secure_url,
			});

			res.status(200).json({
				message: 'Image Post success to update',
			});
		} catch (error) {
			next(error);
		}
	}
};
