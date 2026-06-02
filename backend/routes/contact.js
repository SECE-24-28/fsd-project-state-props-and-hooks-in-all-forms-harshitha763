const express = require('express');
const db      = require('../database');
const router  = express.Router();

router.post('/', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !subject || !message)
    return res.status(400).json({ error: 'name, email, subject and message are required' });

  db.run('INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?,?,?,?,?)',
    [name, email, phone || '', subject, message]);

  res.status(201).json({ message: 'Message received. We will get back to you within 24 hours.' });
});

module.exports = router;
