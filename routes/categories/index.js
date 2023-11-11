'use strict';

const express = require('express');
const CategoryController = require('../../controllers/CategoryController');
const { authentication } = require('../../middlewares');
const router = express.Router();

router.post('/', authentication, CategoryController.createCategory);
router.get('/', CategoryController.getCategories);
router.put('/:id', authentication, CategoryController.updateCategory);

module.exports = router;
