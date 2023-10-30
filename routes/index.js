'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('test'));
router.use('/posts', require('./posts'));

module.exports = router;