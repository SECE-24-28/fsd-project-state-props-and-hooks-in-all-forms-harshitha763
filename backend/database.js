const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'fashioncart.db');

let db;

async function initDb() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON;');

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name  TEXT NOT NULL,
      email      TEXT UNIQUE NOT NULL,
      phone      TEXT,
      password   TEXT NOT NULL,
      gender     TEXT,
      address_line1 TEXT,
      address_line2 TEXT,
      city       TEXT,
      state      TEXT,
      pin        TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT NOT NULL,
      price         INTEGER NOT NULL,
      original_price INTEGER NOT NULL,
      image         TEXT NOT NULL,
      category      TEXT NOT NULL,
      tag           TEXT NOT NULL,
      badge         TEXT DEFAULT '',
      description   TEXT DEFAULT '',
      stock         INTEGER DEFAULT 100,
      created_at    TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cart (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      qty        INTEGER NOT NULL DEFAULT 1,
      size       TEXT DEFAULT '',
      color      TEXT DEFAULT '',
      FOREIGN KEY (user_id)    REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      UNIQUE(user_id, product_id),
      FOREIGN KEY (user_id)    REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id      INTEGER NOT NULL,
      order_ref    TEXT UNIQUE NOT NULL,
      status       TEXT DEFAULT 'Confirmed',
      address      TEXT,
      payment      TEXT,
      subtotal     INTEGER,
      tax          INTEGER,
      total        INTEGER,
      created_at   TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id   INTEGER NOT NULL,
      product_id INTEGER,
      name       TEXT NOT NULL,
      price      INTEGER NOT NULL,
      qty        INTEGER NOT NULL,
      size       TEXT DEFAULT '',
      image      TEXT DEFAULT '',
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      phone      TEXT,
      subject    TEXT NOT NULL,
      message    TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  save();

  // Seed products if empty
  const countRes = db.exec('SELECT COUNT(*) as n FROM products');
  const count = countRes[0]?.values[0][0] || 0;
  if (count === 0) {
    const products = [
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
    ];
    for (const p of products) {
      db.run(
        'INSERT INTO products (name, price, original_price, image, category, tag, badge, description) VALUES (?,?,?,?,?,?,?,?)',
        [p.name, p.price, p.original_price, p.image, p.category, p.tag, p.badge, p.description]
      );
    }
    save();
    console.log('✅ Products seeded');
  }

  return db;
}

// Persist DB to file
function save() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// Helper: run a query that returns rows as array of objects
function all(sql, params = []) {
  const res = db.exec(sql, params);
  if (!res.length) return [];
  const { columns, values } = res[0];
  return values.map(row => Object.fromEntries(columns.map((c, i) => [c, row[i]])));
}

// Helper: run a query that returns a single row
function get(sql, params = []) {
  return all(sql, params)[0] || null;
}

// Helper: run INSERT/UPDATE/DELETE, returns { lastInsertRowid, changes }
function run(sql, params = []) {
  db.run(sql, params);
  save();
  return {
    lastInsertRowid: db.exec('SELECT last_insert_rowid() as id')[0]?.values[0][0],
    changes: db.getRowsModified()
  };
}

module.exports = { initDb, all, get, run, save };
