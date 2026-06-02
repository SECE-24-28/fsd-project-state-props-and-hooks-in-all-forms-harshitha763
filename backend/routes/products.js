const express = require('express');
const db      = require('../database');
const router  = express.Router();

router.get('/', (req, res) => {
  const { tag, search, sort } = req.query;
  let sql    = 'SELECT * FROM products WHERE 1=1';
  const args = [];

  if (tag && tag !== 'all') { sql += ' AND tag = ?'; args.push(tag); }
  if (search) { sql += ' AND (name LIKE ? OR category LIKE ?)'; args.push(`%${search}%`, `%${search}%`); }

  if (sort === 'price-asc')  sql += ' ORDER BY price ASC';
  else if (sort === 'price-desc') sql += ' ORDER BY price DESC';
  else if (sort === 'name')  sql += ' ORDER BY name ASC';
  else sql += ' ORDER BY id ASC';

  res.json(db.all(sql, args));
});

router.get('/:id', (req, res) => {
  const product = db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

module.exports = router;
