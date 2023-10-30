'use strict';

const { Post } = require('../models');

module.exports = class PostController {
  static async getPosts(req, res) {
    try {
      const posts = await Post.findAll();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}