'use strict';

const { verifyToken } = require("../helpers/jwt");
const { User } = require('../models');

const authentication = async (req, res, next) => {
  try {
    let { authorization } = req.headers;
    let token = authorization.replace('Bearer ', '');

    let { id } = verifyToken(token);
    const user = await User.findByPk(id);
    if (!user) throw { name: 'Unauthenticated' }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    }
    // console.log(req.user);

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authentication;