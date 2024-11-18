const fs = require('fs');
const path = require('path');
const { User, Comment } = require('../models');

const seedDatabase = async () => {
  try {
    // Read the data from the JSON file
    const data = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
    const { users } = JSON.parse(data); // Assuming your JSON has a `users` key

    const userMap = {}; // To map emailAddress to user IDs

    // Create users first
    if (Array.isArray(users) && users.length > 0) {
      for (const user of users) {
        const existingUser = await User.findOne({ where: { emailAddress: user.emailAddress } });
        
        let newUser;

        if (!existingUser) {
          // Create a new user if not exists
          newUser = await User.create({
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress,
            password: user.password,
          });

          console.log(`User ${newUser.firstName} seeded successfully with ID: ${newUser.id}`);
          userMap[user.emailAddress] = newUser.id; // Store the ID for later
        } else {
          newUser = existingUser; // Use existing user
          console.log(`User ${newUser.firstName} already exists with ID: ${newUser.id}, skipping.`);
          userMap[user.emailAddress] = newUser.id; // Store the existing ID
        }
      }
    } else {
      console.log('No users to seed.');
      return; // Early exit if no users
    }

    // Now seed comments for the users
    const commentsToCreate = [];
    
    // Prepare comments based on the user mapping
    for (const user of users) {
      if (user.comments) {
        for (const comment of user.comments) {
          // Map user IDs from userMap using emailAddress
          const userId = userMap[user.emailAddress]; // Use the stored user ID

          // Check if the comment already exists for this user
          const existingComment = await Comment.findOne({
            where: { userId: userId, content: comment.content }
          });

          if (!existingComment) {
            commentsToCreate.push({
              content: comment.content,
              userId: userId, // Use the stored user ID
            });
          } else {
            console.log(`Comment already exists for user ID: ${userId}, skipping comment: "${comment.content}"`);
          }
        }
      }
    }

    // Filter out any undefined userIds
    const validCommentsToCreate = commentsToCreate.filter(comment => comment.userId !== undefined);

    if (validCommentsToCreate.length > 0) {
      await Comment.bulkCreate(validCommentsToCreate);
      console.log(`Comments seeded successfully!`);
    } else {
      console.log(`No valid comments found for seeding.`);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
