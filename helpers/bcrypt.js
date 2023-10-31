'use strict';

const bcrypt = require('bcryptjs');

const hasPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

const comparePassword = (inputPassword, password) => {
  return bcrypt.compareSync(inputPassword, password);
}

module.exports = {
  hasPassword,
  comparePassword
}