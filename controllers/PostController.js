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

  static async createPost(req, res) {
    try {
      const { title, content, imgUrl, CategoryId, UserId } = req.body;
      const newPost = await Post.create({ title, content, imgUrl, CategoryId, UserId });
      res.status(201).json(newPost);
    } catch (error) {
      console.log(error);
      if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ message: error.errors[0].message });
        return
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  static async getPost(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id);

      if (!post) {
        res.status(404).json({ message: 'Error Not Found' });
        return
      }
      
      res.status(200).json(post);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}