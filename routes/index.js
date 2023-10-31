'use strict';

const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

router.get('/', (req, res) => res.send('test'));
// auth
router.post('/add-user', AuthController.addUser);
router.post('/login', AuthController.login);

router.use('/posts', require('./posts'));
router.use('/categories', require('./categories'));
router.use('/pub', require('./public'));

module.exports = router;