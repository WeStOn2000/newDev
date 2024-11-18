/*
=> This file contains RestApi concepts and Sequelize ORM methods 
*/ 
const express = require('express');//acquires express from node modules
const router = express.Router();//creating an express application
const {User, Comment} = require('../models');//acquires models from index.js in models folder

// Global async function 
const asyncHandler = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };


//Get
router.get('/user', asyncHandler(async (req, res) => {
    // Fetch all users and their comments
    const usersWithComments = await User.findAll({
      include: [
        {
          model: Comment,
          as: 'comments', 
          attributes: ['content']
        },
      ],
    });
  
    // If no users are found
    if (!usersWithComments.length) {
      return res.status(404).json({ message: 'No users found' });
    }else{
  
    // Send all users and their comments as a response
    res.status(200).json(usersWithComments);
    }
  }));


module.exports = router;