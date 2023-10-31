'use strict';

const express = require('express');
const PostController = require('../../controllers/PostController');
const CategoryController = require('../../controllers/CategoryController');
const router = express.Router();

router.post('/', CategoryController.createCategory);
router.get('/', CategoryController.getCategories);

module.exports = router;