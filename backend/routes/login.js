const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Login = require('../models/login');

// Create a new login entry
router.post('/', async (req, res) => {
  try {
    const loginData = new Login({
      _id: new mongoose.Types.ObjectId(),
      Name: req.body.Name,
      Age: req.body.Age,
      Email: req.body.Email,
      MobileNumber: req.body.MobileNumber,
    });

    await loginData.save();
    res.status(201).json(loginData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all login entries
router.get('/', async (req, res) => {
  try {
    const allLogins = await Login.find();
    res.status(200).json(allLogins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
