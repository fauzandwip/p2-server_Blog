'use strict';

const authentication = require('./authentication');
const {
	guardAdminOnly,
	updateDeletePostAuthorization,
} = require('./authorization');
const errorHandler = require('./errorHandler');

module.exports = {
	authentication,
	guardAdminOnly,
	errorHandler,
	updateDeletePostAuthorization,
};
