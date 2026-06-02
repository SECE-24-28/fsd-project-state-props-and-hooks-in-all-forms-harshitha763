const express = require('express');
const db      = require('../database');
const { auth } = require('./auth');
const router  = express.Router();

router.get('/', auth, (req, res) => {
  const items = db.all(`
    SELECT p.* FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
  `, [req.user.id]);
  res.json(items);
});

router.get('/ids', auth, (req, res) => {
  const ids = db.all('SELECT product_id FROM wishlist WHERE user_id = ?', [req.user.id]).map(r => r.product_id);
  res.json(ids);
});

router.post('/', auth, (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId required' });

  const existing = db.get('SELECT id FROM wishlist WHERE user_id=? AND product_id=?', [req.user.id, productId]);
  if (existing) {
    db.run('DELETE FROM wishlist WHERE id = ?', [existing.id]);
    return res.json({ action: 'removed' });
  }
  db.run('INSERT INTO wishlist (user_id, product_id) VALUES (?,?)', [req.user.id, productId]);
  res.json({ action: 'added' });
});

router.delete('/', auth, (req, res) => {
  db.run('DELETE FROM wishlist WHERE user_id = ?', [req.user.id]);
  res.json({ message: 'Wishlist cleared' });
});

module.exports = router;
