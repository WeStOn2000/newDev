'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Comment extends Model {
    static associate(models) {
      // Define the one-to-one association with User
      Comment.belongsTo(models.User, {
        foreignKey: 'userId', 
        as: 'user' 
      });
    }
  }

  Comment.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "Content is required" },
        notEmpty: { msg: "Content cannot be empty" }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "User ID is required" }
      }
    },
    // You can add more fields here if needed
  }, {
    sequelize,
    modelName: 'Comment',
  });

  return Comment;
};
