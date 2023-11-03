'use strict';

const { Category } = require('../models');

module.exports = class CategoryController {
	static async createCategory(req, res, next) {
		try {
			const { name } = req.body;
			const category = await Category.create({ name });

			res.status(201).json(category);
		} catch (error) {
			next(error);
		}
	}

	static async getCategories(req, res, next) {
		try {
			const categories = await Category.findAll();
			res.status(200).json(categories);
		} catch (error) {
			next(error);
		}
	}

	static async updateCategory(req, res, next) {
		try {
			const { id } = req.params;
			const { name } = req.body;
			const category = await Category.findByPk(id);

			if (!category) {
				throw {
					name: 'NotFound',
					message: `Category with id ${id} not found`,
				};
			}

			const updatedCategory = await category.update({ name });
			res.status(200).json(updatedCategory);
		} catch (error) {
			next(error);
		}
	}
};
