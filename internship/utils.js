import crypto from './rn-crypto';
import jwt from 'jsonwebtoken';

const generateResetToken = (email) => {
  const payload = {
    email,
    // Include any other relevant data
  };

  const options = {
    expiresIn: '1h', // Set the token expiration time
  };

  // Replace this with the appropriate secret key for your React Native app
  const secretKey = 'your_react_native_secret_key';

  return jwt.sign(payload, secretKey, options);
};

export default generateResetToken;