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

const post = {
	title: "Let's Jogging",
	content: 'Jogging makes the body fresh',
	imgUrl: 'http://testUrl.com',
	categoryId: 1,
	authorId: 1,
};

const newPost = {
	title: "Let's Play Football Guys",
	content: 'Play Football makes the body fresh',
	imgUrl: 'http://football.com',
	categoryId: 1,
};

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

describe('Update post by id', () => {
	it('should success update post by id (200)', async () => {
		const { status, body } = await request(app)
			.put(`/posts/${1}`)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send(newPost);

		// console.dir({ status, body }, { depth: null });
		expect(status).toBe(200);
		expect(body).toBeInstanceOf(Object);
		// * all property
		expect(body).toHaveProperty('id', 1);
		expect(body).toHaveProperty('title', newPost.title);
		expect(body).toHaveProperty('content', newPost.content);
		expect(body).toHaveProperty('imgUrl', newPost.imgUrl);
		expect(body).toHaveProperty('categoryId', newPost.categoryId);
		expect(body).toHaveProperty('authorId', post.authorId);
		expect(body).toHaveProperty('createdAt', expect.any(String));
		expect(body).toHaveProperty('updatedAt', expect.any(String));
	});
	it('should error while author is not login (missing access_token) (401)', async () => {
		const { status, body } = await request(app).put(`/posts/${1}`);

		// console.log(status, body);
		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'You must login first');
	});
	it('should error while acces_token is invalid (401)', async () => {
		const { status, body } = await request(app)
			.put(`/posts/${1}`)
			.set('Authorization', `Bearer randomString`);

		// console.log(status, body);
		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Invalid token');
	});
	it('should error while post id is not found (404)', async () => {
		const { status, body } = await request(app)
			.put(`/posts/${3}`)
			.set('Authorization', `Bearer ${tokenAdmin}`);

		// console.dir({ status, body });
		expect(status).toBe(404);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Post with id 3 is not found');
	});
	it(`should error while staff update posts that aren't their own (403)`, async () => {
		const { status, body } = await request(app)
			.put(`/posts/${1}`)
			.set('Authorization', `Bearer ${tokenStaff}`)
			.send(newPost);

		// console.dir({ status, body }, { depth: null });
		expect(status).toBe(403);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', `You don't have permission`);
	});
	it('should error while required input column is empty/null (400)', async () => {
		const { status, body } = await request(app)
			.put(`/posts/${1}`)
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send({
				title: '',
				content: '',
				categoryId: null,
			});

		// console.log({ status, body });
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
