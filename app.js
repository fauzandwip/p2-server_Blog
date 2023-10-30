'use strict';

const express = require('express');
const app = express();
const PORT = 3000;

app.use(require('./routes'));

app.listen(PORT, () => {
  console.log(`Server run on http://localhost:${PORT}`);
})