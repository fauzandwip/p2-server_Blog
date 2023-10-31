'use strict';

const express = require('express');
const AuthController = require('../controllers/AuthController');
const authentication = require('../middlewares/authentication');
const router = express.Router();

router.get('/', (req, res) => res.send('test'));
// auth
router.post('/add-user', AuthController.addUser);
router.post('/login', AuthController.login);

router.use('/posts', authentication, require('./posts'));
router.use('/categories', authentication, require('./categories'));
router.use('/pub', require('./public'));

module.exports = router;