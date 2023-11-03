'use strict';

const express = require('express');
const CategoryController = require('../../controllers/CategoryController');
const router = express.Router();

router.post('/', CategoryController.createCategory);
router.get('/', CategoryController.getCategories);
router.put('/:id', CategoryController.updateCategory);

module.exports = router;
