// ─── Product Data ────────────────────────────────────────────────
const PRODUCTS = [
    { id: 1,  name: "Floral Dress",       price: 1200, originalPrice: 1800, image: "https://images.unsplash.com/photo-1496747611176-84322e1e57c?q=80&w=687&auto=format&fit=crop",  category: "Women",    tag: "women",       badge: "New" },
    { id: 2,  name: "Classic T-Shirt",    price: 800,  originalPrice: 1000, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=764&auto=format&fit=crop",  category: "Men",      tag: "men",         badge: "Sale" },
    { id: 3,  name: "Stylish Jacket",     price: 2500, originalPrice: 3500, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=687&auto=format&fit=crop",  category: "Men",      tag: "men",         badge: "Hot" },
    { id: 4,  name: "Casual Jeans",       price: 1500, originalPrice: 1900, image: "https://images.unsplash.com/photo-1542272604-787c62d465d1?q=80&w=764&auto=format&fit=crop",  category: "Unisex",   tag: "unisex",      badge: "" },
    { id: 5,  name: "Summer Top",         price: 600,  originalPrice: 900,  image: "https://images.unsplash.com/photo-1608231387042-0b1efb3faa38?q=80&w=764&auto=format&fit=crop",  category: "Women",    tag: "women",       badge: "Sale" },
    { id: 6,  name: "Polo Shirt",         price: 1000, originalPrice: 1200, image: "https://images.unsplash.com/photo-1579833971225-2a0e3c7548e0?q=80&w=764&auto=format&fit=crop",  category: "Men",      tag: "men",         badge: "" },
    { id: 7,  name: "Evening Gown",       price: 3200, originalPrice: 4500, image: "https://images.unsplash.com/photo-1595777712802-6b7be0a54341?q=80&w=687&auto=format&fit=crop",  category: "Women",    tag: "women",       badge: "Premium" },
    { id: 8,  name: "Denim Jacket",       price: 2200, originalPrice: 2800, image: "https://images.unsplash.com/photo-1516762714551-8f157d9e1b07?q=80&w=687&auto=format&fit=crop",  category: "Unisex",   tag: "unisex",      badge: "New" },
    { id: 9,  name: "Sneakers",           price: 2800, originalPrice: 3500, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=764&auto=format&fit=crop",  category: "Unisex",   tag: "unisex",      badge: "Hot" },
    { id: 10, name: "Leather Belt",       price: 700,  originalPrice: 900,  image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=687&auto=format&fit=crop",  category: "Accessories", tag: "accessories", badge: "" },
    { id: 11, name: "Sun Hat",            price: 500,  originalPrice: 700,  image: "https://images.unsplash.com/photo-1506629082632-32ca5dff2e48?q=80&w=687&auto=format&fit=crop",  category: "Accessories", tag: "accessories", badge: "Sale" },
    { id: 12, name: "Winter Coat",        price: 4500, originalPrice: 6000, image: "https://images.unsplash.com/photo-1539533057440-7fc97eab7527?q=80&w=687&auto=format&fit=crop",  category: "Women",    tag: "women",       badge: "New" }
];

// ─── Auth Helpers ─────────────────────────────────────────────────
function isLoggedIn() { return !!localStorage.getItem('isLoggedIn'); }

function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem('currentUser')) || {}; } catch { return {}; }
}

function requireLogin() {
    if (!isLoggedIn()) { window.location.href = 'login.html'; return false; }
    return true;
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function setUserDisplay() {
    const el = document.getElementById('userDisplay');
    if (!el) return;
    const u = getCurrentUser();
    el.textContent = u.firstName || u.email?.split('@')[0] || 'User';
}

// ─── Cart (localStorage persisted) ───────────────────────────────
function getCart() {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
}

function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }

function addToCart(productId, qty = 1, size = '', color = '') {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const cart = getCart();
    const key = `${productId}-${size}-${color}`;
    const existing = cart.find(i => i.key === key);
    if (existing) { existing.qty += qty; }
    else { cart.push({ ...product, qty, size, color, key }); }
    saveCart(cart);
    updateCartUI();
    showToast(`${product.name} added to cart!`, 'success');
}

function removeFromCart(key) {
    const cart = getCart().filter(i => i.key !== key);
    saveCart(cart);
    updateCartUI();
}

function updateQty(key, delta) {
    const cart = getCart();
    const item = cart.find(i => i.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) return removeFromCart(key);
    saveCart(cart);
    updateCartUI();
}

function updateCartUI() {
    const cart = getCart();
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const count = cart.reduce((s, i) => s + i.qty, 0);

    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = count;

    const itemsEl = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    if (!itemsEl) return;

    if (cart.length === 0) {
        itemsEl.innerHTML = '<div class="text-center py-5 text-muted"><i class="fas fa-shopping-cart fa-3x mb-3"></i><p>Your cart is empty</p></div>';
    } else {
        itemsEl.innerHTML = cart.map(item => `
            <div class="cart-item d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">
                <img src="${item.image}" class="rounded" style="width:60px;height:60px;object-fit:cover" alt="${item.name}">
                <div class="flex-grow-1">
                    <div class="fw-semibold small">${item.name}</div>
                    ${item.size ? `<div class="text-muted" style="font-size:0.75rem">Size: ${item.size}</div>` : ''}
                    <div class="text-muted" style="font-size:0.75rem">₹${item.price} each</div>
                    <div class="d-flex align-items-center gap-1 mt-1">
                        <button class="btn btn-sm btn-outline-secondary px-2 py-0" onclick="updateQty('${item.key}',-1)">-</button>
                        <span class="px-2">${item.qty}</span>
                        <button class="btn btn-sm btn-outline-secondary px-2 py-0" onclick="updateQty('${item.key}',1)">+</button>
                    </div>
                </div>
                <div class="text-end">
                    <div class="fw-bold text-primary">₹${item.price * item.qty}</div>
                    <button class="btn btn-sm btn-link text-danger p-0 mt-1" onclick="removeFromCart('${item.key}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }
    if (totalEl) totalEl.textContent = total.toLocaleString('en-IN');

    // Save order total for checkout page
    localStorage.setItem('cartTotal', total);
}

// ─── Wishlist ─────────────────────────────────────────────────────
function getWishlist() {
    try { return JSON.parse(localStorage.getItem('wishlist')) || []; } catch { return []; }
}

function toggleWishlist(productId) {
    const wl = getWishlist();
    const idx = wl.indexOf(productId);
    if (idx > -1) { wl.splice(idx, 1); showToast('Removed from wishlist', 'info'); }
    else { wl.push(productId); showToast('Added to wishlist!', 'success'); }
    localStorage.setItem('wishlist', JSON.stringify(wl));
    document.querySelectorAll(`.wish-btn[data-id="${productId}"]`).forEach(btn => {
        btn.classList.toggle('active', wl.includes(productId));
        btn.querySelector('i').className = wl.includes(productId) ? 'fas fa-heart' : 'far fa-heart';
    });
}

function isWishlisted(id) { return getWishlist().includes(id); }

// ─── Toast ────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
        document.body.appendChild(container);
    }
    const colors = { success: '#28a745', danger: '#dc3545', info: '#17a2b8', warning: '#ffc107' };
    const icons  = { success: 'check-circle', danger: 'times-circle', info: 'info-circle', warning: 'exclamation-circle' };
    const toast = document.createElement('div');
    toast.style.cssText = `background:${colors[type]||colors.success};color:white;padding:12px 20px;border-radius:10px;box-shadow:0 5px 15px rgba(0,0,0,0.2);font-size:0.9rem;display:flex;align-items:center;gap:10px;min-width:220px;animation:slideInRight 0.3s ease;`;
    toast.innerHTML = `<i class="fas fa-${icons[type]||icons.success}"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'fadeOut 0.3s ease forwards'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ─── Product Card Builder ─────────────────────────────────────────
function buildProductCard(product, onclick = '') {
    const wl = isWishlisted(product.id);
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    return `
    <div class="col-6 col-md-4 col-lg-3">
        <div class="card product-card shadow-sm h-100 border-0">
            <div class="position-relative">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height:240px;object-fit:cover;cursor:pointer" onclick="${onclick || `openProductModal(${product.id})`}">
                ${product.badge ? `<span class="badge position-absolute top-0 start-0 m-2" style="background:linear-gradient(135deg,#667eea,#764ba2)">${product.badge}</span>` : ''}
                <span class="badge bg-danger position-absolute top-0 end-0 m-2">-${discount}%</span>
                <button class="wish-btn btn btn-light btn-sm position-absolute bottom-0 end-0 m-2 rounded-circle ${wl ? 'active' : ''}" data-id="${product.id}" onclick="toggleWishlist(${product.id})" style="width:34px;height:34px;padding:0">
                    <i class="${wl ? 'fas' : 'far'} fa-heart ${wl ? 'text-danger' : ''}"></i>
                </button>
            </div>
            <div class="card-body text-center px-2 pb-3">
                <p class="text-muted small mb-1">${product.category}</p>
                <h6 class="fw-bold mb-1" style="cursor:pointer" onclick="${onclick || `openProductModal(${product.id})`}">${product.name}</h6>
                <div class="d-flex justify-content-center align-items-center gap-2 mb-2">
                    <span class="fw-bold text-primary">₹${product.price.toLocaleString('en-IN')}</span>
                    <span class="text-muted text-decoration-line-through small">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                </div>
                <button class="btn btn-dark btn-sm w-100" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    </div>`;
}

// ─── Product Detail Modal ─────────────────────────────────────────
let _currentProduct = null;

function openProductModal(productId) {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;
    _currentProduct = p;
    const discount = Math.round((1 - p.price / p.originalPrice) * 100);
    document.getElementById('modalProductName').textContent = p.name;
    document.getElementById('modalProductImage').src = p.image;
    document.getElementById('modalProductCategory').textContent = p.category;
    document.getElementById('modalProductPrice').innerHTML = `₹${p.price.toLocaleString('en-IN')} <small class="text-muted text-decoration-line-through fs-6">₹${p.originalPrice.toLocaleString('en-IN')}</small> <span class="badge bg-danger ms-1">-${discount}%</span>`;
    document.getElementById('quantityInput').value = 1;
    new bootstrap.Modal(document.getElementById('productModal')).show();
}

function addToCartFromModal() {
    if (!_currentProduct) return;
    const qty   = parseInt(document.getElementById('quantityInput').value) || 1;
    const size  = document.getElementById('modalSize')?.value || '';
    const color = document.getElementById('modalColor')?.value || '';
    addToCart(_currentProduct.id, qty, size, color);
    bootstrap.Modal.getInstance(document.getElementById('productModal'))?.hide();
}

// ─── Init helper ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    setUserDisplay();
});
