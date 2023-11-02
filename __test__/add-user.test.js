const app = require('../app');
const request = require('supertest');
const { sequelize, Author } = require('../models');
const { signToken } = require('../helpers/jwt');
const { queryInterface } = sequelize;

const authorStaff = {
	email: 'staff1@gmail.com',
	password: '12345',
};

const authorStaff2 = {
	email: 'staff2@gmail.com',
	password: '12345',
};

const authorAdmin = {
	email: 'admin1@gmail.com',
	password: '12345',
	role: 'admin',
};

let token;

beforeAll(async () => {
	try {
		const newAdmin = await Author.create(authorAdmin);
		token = signToken({ id: newAdmin.id });
		await Author.create(authorStaff2);
	} catch (error) {
		console.log(error);
	}
});

describe('Add author staff', () => {
	it('should success create author staff (200)', async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.set('Authorization', `Bearer ${token}`)
			.send(authorStaff);

		expect(status).toBe(201);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('id', 3);
		expect(body).toHaveProperty('email', authorStaff.email);
	});
	it("should error while author doesn't input email (400)", async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.set('Authorization', `Bearer ${token}`)
			.send({
				password: authorStaff.password,
			});

		expect(status).toBe(400);
		expect(body).toBeInstanceOf(Object);
		expect(body.messages).toBeInstanceOf(Array);
		expect(body.messages).toContain('Email is required');
	});
	it("should error while author doesn't input password (400)", async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: authorStaff.email,
			});

		expect(status).toBe(400);
		expect(body).toBeInstanceOf(Object);
		expect(body.messages).toBeInstanceOf(Array);
		expect(body.messages).toContain('Password is required');
	});
	it('should error while author input empty email (400)', async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: '',
				password: authorStaff.password,
			});

		expect(status).toBe(400);
		expect(body).toBeInstanceOf(Object);
		expect(body.messages).toBeInstanceOf(Array);
		expect(body.messages).toContain('Email is required');
	});
	it('should error while author input empty password (400)', async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: authorStaff.email,
				password: '',
			});

		expect(status).toBe(400);
		expect(body).toBeInstanceOf(Object);
		expect(body.messages).toBeInstanceOf(Array);
		expect(body.messages).toContain('Password is required');
	});
	it('should error while email is already exists (409)', async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.set('Authorization', `Bearer ${token}`)
			.send(authorStaff2);

		// console.log(body);
		expect(status).toBe(409);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Email already exists');
	});
	it('should error while email is invalid format (400)', async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: 'test.com',
				password: authorStaff.password,
			});

		expect(status).toBe(400);
		expect(body).toBeInstanceOf(Object);
		expect(body.messages).toBeInstanceOf(Array);
		expect(body.messages).toContain('Invalid email format');
	});
	it('should error while author is not login (401)', async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.send(authorStaff);

		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'You must login first');
	});
	it('should error while acces_token is invalid (401)', async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.set('Authorization', `Bearer randomString`)
			.send(authorStaff);

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
});
