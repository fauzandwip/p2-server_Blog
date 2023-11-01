const cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: 'dchem6nma',
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

module.exports = cloudinary;
