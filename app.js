'use strict';

if (process.env.NODE_DEV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(require('./routes'));

app.listen(PORT, () => {
  console.log(`Server run on http://localhost:${PORT}`);
})