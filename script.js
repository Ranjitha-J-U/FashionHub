// script.js
// Pure JS shopping cart for Ranjitha's Fashion Hub

// Product data (10 formal wear sets). Using placeholder images — replace with real images if available.
const products = [
  { id: 1, name: "Classic Charcoal Suit", price: 1299.00, img: "https://d1fufvy4xao6k9.cloudfront.net/images/blog/posts/2021/06/278a0084.jpg" },
  { id: 2, name: "Navy Formal Blazer", price: 1999.00, img: "https://i.pinimg.com/736x/f9/5d/6c/f95d6c9f9856209beae46a8e05a27384.jpg" },
  { id: 3, name: "White Cotton Shirt", price: 1349.00, img: "https://i.pinimg.com/236x/4b/88/17/4b881777a89fbc2eec56a0a8de90ee7f.jpg" },
  { id: 4, name: "Slim Fit Trousers", price: 999.00, img: "https://i.pinimg.com/736x/cf/3c/13/cf3c135728f28f7927616ee4bb3b98e2.jpg" },
  { id: 5, name: "Grey Three-Piece Set", price: 2999.00, img: "https://ep-website-media.s3.ap-southeast-1.amazonaws.com/my/wp-content/uploads/2025/05/Tailored-Blazers-1.jpg" },
  { id: 6, name: "Black Formal Coat", price: 3499.00, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-ynijkZYCFi1CBj4-1M_zntmYV-GMXdOtcLkK23G94g_QxjEIVSvyC5CpeipFQWSUaWs&usqp=CAU" },
  { id: 7, name: "Ivory Silk Shirt", price: 1500.00, img: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fideas%2Fpink-office-wear-work-outfits%2F961817445646%2F&psig=AOvVaw0xT2MGwHWa0_3t8ruKlVrc&ust=1764351576880000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCODM_vzvkpEDFQAAAAAdAAAAABAE" },
  { id: 8, name: "Tailored Vest", price: 2499.00, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtc7ST9NG1h2DP4NtKBqOe3rqrhk9cBRmx81vW6tJyHNNq0Zs5gck3U2suxyzj3flv430&usqp=CAU" },
  { id: 9, name: "Elegant Tie Set", price: 1800.00, img: "https://i.pinimg.com/236x/f0/6a/f9/f06af93ce40ef0ec433f9b88769fb128.jpg" },
  { id: 10, name: "Premium Blazer & Trousers", price: 1599.00, img: "https://via.placeholder.com/600x450?text=Premium+Set" }
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

