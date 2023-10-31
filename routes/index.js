'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('test'));
router.use('/posts', require('./posts'));
router.use('/categories', require('./categories'));
router.use('/pub', require('./public'));

module.exports = router;