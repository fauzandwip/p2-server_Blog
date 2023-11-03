'use strict';

const express = require('express');
const AuthController = require('../controllers/AuthController');
const { authentication, guardAdminOnly } = require('../middlewares');
const router = express.Router();

// auth
// prettier-ignore
router.post('/add-user', authentication, guardAdminOnly, AuthController.addAuthor);
router.post('/login', AuthController.login);

router.use('/posts', authentication, require('./posts'));
router.use('/categories', authentication, require('./categories'));
router.use('/pub', require('./public'));

module.exports = router;
