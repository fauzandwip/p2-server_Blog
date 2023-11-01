const app = require('../app');
const request = require('supertest');
const { sequelize, User } = require('../models');
const { signToken } = require('../helpers/jwt');
const { queryInterface } = sequelize;

const userStaff = {
	email: 'staff1@gmail.com',
	password: '12345',
};

const userStaff2 = {
	email: 'staff2@gmail.com',
	password: '12345',
};

const userAdmin = {
	email: 'admin1@gmail.com',
	password: '12345',
	role: 'admin',
};

let token;

beforeAll(async () => {
	const newAdmin = await User.create(userAdmin);
	token = signToken({ id: newAdmin.id });
	await User.create(userStaff2);
});

describe('Add user staff', () => {
	it('should success create user staff (200)', async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.set('Authorization', `Bearer ${token}`)
			.send(userStaff);

		expect(status).toBe(201);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('id', 3);
		expect(body).toHaveProperty('email', userStaff.email);
	});
	it("should error while user doesn't input email (400)", async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.set('Authorization', `Bearer ${token}`)
			.send({
				password: userStaff.password,
			});

		expect(status).toBe(400);
		expect(body).toBeInstanceOf(Object);
		expect(body.messages).toBeInstanceOf(Array);
		expect(body.messages).toContain('Email is required');
	});
	it("should error while user doesn't input password (400)", async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: userStaff.email,
			});

		expect(status).toBe(400);
		expect(body).toBeInstanceOf(Object);
		expect(body.messages).toBeInstanceOf(Array);
		expect(body.messages).toContain('Password is required');
	});
	it('should error while user input empty email (400)', async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: '',
				password: userStaff.password,
			});

		expect(status).toBe(400);
		expect(body).toBeInstanceOf(Object);
		expect(body.messages).toBeInstanceOf(Array);
		expect(body.messages).toContain('Email is required');
	});
	it('should error while user input empty password (400)', async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: userStaff.email,
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
			.send(userStaff2);

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
				password: userStaff.password,
			});

		expect(status).toBe(400);
		expect(body).toBeInstanceOf(Object);
		expect(body.messages).toBeInstanceOf(Array);
		expect(body.messages).toContain('Invalid email format');
	});
	it('should error while acces_token is undefined/null (401)', async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.send(userStaff);

		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Access Token is missing');
	});
	it('should error while acces_token is invalid (401)', async () => {
		const { status, body } = await request(app)
			.post('/add-user')
			.set('Authorization', `Bearer randomString`)
			.send(userStaff);

		expect(status).toBe(401);
		expect(body).toBeInstanceOf(Object);
		expect(body).toHaveProperty('message', 'Invalid token');
	});
});

afterAll(async () => {
	await queryInterface.bulkDelete('Users', null, {
		truncate: true,
		cascade: true,
		restartIdentity: true,
	});
});
