const app = require('../app');
const request = require('supertest');
const { sequelize, User } = require('../models');
const { queryInterface } = sequelize;

const userAdmin = {
	email: 'admin1@gmail.com',
	password: '12345',
};

// const userStaff = {
// 	email: 'staff1@gmail.com',
// 	password: '12345',
// };

beforeAll(async () => {
	// await User.create(userStaff);
	await User.create({ ...userAdmin, role: 'admin' });
});

describe('User Admin login', () => {
	it('should success login with json response', async () => {
		const { status, body } = await request(app).post('/login').send(userAdmin);
		expect(status).toBe(200);
		expect(body).toHaveProperty('access_token', expect.any(String));
		expect(body).toHaveProperty('email', userAdmin.email);
		expect(body).toHaveProperty('role', 'admin');
	});

	it('should error while email is missing', async () => {
		const { status, body } = await request(app).post('/login').send({
			email: '',
			password: userAdmin.password,
		});
		expect(status).toBe(400);
		expect(body).toHaveProperty('message', 'Email is missing');
	});

	it('should error while password is missing', async () => {
		const { status, body } = await request(app).post('/login').send({
			email: userAdmin.email,
			password: '',
		});
		expect(status).toBe(400);
		expect(body).toHaveProperty('message', 'Password is missing');
	});

	it('should error while email is invalid', async () => {
		const { status, body } = await request(app).post('/login').send({
			email: 'admin',
			password: userAdmin.password,
		});
		expect(status).toBe(401);
		expect(body).toHaveProperty('message', 'Invalid email');
	});

	it('should error while password is invalid', async () => {
		const { status, body } = await request(app).post('/login').send({
			email: userAdmin.email,
			password: '123',
		});
		expect(status).toBe(401);
		expect(body).toHaveProperty('message', 'Invalid password');
	});
});

// describe('User Staff login', () => {
// 	it('should success login with json response', async () => {
// 		const { status, body } = await request(app).post('/login').send(userStaff);
// 		// console.log('>>>>>>>>', status, body);
// 		expect(status).toBe(200);
// 		expect(body).toHaveProperty('access_token', expect.any(String));
// 		expect(body).toHaveProperty('email', userStaff.email);
// 		expect(body).toHaveProperty('role', 'staff');
// 	});
// });

afterAll(async () => {
	await queryInterface.bulkDelete('Users', null, {
		truncate: true,
		cascade: true,
		restartIdentity: true,
	});
});
