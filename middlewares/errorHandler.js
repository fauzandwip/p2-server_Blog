const errorHandler = (err, req, res, next) => {
	let status, message, messages;
	switch (err.name) {
		case 'JsonWebTokenError':
			status = 401;
			message = 'Unauthenticated';
			break;

		case 'Unauthenticated':
			status = 401;
			message = err.message ?? 'Unauthenticated';
			break;

		case 'Forbidden':
			status = 403;
			message = err.message ?? 'Unauthorized';
			break;

		case 'SequelizeValidationError':
		case 'SequelizeUniqueConstraintError':
			status = 400;
			messages = err.errors.map((error) => {
				return error.message;
			});
			break;

		case 'BadRequest':
			status = 400;
			message = err.message;
			break;

		case 'NotFound':
			status = 404;
			message = err.message;
			break;

		default:
			status = 500;
			message = 'Internal Server Error';
			break;
	}

	res.status(status).json(message ? { message } : { messages });
};

module.exports = errorHandler;
