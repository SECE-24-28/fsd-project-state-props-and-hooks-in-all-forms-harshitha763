require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { initDb } = require('./database');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend')));

const { router: authRouter } = require('./routes/auth');
app.use('/api/auth',     authRouter);
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/contact',  require('./routes/contact'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 FashionCart server running at http://localhost:${PORT}`);
    console.log(`   Frontend  → http://localhost:${PORT}/login.html`);
    console.log(`   API docs  → http://localhost:${PORT}/api/health\n`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
