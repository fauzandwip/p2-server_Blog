'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.User);
      Post.belongsTo(models.Category);
    }
  }
  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Title is required' },
        notEmpty: { msg: 'Title is required' }
      }
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Content is required' },
        notEmpty: { msg: 'Content is required' }
      }
    },
    imgUrl: DataTypes.STRING,
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Category is required' },
        notEmpty: { msg: 'Category is required' }
      }
    },
    UserId:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'User Id is required' },
        notEmpty: { msg: 'User Id is required' }
      }
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};