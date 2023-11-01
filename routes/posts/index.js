'use strict';

const express = require('express');
const PostController = require('../../controllers/PostController');
const { updateDeletePostAuthorization } = require('../../middlewares');
const multer = require('multer');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', PostController.getPosts);
router.post('/', PostController.createPost);
router.get('/:id', PostController.getPost);
router.put('/:id', updateDeletePostAuthorization, PostController.updatePost);
// prettier-ignore
router.patch('/:id/img-url', updateDeletePostAuthorization, upload.single('imageUrl'), PostController.updateImageUrl);
router.delete(
	'/:id',
	updateDeletePostAuthorization,
	PostController.destroyPost
);

module.exports = router;
