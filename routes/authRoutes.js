const express = require('express');
const User = require('../models/User');
const router = express.Router();

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { username, fingerprintTemplate } = req.body;

    console.log('Received registration data:', { username, fingerprintTemplate });

    if (!username || !fingerprintTemplate) {
      return res.json({
        success: false,
        message: 'Username and fingerprint are required.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({
        success: false,
        message: 'Username already registered.',
      });
    }

    // Generate a secret for this user (later used for dynamic password)
    const secret = 'SECRET-' + Math.floor(Math.random() * 1000000);

    // Create and save new user
    const newUser = new User({
      username,
      fingerprintTemplate,
      secret,
    });

    await newUser.save();

    console.log('New user saved to DB:', newUser);

    return res.json({
      success: true,
      message: 'User registered and saved to DB.',
      secret, // send secret to frontend so QR page can use it
    });
  } catch (err) {
    console.error('Error in /api/register:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration.',
    });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { username, dynamicPassword } = req.body;

    console.log('Received login data:', { username, dynamicPassword });

    if (!username || !dynamicPassword) {
      return res.json({
        success: false,
        message: 'Username and dynamic password are required.',
      });
    }

    // 1️⃣ Check if user exists in DB
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        success: false,
        message: 'User not found. Please register first.',
      });
    }

    // 2️⃣ DEMO PASSWORD CHECK
    // Later this will be replaced by verifying TOTP generated from user.secret.
    if (dynamicPassword === '123456') {
      return res.json({
        success: true,
        message: 'Login successful (demo). User exists in DB.',
      });
    } else {
      return res.json({
        success: false,
        message: 'Invalid dynamic password (demo).',
      });
    }
  } catch (err) {
    console.error('Error in /api/login:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
    });
  }
});


module.exports = router;
