'use strict';

const express = require('express');
const PostController = require('../../controllers/PostController');
const { updateDeletePostAuthorization } = require('../../middlewares');
const multerUpload = require('../../helpers/multer');

const router = express.Router();

router.get('/', PostController.getPosts);
router.post('/', PostController.createPost);
router.get('/:id', PostController.getPost);
router.put('/:id', updateDeletePostAuthorization, PostController.updatePost);
// prettier-ignore
router.patch('/:id/img-url', updateDeletePostAuthorization, multerUpload.single('imageUrl'), PostController.updateImageUrl);
router.delete(
	'/:id',
	updateDeletePostAuthorization,
	PostController.destroyPost
);

module.exports = router;
