const mongoose = require('mongoose');

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected:', process.env.MONGO_URI);
}

// ── User ──────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  firstName:    { type: String, required: true },
  lastName:     { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  phone:        { type: String, default: '' },
  password:     { type: String, required: true },
  gender:       { type: String, default: '' },
  address: {
    line1: String, line2: String, city: String, state: String, pin: String
  }
}, { timestamps: true });

// ── Product ───────────────────────────────────────────────────────
const productSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  price:         { type: Number, required: true },
  original_price:{ type: Number, required: true },
  image:         { type: String, required: true },
  category:      { type: String, required: true },
  tag:           { type: String, required: true },
  badge:         { type: String, default: '' },
  description:   { type: String, default: '' },
  stock:         { type: Number, default: 100 }
}, { timestamps: true });

// ── Cart ──────────────────────────────────────────────────────────
const cartSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty:       { type: Number, default: 1 },
  size:      { type: String, default: '' },
  color:     { type: String, default: '' }
});

// ── Wishlist ──────────────────────────────────────────────────────
const wishlistSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
});
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

// ── Order ─────────────────────────────────────────────────────────
const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:     String,
  price:    Number,
  qty:      Number,
  size:     { type: String, default: '' },
  image:    { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderRef: { type: String, unique: true },
  status:   { type: String, default: 'Confirmed' },
  address:  String,
  payment:  String,
  subtotal: Number,
  tax:      Number,
  total:    Number,
  items:    [orderItemSchema]
}, { timestamps: true });

// ── Contact ───────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   { type: String, default: '' },
  subject: { type: String, required: true },
  message: { type: String, required: true }
}, { timestamps: true });

const User    = mongoose.model('User',    userSchema);
const Product = mongoose.model('Product', productSchema);
const Cart    = mongoose.model('Cart',    cartSchema);
const Wishlist= mongoose.model('Wishlist',wishlistSchema);
const Order   = mongoose.model('Order',   orderSchema);
const Contact = mongoose.model('Contact', contactSchema);

// ── Seed Products ─────────────────────────────────────────────────
async function seedProducts() {
  const count = await Product.countDocuments();
  if (count > 0) return;
  await Product.insertMany([
    { name: 'Floral Dress',    price: 1200, original_price: 1800, image: 'https://images.unsplash.com/photo-1496747611176-84322e1e57c?q=80&w=687&auto=format&fit=crop',  category: 'Women',       tag: 'women',       badge: 'New',     description: 'Beautiful floral dress perfect for summer.' },
    { name: 'Classic T-Shirt', price: 800,  original_price: 1000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=764&auto=format&fit=crop',  category: 'Men',         tag: 'men',         badge: 'Sale',    description: 'Premium quality cotton t-shirt.' },
    { name: 'Stylish Jacket',  price: 2500, original_price: 3500, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=687&auto=format&fit=crop',  category: 'Men',         tag: 'men',         badge: 'Hot',     description: 'Modern jacket with premium materials.' },
    { name: 'Casual Jeans',    price: 1500, original_price: 1900, image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?q=80&w=764&auto=format&fit=crop',  category: 'Unisex',      tag: 'unisex',      badge: '',        description: 'Classic blue jeans with perfect fit.' },
    { name: 'Summer Top',      price: 600,  original_price: 900,  image: 'https://images.unsplash.com/photo-1608231387042-0b1efb3faa38?q=80&w=764&auto=format&fit=crop',  category: 'Women',       tag: 'women',       badge: 'Sale',    description: 'Light and breezy summer top.' },
    { name: 'Polo Shirt',      price: 1000, original_price: 1200, image: 'https://images.unsplash.com/photo-1579833971225-2a0e3c7548e0?q=80&w=764&auto=format&fit=crop',  category: 'Men',         tag: 'men',         badge: '',        description: 'Classic polo shirt with premium fit.' },
    { name: 'Evening Gown',    price: 3200, original_price: 4500, image: 'https://images.unsplash.com/photo-1595777712802-6b7be0a54341?q=80&w=687&auto=format&fit=crop',  category: 'Women',       tag: 'women',       badge: 'Premium', description: 'Elegant evening gown for special occasions.' },
    { name: 'Denim Jacket',    price: 2200, original_price: 2800, image: 'https://images.unsplash.com/photo-1516762714551-8f157d9e1b07?q=80&w=687&auto=format&fit=crop',  category: 'Unisex',      tag: 'unisex',      badge: 'New',     description: 'Versatile denim jacket for any season.' },
    { name: 'Sneakers',        price: 2800, original_price: 3500, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=764&auto=format&fit=crop',  category: 'Unisex',      tag: 'unisex',      badge: 'Hot',     description: 'Trendy sneakers with superior comfort.' },
    { name: 'Leather Belt',    price: 700,  original_price: 900,  image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=687&auto=format&fit=crop',  category: 'Accessories', tag: 'accessories', badge: '',        description: 'Genuine leather belt with classic buckle.' },
    { name: 'Sun Hat',         price: 500,  original_price: 700,  image: 'https://images.unsplash.com/photo-1506629082632-32ca5dff2e48?q=80&w=687&auto=format&fit=crop',  category: 'Accessories', tag: 'accessories', badge: 'Sale',    description: 'Wide-brim sun hat for ultimate protection.' },
    { name: 'Winter Coat',     price: 4500, original_price: 6000, image: 'https://images.unsplash.com/photo-1539533057440-7fc97eab7527?q=80&w=687&auto=format&fit=crop',  category: 'Women',       tag: 'women',       badge: 'New',     description: 'Warm and stylish winter coat.' },
  ]);
  console.log('✅ Products seeded');
}

module.exports = { connectDB, seedProducts, User, Product, Cart, Wishlist, Order, Contact };
