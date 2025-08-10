const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// Add new contact
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).send(contact);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).send(contacts);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
