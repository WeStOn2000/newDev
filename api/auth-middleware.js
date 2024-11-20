const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('./models');

const authenticateUser = async (req, res, next) => {
  let message;

  // Extract the basic auth credentials from the request
  const credentials = auth(req);
  console.log('Credentials:', credentials);

  if (credentials) {
    try {
      // Find the user by email address
      let user = await User.findOne({ where: { emailAddress: credentials.name } });
      
      if (user) {
        // Existing user - compare password
        const authenticated = bcrypt.compareSync(credentials.pass, user.password);
        if (authenticated) {
          console.log(`Authentication successful for user: ${user.emailAddress}`);
          req.currentUser = user;
          return next();
        } else {
          message = `Authentication failed for user: ${user.emailAddress}`;
        }
      } else {
        // New user - create account
        if (req.path === '/api/users' && req.method === 'POST') {
          // This is a signup request
          req.body = {
            ...req.body,
            emailAddress: credentials.name,
            password: credentials.pass
          };
          return next(); // Proceed to signup route
        } else {
          message = `User not found for email address: ${credentials.name}`;
        }
      }
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    message = 'Auth header not found';
  }

  // Handle authentication errors
  console.warn(message);
  return res.status(401).json({ message: 'Access Denied' });
};

module.exports = authenticateUser;