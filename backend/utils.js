// utils.js
const jwt = require('jsonwebtoken');

const secretKey = '7324wrefdashwi4r3esrnoh4qyuhewf'; // Move the secretKey here if needed

const generateResetToken = (email) => {
  const payload = {
    email,
    // Include any other relevant data
  };

  const options = {
    expiresIn: '1h', // Set the token expiration time
  };

  return jwt.sign(payload, secretKey, options);
};

module.exports = { generateResetToken };