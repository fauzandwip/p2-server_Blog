'use strict';

const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { User } = require('../models');

module.exports = class AuthController {
  static async addUser(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;
      const newUser = await User.create({ username, email, password, phoneNumber, address });

      res.status(201).json({
        id: newUser.id,
        email: newUser.email
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) {
        throw {
          name: 'BadRequest',
          message: 'Email is missing'
        }
      }

      if (!password) {
        throw {
          name: 'BadRequest',
          message: 'Password is missing'
        }
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw {
          name: 'Unauthenticated',
          message: 'Invalid email'
        }
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        throw {
          name: 'Unauthenticated',
          message: 'Invalid password'
        }
      }

      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }
}