'use strict';

const { Category } = require('../models');

module.exports = class CategoryController {
  static async createCategory(req, res) {
    try {
      const { name } = req.body;
      const category = await Category.create({ name });
      
      res.status(201).json(category);
    } catch (error) {
      console.log(error);
      if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ message: error.errors[0].message });
        return
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  static async getCategories(req, res) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const category = await Category.findByPk(id);

      if (!category) {
        res.status(404).json({ message: `Category with id ${id} is not found` });
        return
      }

      const updatedCategory = await category.update({ name });
      res.status(200).json(updatedCategory);
    } catch (error) {
      console.log(error);
      if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ message: error.errors[0].message });
        return
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  static async destroyCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);

      if (!category) {
        res.status(404).json({ message: `Category with id ${id} is not found` });
        return
      }

      await category.destroy();
      res.status(200).json({ message: `Category with id ${id} has been successfully deleted`});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}