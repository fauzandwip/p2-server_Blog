const app = require('../app');
const request = require('supertest');
const { sequelize, User } = require('../models');
const { queryInterface } = sequelize;

const userAdmin = {
	email: 'admin1@gmail.com',
	password: '12345',
};

beforeAll(async () => {
	await User.create({ ...userAdmin, role: 'admin' });
});

describe('User Admin login', () => {
	it('should success login (200)', async () => {
		const { status, body } = await request(app).post('/login').send(userAdmin);
		expect(status).toBe(200);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('access_token', expect.any(String));
		expect(body).toHaveProperty('email', userAdmin.email);
		expect(body).toHaveProperty('role', 'admin');
	});

	it('should error while email is empty/null (400)', async () => {
		const { status, body } = await request(app).post('/login').send({
			email: '',
			password: userAdmin.password,
		});
		expect(status).toBe(400);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Email is required');
	});

	it('should error while password is empty/null (400)', async () => {
		const { status, body } = await request(app).post('/login').send({
			email: userAdmin.email,
			password: '',
		});
		expect(status).toBe(400);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Password is required');
	});

	it('should error while email is invalid (401)', async () => {
		const { status, body } = await request(app).post('/login').send({
			email: 'admin',
			password: userAdmin.password,
		});
		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Invalid email');
	});

	it('should error while password is invalid (401)', async () => {
		const { status, body } = await request(app).post('/login').send({
			email: userAdmin.email,
			password: '123',
		});
		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Invalid password');
	});
});

afterAll(async () => {
	await queryInterface.bulkDelete('Users', null, {
		truncate: true,
		cascade: true,
		restartIdentity: true,
	});
});
