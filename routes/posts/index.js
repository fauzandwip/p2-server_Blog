'use strict';

const express = require('express');
const PostController = require('../../controllers/PostController');
const router = express.Router();

router.get('/', PostController.getPosts);
router.post('/', PostController.createPost);
router.get('/:id', PostController.getPost);
router.put('/:id', PostController.updatePost);
router.delete('/:id', PostController.destroyPost);

module.exports = router;