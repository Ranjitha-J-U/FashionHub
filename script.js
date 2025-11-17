// script.js
// Pure JS shopping cart for Ranjitha's Fashion Hub

// Product data (10 formal wear sets). Using placeholder images — replace with real images if available.
const products = [
  { id: 1, name: "Classic Charcoal Suit", price: 129.00, img: "https://via.placeholder.com/600x450?text=Charcoal+Suit" },
  { id: 2, name: "Navy Formal Blazer", price: 99.00, img: "https://via.placeholder.com/600x450?text=Navy+Blazer" },
  { id: 3, name: "White Cotton Shirt", price: 35.00, img: "https://via.placeholder.com/600x450?text=White+Shirt" },
  { id: 4, name: "Slim Fit Trousers", price: 49.00, img: "https://via.placeholder.com/600x450?text=Slim+Trousers" },
  { id: 5, name: "Grey Three-Piece Set", price: 199.00, img: "https://via.placeholder.com/600x450?text=Grey+3PC+Set" },
  { id: 6, name: "Black Formal Coat", price: 139.00, img: "https://via.placeholder.com/600x450?text=Black+Coat" },
  { id: 7, name: "Ivory Silk Shirt", price: 59.00, img: "https://via.placeholder.com/600x450?text=Ivory+Silk+Shirt" },
  { id: 8, name: "Tailored Vest", price: 45.00, img: "https://via.placeholder.com/600x450?text=Tailored+Vest" },
  { id: 9, name: "Elegant Tie Set", price: 22.00, img: "https://via.placeholder.com/600x450?text=Tie+Set" },
  { id: 10, name: "Premium Blazer & Trousers", price: 159.00, img: "https://via.placeholder.com/600x450?text=Premium+Set" }
];

// Simple cart stored in localStorage for persistence
const CART_KEY = "rfh_cart_v1";

// util: get cart
function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((s, item) => s + (item.qty || 1), 0);
  document.getElementById('cartCount').textContent = count;
}

// Add to cart action
function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    const prod = products.find(p => p.id === productId);
    cart.push({ id: prod.id, name: prod.name, price: prod.price, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  showToast(`${products.find(p => p.id === productId).name} — Added to cart`);
}

// Simple toast popup
let toastTimeout = null;
function showToast(text) {
  const toast = document.getElementById('toast');
  toast.textContent = text || "Added to cart";
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  toast.style.pointerEvents = 'auto';
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.pointerEvents = 'none';
  }, 1700);
}

// Render products into grid
function renderProducts() {
  const container = document.getElementById('products');
  container.innerHTML = ""; // clear
  products.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img class="media" src="${p.img}" alt="${p.name}" loading="lazy" />
      <div class="card-content">
        <h3 class="product-name">${p.name}</h3>
        <div class="product-meta">
          <div class="price">₹${p.price.toFixed(2)}</div>
          <button class="btn gold" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // attach listeners for add-to-cart buttons
  container.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.getAttribute('data-id'));
      addToCart(id);
    });
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  // set year
  document.getElementById('year').textContent = new Date().getFullYear();
  renderProducts();
  updateCartCount();

  // cart button click (for demo: show cart content as alert)
  document.getElementById('cartBtn').addEventListener('click', () => {
    const cart = getCart();
    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }
    // build a friendly summary
    let summary = "Cart items:\n";
    let total = 0;
    cart.forEach(item => {
      summary += `• ${item.name} × ${item.qty} — ₹${(item.price * item.qty).toFixed(2)}\n`;
      total += item.price * item.qty;
    });
    summary += `\nTotal: ₹${total.toFixed(2)}`;
    alert(summary);
  });
});
