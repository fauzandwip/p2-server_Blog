'use strict';

const app = require('../app');
const request = require('supertest');
const { sequelize, Author, Category } = require('../models');
const { signToken } = require('../helpers/jwt');
const { queryInterface } = sequelize;

const authorStaff = {
	email: 'staff1@gmail.com',
	password: '12345',
};

let dateNow = new Date();
let dateNowString = dateNow.toISOString();

const posts = [
	{
		title: "Let's Jogging",
		content: 'Jogging makes the body fresh',
		imgUrl: 'http://testUrl.com',
		categoryId: 1,
		authorId: 1,
		createdAt: dateNow,
		updatedAt: dateNow,
	},
	{
		title: "Let's Play Football",
		content: 'Play Football makes the body fresh',
		imgUrl: 'http://testUrl.com',
		categoryId: 1,
		authorId: 1,
		createdAt: dateNow,
		updatedAt: dateNow,
	},
];

let token;

beforeAll(async () => {
	try {
		const newStaff = await Author.create(authorStaff);
		await Category.create({ name: 'Sport' });
		await queryInterface.bulkInsert('Posts', posts);
		token = signToken({ id: newStaff.id });
	} catch (error) {
		console.log(error);
	}
});

describe('Get all posts', () => {
	it('should success get all posts (200)', async () => {
		const { status, body } = await request(app)
			.get('/posts')
			.set('Authorization', `Bearer ${token}`);

		// console.dir({ status, body }, { depth: null });
		expect(status).toBe(200);
		expect(body).toBeInstanceOf(Array);
		expect(body).toHaveLength(2);
		expect(body).toContainEqual(expect.any(Object));
		// object first index
		expect(body[0]).toBeInstanceOf(Object);
		expect(body[0]).toHaveProperty('id', 1);
		expect(body[0]).toHaveProperty('title', posts[0].title);
		expect(body[0]).toHaveProperty('content', posts[0].content);
		expect(body[0]).toHaveProperty('imgUrl', posts[0].imgUrl);
		expect(body[0]).toHaveProperty('categoryId', posts[0].categoryId);
		expect(body[0]).toHaveProperty('authorId', posts[0].authorId);
		expect(body[0]).toHaveProperty('createdAt', dateNowString);
		expect(body[0]).toHaveProperty('updatedAt', dateNowString);
		// category
		expect(body[0]).toHaveProperty('Category', expect.any(Object));
		expect(body[0].Category).toHaveProperty('id', 1);
		expect(body[0].Category).toHaveProperty('name', 'Sport');
		// author
		expect(body[0]).toHaveProperty('Author', expect.any(Object));
		expect(body[0].Author).not.toHaveProperty('password');
		expect(body[0].Author).toHaveProperty('id', 1);
		expect(body[0].Author).toHaveProperty('username');
		expect(body[0].Author).toHaveProperty('email', authorStaff.email);
		expect(body[0].Author).toHaveProperty('role', 'staff');
		expect(body[0].Author).toHaveProperty('phoneNumber');
		expect(body[0].Author).toHaveProperty('address');
		expect(body[0].Author).toHaveProperty('createdAt', expect.any(String));
		expect(body[0].Author).toHaveProperty('updatedAt', expect.any(String));
	});
	it('should error while author is not login (401)', async () => {
		const { status, body } = await request(app).get('/posts');

		// console.log(status, body);
		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Token must be provided');
	});
	it('should error while acces_token is invalid (401)', async () => {
		const { status, body } = await request(app)
			.get('/posts')
			.set('Authorization', `Bearer randomString`);

		// console.log(status, body);
		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Invalid token');
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
