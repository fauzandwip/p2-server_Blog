'use strict';

const express = require('express');
const PostController = require('../../controllers/PostController');
const { updateDeletePermission } = require('../../middlewares');
const router = express.Router();

router.get('/', PostController.getPosts);
router.post('/', PostController.createPost);
router.get('/:id', PostController.getPost);
router.put('/:id', updateDeletePermission, PostController.updatePost);
router.delete('/:id', updateDeletePermission, PostController.destroyPost);

module.exports = router;
