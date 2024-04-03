const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt'); // You'll need to install bcrypt for password hashing
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const dotenv = require('dotenv');

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const secretKey = process.env.JWT_SECRET_KEY;

const { JWT } = require('google-auth-library');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const SERVICE_ACCOUNT_KEY_FILE = './service.json';
const CALENDAR_ID = '829076bf460b9a754f920e0d41b63fca8e319a161a62bb96329a1d56f46a22c2@group.calendar.google.com';

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/gm, '\n'),
  scopes: SCOPES,
  subject: process.env.GOOGLE_SERVICE_ACCOUNT_SUBJECT,
});


const calendar = google.calendar({ version: 'v3', auth });

const createCalendarEvent = async (userName, userEmail) => {
  const event = {
    summary: `${userName} Login Event`,
    description: 'This event is created when a user logs in.',
    start: {
      dateTime: new Date().toISOString(),
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: new Date(Date.now() + 600000).toISOString(), // 10 minutes later
      timeZone: 'Asia/Kolkata',
    },
    attendees: [{ email: userEmail }],
  };

  try {
    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
    });
    console.log('Calendar event created:', response.data.htmlLink);
  } catch (error) {
    console.error('Error creating calendar event:', error);
  }
};

const generateToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    // Include any other relevant user data
  };

  const options = {
    expiresIn: '1h', // Set the token expiration time
  };

  return jwt.sign(payload, secretKey, options);
};

const generateResetToken = (email, userId) => {
  const payload = {
    email,
    userId,
    // Include any other relevant data
  };

  const options = {
    expiresIn: '1h', // Set the token expiration time
  };

  return jwt.sign(payload, secretKey, options);
};
// Registration route
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique googleId for traditional registration
    const googleId = `traditional_${Date.now()}`;

    // Create a new user
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      googleId, // Assign the generated googleId
    });
    await newUser.save();
    await createCalendarEvent(username, email);


    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/google-signin', async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userId = payload['sub'];
    const email = payload['email'];
    const name = payload['name'];

    // Check if the user already exists in your database
    let user = await User.findOne({ email });

    if (!user) {
      // If the user doesn't exist, create a new user in your database
      user = new User({
        googleId: userId,
        email: email, // Use the email obtained from Google
        username: name, // Use the name obtained from Google
        // Include any other relevant user data
      });
      await user.save();

      // Generate and send a JWT token or session data for authentication
      const token = generateToken(user);

      res.status(200).json({ exists: false, message: 'User registered successfully', token });
    } else {
      // If the user exists, generate and send a JWT token or session data for authentication
      const token = generateToken(user);

      res.status(200).json({ exists: true, message: 'Google sign-in successful', token });
      await createCalendarEvent(name, email);

    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in your database
    const user = await User.findOne({ email });

    if (!user) {
      console.log('inavalid2')

      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('inavalid')

      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate and send a JWT token or session data for authentication
    const token = generateToken(user); // Implement your own token generation logic

    res.status(200).json({ success: true, message: 'Login successful', token });
    await createCalendarEvent(user.username, user.email);

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
};

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists in your database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a 4-digit OTP
    const otp = generateOTP();

    // Store the OTP in the user document (or any other suitable place)
    user.otp = otp;
    await user.save();

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Send the reset email with the OTP
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `You have requested a password reset. Please enter the following OTP: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if the user exists in your database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the OTP
    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    console.log('success');

    // OTP verification successful, proceed with the desired action (e.g., reset password)
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);a
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify the reset token and get the user ID from the payload
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;

    // Find the user by ID and update their password
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password and remove the resetToken
    user.password = hashedPassword;
    user.resetToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/generate-reset-token', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists in your database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a reset token
    const resetToken = generateResetToken(email, user._id); // Pass the user ID as well

    // Save the reset token in the user document
    user.resetToken = resetToken;
    await user.save();

    res.status(200).json({ success: true, token: resetToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add other routes for login, update, delete, etc.

module.exports = router;


