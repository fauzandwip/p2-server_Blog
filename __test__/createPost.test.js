const app = require('../app');
const request = require('supertest');
const { sequelize, User, Category } = require('../models');
const { signToken } = require('../helpers/jwt');
const { queryInterface } = sequelize;

const userStaff = {
	email: 'staff1@gmail.com',
	password: '12345',
};

const post = {
	title: "Let's Jogging",
	content: 'Jogging makes the body fresh',
	imgUrl: 'http://testUrl.com',
	CategoryId: 1,
};

let token;

beforeAll(async () => {
	const newStaff = await User.create(userStaff);
	await Category.create({ name: 'Sport' });
	token = signToken({ id: newStaff.id });
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
		expect(body).toHaveProperty('CategoryId', post.CategoryId);
	});
	it('should error while user is not login (401)', async () => {
		const { status, body } = await request(app).post('/posts').send(post);

		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Access Token is missing');
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
	await queryInterface.bulkDelete('Users', null, {
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
