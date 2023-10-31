'use strict';

const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { User } = require('../models');

module.exports = class AuthController {
  static async addUser(req, res) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;
      const newUser = await User.create({ username, email, password, phoneNumber, address });
      res.status(201).json({
        id: newUser.id,
        email: newUser.email
      });
    } catch (error) {
      console.log(error);
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ message: error.errors[0].message });
        return
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email) {
        res.status(400).json({ message: 'Email is missing' });
        return
      }

      if (!password) {
        res.status(400).json({ message: 'Password is missing' });
        return
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ message: 'Invalid email' });
        return
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ message: 'Invalid password' });
        return
      }

      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}