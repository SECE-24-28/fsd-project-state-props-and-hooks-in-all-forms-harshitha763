// ── Config ────────────────────────────────────────────────────────
// BACKEND_URL: Set this to your deployed backend URL (Render / Railway / etc.)
// Leave empty string to use localhost in development.
const BACKEND_URL = window._BACKEND_URL || '';   // injected by config.js if present

const API = BACKEND_URL
  ? BACKEND_URL + '/api'
  : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api'
    : '/api';

// ── Token helpers ─────────────────────────────────────────────────
function getToken()       { return localStorage.getItem('token'); }
function setToken(t)      { localStorage.setItem('token', t); }
function clearToken()     { localStorage.removeItem('token'); localStorage.removeItem('currentUser'); }
function isLoggedIn()     { return !!getToken(); }
function getCurrentUser() { try { return JSON.parse(localStorage.getItem('currentUser')) || {}; } catch { return {}; } }

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() };
}

// ── Redirect to login if not authenticated ────────────────────────
function requireLogin() {
  if (!isLoggedIn()) { window.location.href = 'login.html'; return false; }
  return true;
}

// ── Generic fetch wrapper ─────────────────────────────────────────
async function api(method, endpoint, body) {
  const res = await fetch(API + endpoint, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────
async function apiRegister(payload) {
  const data = await api('POST', '/auth/register', payload);
  setToken(data.token);
  localStorage.setItem('currentUser', JSON.stringify(data.user));
  return data;
}

async function apiLogin(email, password) {
  const data = await api('POST', '/auth/login', { email, password });
  setToken(data.token);
  localStorage.setItem('currentUser', JSON.stringify(data.user));
  return data;
}

async function apiGetMe() {
  const data = await api('GET', '/auth/me');
  localStorage.setItem('currentUser', JSON.stringify(data));
  return data;
}

function logout() {
  clearToken();
  window.location.href = 'login.html';
}

function setUserDisplay() {
  const el = document.getElementById('userDisplay');
  if (!el) return;
  const u = getCurrentUser();
  el.textContent = u.firstName || u.email?.split('@')[0] || 'User';
}

// ── Products ──────────────────────────────────────────────────────
function normalizeProduct(p) {
  // Ensure p.id is always set (MongoDB returns _id)
  if (!p.id) p.id = p._id;
  return p;
}

async function fetchProducts(params = {}) {
  const qs = new URLSearchParams(Object.entries(params).filter(([,v]) => v && v !== 'all')).toString();
  const products = await api('GET', '/products' + (qs ? '?' + qs : ''));
  return products.map(normalizeProduct);
}

// ── Cart (server-backed) ──────────────────────────────────────────
let _cart = [];

async function loadCart() {
  try { _cart = await api('GET', '/cart'); } catch { _cart = []; }
  renderCartUI();
}

async function addToCart(productId, qty = 1, size = '', color = '') {
  try {
    await api('POST', '/cart', { productId, qty, size, color });
    await loadCart();
    showToast('Added to cart!', 'success');
  } catch (e) { showToast(e.message, 'danger'); }
}

async function removeFromCart(cartItemId) {
  await api('DELETE', '/cart/' + cartItemId);
  await loadCart();
}

async function updateQty(cartItemId, delta) {
  const item = _cart.find(i => i.id === cartItemId);
  if (!item) return;
  const newQty = item.qty + delta;
  if (newQty <= 0) return removeFromCart(cartItemId);
  await api('PUT', '/cart/' + cartItemId, { qty: newQty });
  await loadCart();
}

async function clearCart() {
  await api('DELETE', '/cart');
  await loadCart();
  showToast('Cart cleared', 'info');
}

function renderCartUI() {
  const total = _cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = _cart.reduce((s, i) => s + i.qty, 0);

  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = count;

  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!itemsEl) return;

  itemsEl.innerHTML = _cart.length === 0
    ? '<div class="text-center py-5 text-muted"><i class="fas fa-shopping-cart fa-3x mb-3"></i><p>Your cart is empty</p></div>'
    : _cart.map(item => `
      <div class="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">
        <img src="${item.image}" class="cart-item-img rounded" alt="${item.name}">
        <div class="flex-grow-1">
          <div class="fw-semibold small">${item.name}</div>
          ${item.size ? `<div class="text-muted" style="font-size:.75rem">Size: ${item.size}</div>` : ''}
          <div class="text-muted" style="font-size:.75rem">₹${item.price} each</div>
          <div class="d-flex align-items-center gap-1 mt-1">
            <button class="btn btn-sm btn-outline-secondary px-2 py-0" onclick="updateQty(${item.id},-1)">−</button>
            <span class="px-2">${item.qty}</span>
            <button class="btn btn-sm btn-outline-secondary px-2 py-0" onclick="updateQty(${item.id},1)">+</button>
          </div>
        </div>
        <div class="text-end">
          <div class="fw-bold" style="color:var(--primary)">₹${item.price * item.qty}</div>
          <button class="btn btn-sm btn-link text-danger p-0 mt-1" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
        </div>
      </div>`).join('');

  if (totalEl) totalEl.textContent = total.toLocaleString('en-IN');
}

// ── Wishlist ──────────────────────────────────────────────────────
let _wishlistIds = [];

async function loadWishlistIds() {
  try { _wishlistIds = await api('GET', '/wishlist/ids'); } catch { _wishlistIds = []; }
  document.querySelectorAll('.wish-btn').forEach(btn => {
    const id = btn.dataset.id;
    const active = _wishlistIds.includes(id);
    btn.classList.toggle('active', active);
    const icon = btn.querySelector('i');
    if (icon) icon.className = active ? 'fas fa-heart text-danger' : 'far fa-heart';
  });
}

async function toggleWishlist(productId) {
  productId = String(productId);
  try {
    const res = await api('POST', '/wishlist', { productId });
    if (res.action === 'added') { _wishlistIds.push(productId); showToast('Added to wishlist!', 'success'); }
    else { _wishlistIds = _wishlistIds.filter(id => id !== productId); showToast('Removed from wishlist', 'info'); }
    document.querySelectorAll(`.wish-btn[data-id="${productId}"]`).forEach(btn => {
      const active = _wishlistIds.includes(productId);
      btn.classList.toggle('active', active);
      const icon = btn.querySelector('i');
      if (icon) icon.className = active ? 'fas fa-heart text-danger' : 'far fa-heart';
    });
  } catch (e) { showToast(e.message, 'danger'); }
}

function isWishlisted(id) { return _wishlistIds.includes(String(id)); }

// ── Toast ─────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }
  const icons = { success: 'check-circle', danger: 'times-circle', info: 'info-circle', warning: 'exclamation-circle' };
  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;
  toast.innerHTML = `<i class="fas fa-${icons[type] || 'check-circle'}"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.animation = 'toastOut .3s ease forwards'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ── Product Card Builder ──────────────────────────────────────────
function buildProductCard(p) {
  const pid = String(p._id || p.id);
  p.id = pid;
  const discount = Math.round((1 - p.price / p.original_price) * 100);
  const wishlisted = isWishlisted(pid);
  return `
  <div class="col-6 col-md-4 col-lg-3">
    <div class="card product-card h-100">
      <div class="position-relative" style="overflow:hidden">
        <img src="${p.image}" class="card-img-top" alt="${p.name}" style="cursor:pointer" onclick="openProductModal('${pid}')">
        ${p.badge ? `<span class="badge position-absolute top-0 start-0 m-2 badge-tag" style="background:var(--gradient)">${p.badge}</span>` : ''}
        <span class="badge bg-danger position-absolute top-0 end-0 m-2 badge-tag">-${discount}%</span>
        <button class="wish-btn ${wishlisted ? 'active' : ''}" data-id="${pid}" onclick="toggleWishlist('${pid}')">
          <i class="${wishlisted ? 'fas text-danger' : 'far'} fa-heart"></i>
        </button>
      </div>
      <div class="card-body text-center px-2 pb-3">
        <p class="prod-cat mb-1">${p.category}</p>
        <h6 class="prod-name" style="cursor:pointer" onclick="openProductModal('${pid}')">${p.name}</h6>
        <div class="d-flex justify-content-center align-items-center gap-2 mb-2">
          <span class="prod-price">₹${p.price.toLocaleString('en-IN')}</span>
          <span class="prod-old">₹${p.original_price.toLocaleString('en-IN')}</span>
        </div>
        <button class="btn-add-cart" onclick="addToCart('${pid}')"><i class="fas fa-cart-plus me-1"></i>Add to Cart</button>
      </div>
    </div>
  </div>`;
}

// ── Product Modal ─────────────────────────────────────────────────
let _currentProduct = null;

async function openProductModal(productId) {
  try {
    const p = normalizeProduct(await api('GET', '/products/' + productId));
    _currentProduct = p;
    const discount = Math.round((1 - p.price / p.original_price) * 100);
    document.getElementById('modalProductName').textContent = p.name;
    document.getElementById('modalProductImage').src = p.image;
    document.getElementById('modalProductCategory').textContent = p.category;
    document.getElementById('modalProductPrice').innerHTML =
      `₹${p.price.toLocaleString('en-IN')} <small class="text-muted text-decoration-line-through fs-6">₹${p.original_price.toLocaleString('en-IN')}</small> <span class="badge bg-danger ms-1">-${discount}%</span>`;
    document.getElementById('quantityInput').value = 1;
    if (document.getElementById('modalSize'))  document.getElementById('modalSize').value = '';
    if (document.getElementById('modalColor')) document.getElementById('modalColor').value = '';
    new bootstrap.Modal(document.getElementById('productModal')).show();
  } catch (e) { showToast('Could not load product', 'danger'); }
}

async function addToCartFromModal() {
  if (!_currentProduct) return;
  const qty   = parseInt(document.getElementById('quantityInput').value) || 1;
  const size  = document.getElementById('modalSize')?.value || '';
  const color = document.getElementById('modalColor')?.value || '';
  await addToCart(_currentProduct.id, qty, size, color);
  bootstrap.Modal.getInstance(document.getElementById('productModal'))?.hide();
}

// ── Init ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  setUserDisplay();
  if (isLoggedIn()) {
    await loadCart();
    await loadWishlistIds();
  }
});
