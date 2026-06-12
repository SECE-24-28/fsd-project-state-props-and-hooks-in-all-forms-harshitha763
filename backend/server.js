require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { connectDB, seedProducts } = require('./database');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { router: authRouter } = require('./routes/auth');
app.use('/api/auth',     authRouter);
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/contact',  require('./routes/contact'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.get('/', (req, res) => res.json({ message: 'FashionCart API running', status: 'ok' }));

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

// Start server immediately so React can connect
app.listen(PORT, () => {
  console.log(`\n🚀 FashionCart API → http://localhost:${PORT}`);
  console.log(`   Health → http://localhost:${PORT}/api/health\n`);
});

// Connect to MongoDB with auto-retry every 15 seconds
let dbConnected = false;

async function tryConnectDB() {
  try {
    await connectDB();
    await seedProducts();
    dbConnected = true;
    console.log('✅ MongoDB connected and ready!');
  } catch(err) {
    console.error('⚠️  MongoDB not available — retrying in 15s...');
    console.error('   Resume cluster at: https://cloud.mongodb.com\n');
    setTimeout(tryConnectDB, 15000); // retry every 15 seconds
  }
}

tryConnectDB();

module.exports = app;
