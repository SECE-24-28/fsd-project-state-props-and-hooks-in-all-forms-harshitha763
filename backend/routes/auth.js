const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../database');
const router  = express.Router();

const SECRET = process.env.JWT_SECRET || 'fallback_secret';

function makeToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' });
}

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

router.post('/register', (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;
  if (!firstName || !lastName || !email || !password)
    return res.status(400).json({ error: 'All fields are required' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const existing = db.get('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const hash = bcrypt.hashSync(password, 10);
  const result = db.run(
    'INSERT INTO users (first_name, last_name, email, phone, password) VALUES (?,?,?,?,?)',
    [firstName, lastName, email, phone || '', hash]
  );

  const user = db.get('SELECT id, first_name, last_name, email, phone FROM users WHERE id = ?', [result.lastInsertRowid]);
  res.status(201).json({ token: makeToken(user), user: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email, phone: user.phone } });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = db.get('SELECT * FROM users WHERE email = ?', [email]);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid email or password' });

  res.json({ token: makeToken(user), user: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email, phone: user.phone } });
});

router.get('/me', auth, (req, res) => {
  const user = db.get('SELECT id, first_name, last_name, email, phone, gender, address_line1, address_line2, city, state, pin, created_at FROM users WHERE id = ?', [req.user.id]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email, phone: user.phone, gender: user.gender, address: { line1: user.address_line1, line2: user.address_line2, city: user.city, state: user.state, pin: user.pin }, createdAt: user.created_at });
});

router.put('/profile', auth, (req, res) => {
  const { firstName, lastName, phone, gender } = req.body;
  db.run('UPDATE users SET first_name=?, last_name=?, phone=?, gender=? WHERE id=?', [firstName, lastName, phone, gender, req.user.id]);
  res.json({ message: 'Profile updated' });
});

router.put('/address', auth, (req, res) => {
  const { line1, line2, city, state, pin } = req.body;
  db.run('UPDATE users SET address_line1=?, address_line2=?, city=?, state=?, pin=? WHERE id=?', [line1, line2, city, state, pin, req.user.id]);
  res.json({ message: 'Address updated' });
});

router.put('/password', auth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = db.get('SELECT password FROM users WHERE id = ?', [req.user.id]);
  if (!bcrypt.compareSync(currentPassword, user.password))
    return res.status(400).json({ error: 'Current password is incorrect' });
  if (newPassword.length < 6)
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  const hash = bcrypt.hashSync(newPassword, 10);
  db.run('UPDATE users SET password = ? WHERE id = ?', [hash, req.user.id]);
  res.json({ message: 'Password changed successfully' });
});

module.exports = { router, auth };
