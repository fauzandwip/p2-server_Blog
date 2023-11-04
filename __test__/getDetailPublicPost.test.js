const app = require('../app');
const request = require('supertest');
const { sequelize, Author, Category, Post } = require('../models');
const { queryInterface } = sequelize;

const authorStaff = {
	email: 'staff1@gmail.com',
	password: '12345',
};

const post = {
	title: "Let's Jogging",
	content: 'Jogging makes the body fresh',
	imgUrl: 'http://testUrl.com',
	categoryId: 1,
	authorId: 1,
};

beforeAll(async () => {
	try {
		await Author.create(authorStaff);
		await Category.create({ name: 'Sport' });
		await Post.create(post);
	} catch (error) {
		console.log(error);
	}
});

describe('Get detail public post by id', () => {
	it('should success get detail public post by id (200)', async () => {
		const { status, body } = await request(app).get(`/pub/posts/${1}`);

		expect(status).toBe(200);
		expect(body).toBeInstanceOf(Object);
		// all property
		expect(body).toHaveProperty('id', 1);
		expect(body).toHaveProperty('title', post.title);
		expect(body).toHaveProperty('content', post.content);
		expect(body).toHaveProperty('imgUrl', post.imgUrl);
		expect(body).toHaveProperty('categoryId', post.categoryId);
		expect(body).toHaveProperty('authorId', post.authorId);
		expect(body).toHaveProperty('createdAt', expect.any(String));
		expect(body).toHaveProperty('updatedAt', expect.any(String));
		// category
		expect(body).toHaveProperty('Category', expect.any(Object));
		expect(body.Category).toHaveProperty('id', 1);
		expect(body.Category).toHaveProperty('name', 'Sport');
		// author
		expect(body).toHaveProperty('Author', expect.any(Object));
		expect(body.Author).not.toHaveProperty('password');
		expect(body.Author).toHaveProperty('id', 1);
		expect(body.Author).toHaveProperty('username');
		expect(body.Author).toHaveProperty('email', authorStaff.email);
		expect(body.Author).toHaveProperty('role', 'staff');
		expect(body.Author).toHaveProperty('phoneNumber');
		expect(body.Author).toHaveProperty('address');
		expect(body.Author).toHaveProperty('createdAt', expect.any(String));
		expect(body.Author).toHaveProperty('updatedAt', expect.any(String));
	});
	it('should error while post id not found (404)', async () => {
		const { status, body } = await request(app).get(`/pub/posts/${3}`);

		expect(status).toBe(404);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Post with id 3 not found');
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
