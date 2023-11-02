const app = require('../app');
const request = require('supertest');
const { sequelize, Author, Category, Post } = require('../models');
const { signToken } = require('../helpers/jwt');
const { queryInterface } = sequelize;

const authorStaff = {
	email: 'staff1@gmail.com',
	password: '12345',
};

const dateNow = new Date();
const categories = [
	{
		name: 'Sport',
		createdAt: dateNow,
		updatedAt: dateNow,
	},
	{
		name: 'Fiction',
		createdAt: dateNow,
		updatedAt: dateNow,
	},
	{
		name: 'Technology',
		createdAt: dateNow,
		updatedAt: dateNow,
	},
	{
		name: 'Health',
		createdAt: dateNow,
		updatedAt: dateNow,
	},
];

let token;

beforeAll(async () => {
	try {
		const newStaff = await Author.create(authorStaff);
		await queryInterface.bulkInsert('Categories', categories);
		token = signToken({ id: newStaff.id });
	} catch (error) {
		console.log(error);
	}
});

describe('Get all categories', () => {
	it('should success get all categories (200)', async () => {
		const { status, body } = await request(app)
			.get(`/categories`)
			.set('Authorization', `Bearer ${token}`);

		// console.dir({ status, body });
		expect(status).toBe(200);
		expect(body).toBeInstanceOf(Array);
		expect(body).toHaveLength(categories.length);
		expect(body).toContainEqual(expect.any(Object));
		// category first index
		expect(body[0]).toBeInstanceOf(Object);
		expect(body[0]).toHaveProperty('id', 1);
		expect(body[0]).toHaveProperty('name', categories[0].name);
		expect(body[0]).toHaveProperty('createdAt', expect.any(String));
		expect(body[0]).toHaveProperty('updatedAt', expect.any(String));
	});
	it('should error while author is not login (missing access_token) (401)', async () => {
		const { status, body } = await request(app).get(`/categories`);

		// console.log(status, body);
		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Token must be provided');
	});
	it('should error while acces_token is invalid (401)', async () => {
		const { status, body } = await request(app)
			.get(`/categories`)
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
