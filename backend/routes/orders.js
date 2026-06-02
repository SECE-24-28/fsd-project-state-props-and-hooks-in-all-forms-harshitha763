const express = require('express');
const db      = require('../database');
const { auth } = require('./auth');
const router  = express.Router();

router.get('/', auth, (req, res) => {
  const orders = db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
  const result = orders.map(order => {
    const items = db.all('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    return { ...order, items };
  });
  res.json(result);
});

router.get('/:id', auth, (req, res) => {
  const order = db.get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const items = db.all('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
  res.json({ ...order, items });
});

router.post('/', auth, (req, res) => {
  const { address, payment } = req.body;
  if (!address || !payment) return res.status(400).json({ error: 'Address and payment required' });

  const cartItems = db.all(`
    SELECT c.qty, c.size, c.color, p.id as product_id, p.name, p.price, p.image
    FROM cart c JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `, [req.user.id]);

  if (!cartItems.length) return res.status(400).json({ error: 'Cart is empty' });

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const tax      = Math.round(subtotal * 0.05);
  const total    = subtotal + tax;
  const orderRef = 'FC' + Date.now();

  const result = db.run(
    'INSERT INTO orders (user_id, order_ref, address, payment, subtotal, tax, total) VALUES (?,?,?,?,?,?,?)',
    [req.user.id, orderRef, address, payment, subtotal, tax, total]
  );
  const orderId = result.lastInsertRowid;

  for (const item of cartItems) {
    db.run(
      'INSERT INTO order_items (order_id, product_id, name, price, qty, size, image) VALUES (?,?,?,?,?,?,?)',
      [orderId, item.product_id, item.name, item.price, item.qty, item.size, item.image]
    );
  }
  db.run('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

  res.status(201).json({ message: 'Order placed', orderId, orderRef });
});

router.put('/:id/cancel', auth, (req, res) => {
  const order = db.get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.status !== 'Confirmed') return res.status(400).json({ error: 'Only confirmed orders can be cancelled' });
  db.run("UPDATE orders SET status = 'Cancelled' WHERE id = ?", [req.params.id]);
  res.json({ message: 'Order cancelled' });
});

module.exports = router;
