'use strict';

if (process.env.NODE_DEV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(require('./routes'));

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server run on http://localhost:${PORT}`);
});
