'use strict';

const app = require('../app');
const request = require('supertest');
const { sequelize, Author } = require('../models');
const { queryInterface } = sequelize;

let admins = require('../data/admins.json');
let staffs = require('../data/staffs.json');
const posts = require('../data/posts.json');
let categories = require('../data/categories.json');

beforeAll(async () => {
	try {
		admins = admins.map((data) => {
			data.createdAt = data.updatedAt = new Date();
			data.role = 'admin';
			return data;
		});
		staffs = staffs.map((data) => {
			data.createdAt = data.updatedAt = new Date();
			data.role = 'staff';
			return data;
		});
		categories = categories.map((data) => {
			data.createdAt = data.updatedAt = new Date();
			return data;
		});
		await queryInterface.bulkInsert('Authors', admins);
		await queryInterface.bulkInsert('Authors', staffs);
		await queryInterface.bulkInsert('Categories', categories);
		await queryInterface.bulkInsert('Posts', posts);
	} catch (error) {
		console.log(error);
	}
});

describe('Get all public posts', () => {
	it('should success get all public posts (200)', async () => {
		const { status, body } = await request(app).get('/pub/posts');

		// console.dir({ status, body }, { depth: null });
		// console.log({ status, body });
		expect(status).toBe(200);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('total', posts.length);
		expect(body).toHaveProperty('size', 10);
		expect(body).toHaveProperty('totalPage', Math.ceil(posts.length / 10));
		expect(body).toHaveProperty('currentPage', 1);
		expect(body).toHaveProperty('data', expect.any(Array));
		// first object in array data
		expect(body.data).toBeInstanceOf(Array);
		expect(body.data[0]).toBeInstanceOf(Object);
		expect(body.data[0]).toHaveProperty('id', 1);
		expect(body.data[0]).toHaveProperty('title', posts[0].title);
		expect(body.data[0]).toHaveProperty('content', posts[0].content);
		expect(body.data[0]).toHaveProperty('imgUrl', posts[0].imgUrl);
		expect(body.data[0]).toHaveProperty('categoryId', posts[0].categoryId);
		expect(body.data[0]).toHaveProperty('authorId', posts[0].authorId);
		expect(body.data[0]).toHaveProperty('createdAt', expect.any(String));
		expect(body.data[0]).toHaveProperty('updatedAt', expect.any(String));
		expect(body.data[0]).toHaveProperty('Author', expect.any(Object));
		// Author object data
		const author = await Author.findByPk(posts[0].authorId);
		expect(body.data[0].Author).not.toHaveProperty('password');
		expect(body.data[0].Author).toHaveProperty('id', author.id);
		expect(body.data[0].Author).toHaveProperty('username', author.username);
		expect(body.data[0].Author).toHaveProperty('email', author.email);
		expect(body.data[0].Author).toHaveProperty('role', author.role);
		expect(body.data[0].Author).toHaveProperty(
			'phoneNumber',
			author.phoneNumber
		);
		expect(body.data[0].Author).toHaveProperty('address', author.address);
		expect(body.data[0].Author).toHaveProperty('createdAt', expect.any(String));
		expect(body.data[0].Author).toHaveProperty('updatedAt', expect.any(String));
	});
	it('should success get all filtered public posts by category (200)', async () => {
		const { status, body } = await request(app).get(
			'/pub/posts?filter[category]=1'
		);

		console.dir({ status, body }, { depth: null });
		// console.log({ status, body });
		expect(status).toBe(200);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('total', 11);
		expect(body).toHaveProperty('size', 10);
		expect(body).toHaveProperty('totalPage', Math.ceil(11 / 10));
		expect(body).toHaveProperty('currentPage', 1);
		expect(body).toHaveProperty('data', expect.any(Array));
		expect(body.data[0]).toBeInstanceOf(Object);
		// first object in array data
		expect(body.data).toBeInstanceOf(Array);
		expect(body.data[0]).toBeInstanceOf(Object);
		expect(body.data[0]).toHaveProperty('id', 1);
		expect(body.data[0]).toHaveProperty('title', posts[0].title);
		expect(body.data[0]).toHaveProperty('content', posts[0].content);
		expect(body.data[0]).toHaveProperty('imgUrl', posts[0].imgUrl);
		expect(body.data[0]).toHaveProperty('categoryId', posts[0].categoryId);
		expect(body.data[0]).toHaveProperty('authorId', posts[0].authorId);
		expect(body.data[0]).toHaveProperty('createdAt', expect.any(String));
		expect(body.data[0]).toHaveProperty('updatedAt', expect.any(String));
		expect(body.data[0]).toHaveProperty('Author', expect.any(Object));
		// // Author object data
		const author = await Author.findByPk(posts[0].authorId);
		expect(body.data[0].Author).not.toHaveProperty('password');
		expect(body.data[0].Author).toHaveProperty('id', author.id);
		expect(body.data[0].Author).toHaveProperty('username', author.username);
		expect(body.data[0].Author).toHaveProperty('email', author.email);
		expect(body.data[0].Author).toHaveProperty('role', author.role);
		expect(body.data[0].Author).toHaveProperty(
			'phoneNumber',
			author.phoneNumber
		);
		expect(body.data[0].Author).toHaveProperty('address', author.address);
		expect(body.data[0].Author).toHaveProperty('createdAt', expect.any(String));
		expect(body.data[0].Author).toHaveProperty('updatedAt', expect.any(String));
	});
	it.only('should success get all public posts with pagination (200)', async () => {
		const { status, body } = await request(app).get('/pub/posts?page=3');

		console.dir({ status, body }, { depth: null });
		// console.log({ status, body });
		expect(status).toBe(200);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('total', posts.length);
		expect(body).toHaveProperty('size', 10);
		expect(body).toHaveProperty('totalPage', Math.ceil(posts.length / 10));
		expect(body).toHaveProperty('currentPage', 3);
		expect(body).toHaveProperty('data', expect.any(Array));
		expect(body.data).toBeInstanceOf(Array);
		expect(body.data).toHaveLength(5);
		expect(body.data[0]).toBeInstanceOf(Object);
		// first object in array data
		// expect(body.data).toBeInstanceOf(Array);
		// expect(body.data[0]).toBeInstanceOf(Object);
		// expect(body.data[0]).toHaveProperty('id', 1);
		// expect(body.data[0]).toHaveProperty('title', posts[0].title);
		// expect(body.data[0]).toHaveProperty('content', posts[0].content);
		// expect(body.data[0]).toHaveProperty('imgUrl', posts[0].imgUrl);
		// expect(body.data[0]).toHaveProperty('categoryId', posts[0].categoryId);
		// expect(body.data[0]).toHaveProperty('authorId', posts[0].authorId);
		// expect(body.data[0]).toHaveProperty('createdAt', expect.any(String));
		// expect(body.data[0]).toHaveProperty('updatedAt', expect.any(String));
		// expect(body.data[0]).toHaveProperty('Author', expect.any(Object));
		// // // Author object data
		// const author = await Author.findByPk(posts[0].authorId);
		// expect(body.data[0].Author).not.toHaveProperty('password');
		// expect(body.data[0].Author).toHaveProperty('id', author.id);
		// expect(body.data[0].Author).toHaveProperty('username', author.username);
		// expect(body.data[0].Author).toHaveProperty('email', author.email);
		// expect(body.data[0].Author).toHaveProperty('role', author.role);
		// expect(body.data[0].Author).toHaveProperty(
		// 	'phoneNumber',
		// 	author.phoneNumber
		// );
		// expect(body.data[0].Author).toHaveProperty('address', author.address);
		// expect(body.data[0].Author).toHaveProperty('createdAt', expect.any(String));
		// expect(body.data[0].Author).toHaveProperty('updatedAt', expect.any(String));
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
