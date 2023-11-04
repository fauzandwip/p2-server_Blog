const app = require('../app');
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

let tokenAdmin, tokenStaff;

beforeAll(async () => {
	try {
		const newAdmin = await Author.create(authorAdmin);
		const newStaff = await Author.create(authorStaff);
		await Category.create({ name: 'Sport' });
		tokenAdmin = signToken({ id: newAdmin.id });
		tokenStaff = signToken({ id: newStaff.id });
	} catch (error) {
		console.log(error);
	}
});

beforeEach(async () => {
	try {
		const post = {
			title: "Let's Jogging",
			content: 'Jogging makes the body fresh',
			imgUrl: 'http://testUrl.com',
			categoryId: 1,
			authorId: 1,
		};

		await queryInterface.bulkDelete('Posts', null, {
			truncate: true,
			cascade: true,
			restartIdentity: true,
		});

		const newPost = await Post.create(post);
	} catch (error) {
		console.log(error);
	}
});

describe('Delete post by id', () => {
	it('should success delete post by id (200)', async () => {
		const { status, body } = await request(app)
			.delete(`/posts/${1}`)
			.set('Authorization', `Bearer ${tokenAdmin}`);

		expect(status).toBe(200);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Post success to delete');
	});
	it('should error while author is not login (missing access_token) (401)', async () => {
		const { status, body } = await request(app).delete(`/posts/${1}`);

		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Token must be provided');
	});
	it('should error while acces_token is invalid (401)', async () => {
		const { status, body } = await request(app)
			.delete(`/posts/${1}`)
			.set('Authorization', `Bearer randomString`);

		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Invalid token');
	});
	it('should error while post id not found (404)', async () => {
		const { status, body } = await request(app)
			.delete(`/posts/${3}`)
			.set('Authorization', `Bearer ${tokenAdmin}`);

		expect(status).toBe(404);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Post with id 3 not found');
	});
	it(`should error while staff update posts that aren't their own (403)`, async () => {
		const { status, body } = await request(app)
			.delete(`/posts/${1}`)
			.set('Authorization', `Bearer ${tokenStaff}`);

		expect(status).toBe(403);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', `You don't have permission`);
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
