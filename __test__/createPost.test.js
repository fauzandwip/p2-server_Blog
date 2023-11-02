const app = require('../app');
const request = require('supertest');
const { sequelize, Author, Category } = require('../models');
const { signToken } = require('../helpers/jwt');
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
};

let token;

beforeAll(async () => {
	try {
		const newStaff = await Author.create(authorStaff);
		await Category.create({ name: 'Sport' });
		token = signToken({ id: newStaff.id });
	} catch (error) {
		console.log(error);
	}
});

describe('Create new post', () => {
	it('should sucess create post (201)', async () => {
		const { status, body } = await request(app)
			.post('/posts')
			.set('Authorization', `Bearer ${token}`)
			.send(post);

		expect(status).toBe(201);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('title', post.title);
		expect(body).toHaveProperty('content', post.content);
		expect(body).toHaveProperty('imgUrl', post.imgUrl);
		expect(body).toHaveProperty('categoryId', post.categoryId);
	});
	it('should error while author is not login (401)', async () => {
		const { status, body } = await request(app).post('/posts').send(post);

		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'You must login first');
	});
	it('should error while acces_token is invalid (401)', async () => {
		const { status, body } = await request(app)
			.post('/posts')
			.set('Authorization', `Bearer randomString`)
			.send(post);

		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Invalid token');
	});
	it('should error while input is empty/null (400)', async () => {
		const { status, body } = await request(app)
			.post('/posts')
			.set('Authorization', `Bearer ${token}`)
			.send();

		expect(status).toBe(400);
		expect(body).toBeInstanceOf(Object);
		expect(body.messages).toBeInstanceOf(Array);
		expect(body.messages).toContain('Title is required');
		expect(body.messages).toContain('Content is required');
		expect(body.messages).toContain('Category is required');
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
