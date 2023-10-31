'use strict';

const { Post, User } = require('../models');

module.exports = class PostController {
  static async getPosts(req, res, next) {
    try {
      const posts = await Post.findAll({
        include: {
          model: User,
          attributes: {
            exclude: ['password']
          }
        }
      });
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }

  static async createPost(req, res, next) {
    try {
      const { title, content, imgUrl, CategoryId, UserId } = req.body;
      const newPost = await Post.create({ title, content, imgUrl, CategoryId, UserId });

      res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  }

  static async getPost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id);

      if (!post) {
        throw {
          name: 'NotFound',
          message: `Post with id ${id} is not found`
        }
      }
      
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  static async updatePost(req, res, next) {
    try {
      const { id } = req.params;
      const { title, content, imgUrl, CategoryId, UserId } = req.body;
      const post = await Post.findByPk(id);

      if (!post) {
        throw {
          name: 'NotFound',
          message: `Post with id ${id} is not found`
        }
      }

      const updatedPost = await post.update({ title, content, imgUrl, CategoryId, UserId });
      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  }

  static async destroyPost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id);

      if (!post) {
        throw {
          name: 'NotFound',
          message: `Post with id ${id} is not found`
        }
      }

      await post.destroy();
      res.status(200).json({
        message: `Post with id ${id} has been successfully deleted`
      });
    } catch (error) {
      next(error);
    }
  }
}