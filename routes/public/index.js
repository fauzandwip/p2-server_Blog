'use strict';

const express = require('express');
const PostController = require('../../controllers/PostController');
const router = express.Router();

router.get('/posts', PostController.getPublicPosts);
router.get('/posts/:id', PostController.getPost);

module.exports = router;
