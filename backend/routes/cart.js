const express = require('express');
const db      = require('../database');
const { auth } = require('./auth');
const router  = express.Router();

router.get('/', auth, (req, res) => {
  const items = db.all(`
    SELECT c.id, c.qty, c.size, c.color,
           p.id as product_id, p.name, p.price, p.original_price, p.image, p.category
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `, [req.user.id]);
  res.json(items);
});

router.post('/', auth, (req, res) => {
  const { productId, qty = 1, size = '', color = '' } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId required' });

  const existing = db.get('SELECT id, qty FROM cart WHERE user_id=? AND product_id=? AND size=? AND color=?', [req.user.id, productId, size, color]);
  if (existing) {
    db.run('UPDATE cart SET qty = ? WHERE id = ?', [existing.qty + qty, existing.id]);
  } else {
    db.run('INSERT INTO cart (user_id, product_id, qty, size, color) VALUES (?,?,?,?,?)', [req.user.id, productId, qty, size, color]);
  }
  res.json({ message: 'Added to cart' });
});

router.put('/:id', auth, (req, res) => {
  const { qty } = req.body;
  if (qty <= 0) {
    db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    return res.json({ message: 'Removed' });
  }
  db.run('UPDATE cart SET qty = ? WHERE id = ? AND user_id = ?', [qty, req.params.id, req.user.id]);
  res.json({ message: 'Updated' });
});

router.delete('/:id', auth, (req, res) => {
  db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ message: 'Removed' });
});

router.delete('/', auth, (req, res) => {
  db.run('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
