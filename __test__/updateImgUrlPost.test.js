'use strict';

const app = require('../app');
const path = require('path');
const request = require('supertest');
const { sequelize, Author, Category, Post } = require('../models');
const { signToken } = require('../helpers/jwt');
const { queryInterface } = sequelize;

const authorStaff = {
	email: 'staff1@gmail.com',
	password: '12345',
};

const authorAdmin = {
	email: 'admin1@gmail.com',
	password: '12345',
	role: 'admin',
};

const post = {
	title: "Let's Jogging",
	content: 'Jogging makes the body fresh',
	imgUrl: 'http://testUrl.com',
	categoryId: 1,
	authorId: 1,
};

let imagePath = path.join(__dirname, '../images/forest.jpg');
let tokenAdmin, tokenStaff;

beforeAll(async () => {
	try {
		const newAdmin = await Author.create(authorAdmin);
		const newStaff = await Author.create(authorStaff);
		await Category.create({ name: 'Sport' });
		await Post.create(post);
		tokenAdmin = signToken({ id: newAdmin.id });
		tokenStaff = signToken({ id: newStaff.id });
	} catch (error) {
		console.log(error);
	}
});

describe('Update image url post by id', () => {
	it('should success update image url post by id (200)', async () => {
		// console.log(imagePath);
		const { status, body } = await request(app)
			.patch(`/posts/${1}/img-url`)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.attach('imageUrl', imagePath);

		// console.log({ status, body });
		expect(status).toBe(200);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Image Post success to update');
	});
	it('should error while author is not login (missing access_token) (401)', async () => {
		const { status, body } = await request(app).patch(`/posts/${1}/img-url`);

		// console.log(status, body);
		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Token must be provided');
	});
	it('should error while acces_token is invalid (401)', async () => {
		const { status, body } = await request(app)
			.patch(`/posts/${1}/img-url`)
			.set('Authorization', `Bearer randomString`);

		// console.log(status, body);
		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Invalid token');
	});
	it('should error while post id not found (404)', async () => {
		const { status, body } = await request(app)
			.patch(`/posts/${3}/img-url`)
			.set('Authorization', `Bearer ${tokenAdmin}`);

		// console.dir({ status, body });
		expect(status).toBe(404);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Post with id 3 not found');
	});
	it(`should error while staff update posts that aren't their own (403)`, async () => {
		const { status, body } = await request(app)
			.patch(`/posts/${1}/img-url`)
			.set('Authorization', `Bearer ${tokenStaff}`);

		// console.log({ status, body });
		expect(status).toBe(403);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', `You don't have permission`);
	});
	it('should error while imageUrl input column is empty/null (400)', async () => {
		const { status, body } = await request(app)
			.patch(`/posts/${1}/img-url`)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.attach('imageUrl', '');

		// console.log({ status, body });
		expect(status).toBe(400);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Image URL is required');
	});
});

afterAll(async () => {
	await queryInterface.bulkDelete('Authors', null, {
		truncate: true,
		cascade: true,
		restartIdentity: true,
	});
	await queryInterface.bulkDelete('Categories', null, {
		truncate: true,
		cascade: true,
		restartIdentity: true,
	});
});
