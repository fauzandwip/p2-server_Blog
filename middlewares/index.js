'use strict';

const authentication = require('./authentication');
const { guardAdminOnly, updateDeletePermission } = require('./authorization');
const errorHandler = require('./errorHandler');

module.exports = {
	authentication,
	guardAdminOnly,
	errorHandler,
	updateDeletePermission,
};
