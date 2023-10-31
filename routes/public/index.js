'use strict';

const express = require('express');
const PostController = require('../../controllers/PostController');
const router = express.Router();

router.get('/posts', PostController.getPosts);
router.get('/posts/:id', PostController.getPost);

module.exports = router;