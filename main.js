// ═══════════════════════════════════════════════════════
// AQUA CONNECT - Main Application Logic
// ═══════════════════════════════════════════════════════

// ── Global State ──
const state = {
  currentScreen: 'splash',
  selectedBottle: 0,
  quantity: 1,
  cartCount: 2,
  walletBalance: 560.00,
  orders: [],
  vendors: [
    {
      id: 1,
      name: 'AquaPure Supplies',
      avatar: '🏪',
      distance: '0.8 km',
      rating: 4.9,
      reviews: 128,
      eta: '25 min',
      tags: ['Verified', 'Fast Delivery', 'BIS Certified'],
      stock: { '20Ltr': 'in', '15Ltr': 'in', '10Ltr': 'in', '5Ltr': 'low' },
      prices: { '20Ltr': 120, '15Ltr': 90, '10Ltr': 70, '5Ltr': 50 },
      stats: { orders: 342, rating: '4.9', experience: '3 yrs' },
      images: [],
      products: []
    },
    {
      id: 2,
      name: 'Crystal Water Co.',
      avatar: '💧',
      distance: '1.2 km',
      rating: 4.7,
      reviews: 89,
      eta: '35 min',
      tags: ['Top Rated', 'Mineral Water'],
      stock: { '20Ltr': 'in', '15Ltr': 'in', '10Ltr': 'out', '5Ltr': 'in' },
      prices: { '20Ltr': 115, '15Ltr': 85, '10Ltr': 65, '5Ltr': 48 },
      stats: { orders: 256, rating: '4.7', experience: '2 yrs' },
      images: [],
      products: []
    },
    {
      id: 3,
      name: 'FreshFlow Water',
      avatar: '🌊',
      distance: '2.1 km',
      rating: 4.5,
      reviews: 64,
      eta: '45 min',
      tags: ['Best Price', 'RO Purified'],
      stock: { '20Ltr': 'low', '15Ltr': 'in', '10Ltr': 'in', '5Ltr': 'in' },
      prices: { '20Ltr': 110, '15Ltr': 80, '10Ltr': 60, '5Ltr': 45 },
      stats: { orders: 189, rating: '4.5', experience: '1 yr' },
      images: [],
      products: []
    }
  ],
  user: {
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahulsharma@email.com',
    avatar: '🧑',
    totalOrders: 24,
    waterDelivered: '480 Ltr',
    memberSince: 'May 2024',
    totalSpent: '₹2,560'
  }
};

// Bottle data
const bottles = [
  { size: '20 Ltr', price: 120, selected: true },
  { size: '15 Ltr', price: 90, selected: false },
  { size: '10 Ltr', price: 70, selected: false },
  { size: '5 Ltr', price: 50, selected: false }
];

// ── Screen Navigation ──
function goTo(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
  });
  
  // Show target screen
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    target.scrollTop = 0;
    state.currentScreen = screenId;
    
    // Update bottom nav active state
    updateBottomNav(screenId);
    
    // Initialize screen-specific content
    if (screenId === 'home') initHomeBottles();
    if (screenId === 'order') initOrderBottles();
    if (screenId === 'vendors') initVendorsList();
  }
}

function updateBottomNav(screenId) {
  document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const navMap = {
    'home': 0,
    'orders': 1,
    'order': -1,
    'wallet': 3,
    'profile': 4
  };
  
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  if (navMap[screenId] !== undefined && navMap[screenId] >= 0) {
    navItems[navMap[screenId]].classList.add('active');
  }
}

// ── Toast Notifications ──
function showToast(message, duration = 2500) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.querySelector('.phone').appendChild(toast);
  }
  
  toast.innerHTML = `<span>${message}</span>`;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ── Home Screen Bottle Cards ──
function initHomeBottles() {
  const container = document.getElementById('homeBottles');
  if (!container) return;
  
  container.innerHTML = bottles.map((b, i) => `
    <div class="bottle-card ${b.selected ? 'selected' : ''}" onclick="selectHomeBottle(${i})">
      <div class="check">✓</div>
      <div class="bottle-img-wrap">
        <svg viewBox="0 0 52 72" class="bottle-svg">
          <rect x="20" y="0" width="12" height="8" rx="3" fill="#1d4ed8"/>
          <rect x="16" y="7" width="20" height="10" rx="4" fill="rgba(147,197,253,0.9)"/>
          <rect x="6" y="16" width="40" height="52" rx="10" fill="url(#bGrad${i})"/>
          <rect x="8" y="28" width="36" height="36" rx="5" fill="rgba(255,255,255,0.8)"/>
          <defs>
            <linearGradient id="bGrad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="rgba(255,255,255,0.95)"/>
              <stop offset="100%" stop-color="rgba(147,197,253,0.7)"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span class="bottle-size">${b.size}</span>
      <span class="bottle-price">₹${b.price}</span>
    </div>
  `).join('');
}

function selectHomeBottle(index) {
  bottles.forEach((b, i) => b.selected = i === index);
  initHomeBottles();
  showToast(`✓ ${bottles[index].size} selected`);
}

// ── Order Screen ──
function initOrderBottles() {
  const container = document.getElementById('orderBottles');
  if (!container) return;
  
  container.innerHTML = bottles.map((b, i) => `
    <div class="bottle-card ${b.selected ? 'selected' : ''}" onclick="selectOrderBottle(${i})">
      <div class="check">✓</div>
      <div class="bottle-img-wrap">
        <svg viewBox="0 0 52 72" class="bottle-svg">
          <rect x="20" y="0" width="12" height="8" rx="3" fill="#1d4ed8"/>
          <rect x="16" y="7" width="20" height="10" rx="4" fill="rgba(147,197,253,0.9)"/>
          <rect x="6" y="16" width="40" height="52" rx="10" fill="url(#oGrad${i})"/>
          <rect x="8" y="28" width="36" height="36" rx="5" fill="rgba(255,255,255,0.8)"/>
          <defs>
            <linearGradient id="oGrad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="rgba(255,255,255,0.95)"/>
              <stop offset="100%" stop-color="rgba(147,197,253,0.7)"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span class="bottle-size">${b.size}</span>
      <span class="bottle-price">₹${b.price}</span>
    </div>
  `).join('');
  
  updateOrderTotal();
}

function selectOrderBottle(index) {
  bottles.forEach((b, i) => b.selected = i === index);
  initOrderBottles();
}

function changeQty(delta) {
  state.quantity = Math.max(1, state.quantity + delta);
  document.getElementById('qtyNum').textContent = state.quantity;
  updateOrderTotal();
}

function updateOrderTotal() {
  const selected = bottles.find(b => b.selected);
  const itemTotal = selected ? selected.price * state.quantity : 0;
  const deliveryFee = 20;
  const total = itemTotal + deliveryFee;
  
  document.getElementById('orderTotal').textContent = `₹${itemTotal}`;
  document.getElementById('billItem').textContent = `₹${itemTotal}`;
  document.getElementById('billTotal').textContent = `₹${total}`;
}

function toggleCheck(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.toggle('checked');
    if (el.classList.contains('checked')) {
      el.innerHTML = '✓';
    } else {
      el.innerHTML = '';
    }
  }
}

function selectSchedule(type) {
  document.getElementById('schedAsap').classList.toggle('selected', type === 'asap');
  document.getElementById('schedSchedule').classList.toggle('selected', type === 'schedule');
}

function placeOrder() {
  const selected = bottles.find(b => b.selected);
  showToast(`🎉 Order placed! ${selected.size} x${state.quantity}`);
  setTimeout(() => goTo('orders'), 1500);
}

// ── Orders Screen ──
function setOrderTab(el) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  
  const tabText = el.textContent.trim();
  showToast(`📋 Showing ${tabText}`);
  
  // Filter logic would go here
  const cards = document.querySelectorAll('.order-card');
  cards.forEach(card => {
    const status = card.querySelector('.status-badge');
    if (!status) return;
    
    const statusText = status.textContent.trim().toLowerCase();
    const filterMap = {
      'All Orders': ['upcoming', 'completed', 'cancelled'],
      'Upcoming': ['upcoming'],
      'Completed': ['completed'],
      'Cancelled': ['cancelled']
    };
    
    const allowed = filterMap[tabText] || ['upcoming', 'completed', 'cancelled'];
    card.style.display = allowed.includes(statusText) ? 'flex' : 'none';
  });
}

// ── Vendors Screen ──
function initVendorsList() {
  const container = document.querySelector('.nearby-section');
  if (!container || container.dataset.initialized) return;
  container.dataset.initialized = 'true';
}

function setVendorFilter(el) {
  document.querySelectorAll('.vendor-filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  showToast(`🔍 Filter: ${el.textContent.trim()}`);
}

function goToVendorDetail(vendorId) {
  const vendor = state.vendors.find(v => v.id === vendorId);
  if (!vendor) return;
  
  // Build vendor detail content dynamically
  const detailScreen = document.getElementById('vendor-detail');
  if (detailScreen) {
    detailScreen.innerHTML = buildVendorDetailHTML(vendor);
    goTo('vendor-detail');
  }
}

function buildVendorDetailHTML(vendor) {
  const stockStatus = (status) => {
    if (status === 'in') return '<span class="stock-dot in"></span><span class="stock-text">In Stock</span>';
    if (status === 'low') return '<span class="stock-dot low"></span><span class="stock-text">Low Stock</span>';
    return '<span class="stock-dot out"></span><span class="stock-text">Out of Stock</span>';
  };
  
  return `
    <div class="topbar">
      <button class="icon-btn" onclick="goTo('vendors')">
        <svg class="ic" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <span class="topbar-title">Vendor Details</span>
      <button class="icon-btn" onclick="showToast('♥ Added to favorites')">
        <svg class="ic" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
    </div>
    <div class="scroll-pad">
      <div class="vendor-detail-hero">
        <div class="vendor-avatar">${vendor.avatar}</div>
        <h3>${vendor.name}</h3>
        <div class="vendor-meta-info">
          <div class="stars">★★★★★</div> ${vendor.rating} (${vendor.reviews} reviews) · ${vendor.distance} away
        </div>
        <div class="vendor-tags" style="margin-top:8px;">
          ${vendor.tags.map(t => `<span class="vendor-tag">${t}</span>`).join('')}
        </div>
      </div>
      
      <div class="section-header">
        <span class="section-title">Products & Prices</span>
      </div>
      
      <div class="vendor-products-section">
        ${Object.entries(vendor.prices).map(([size, price]) => `
          <div class="product-list-card">
            <div class="product-list-img">
              <svg width="32" height="44" viewBox="0 0 52 72">
                <rect x="20" y="0" width="12" height="8" rx="3" fill="#1d4ed8"/>
                <rect x="16" y="7" width="20" height="10" rx="4" fill="rgba(147,197,253,0.9)"/>
                <rect x="6" y="16" width="40" height="52" rx="10" fill="rgba(147,197,253,0.5)"/>
                <rect x="8" y="28" width="36" height="36" rx="5" fill="rgba(255,255,255,0.8)"/>
              </svg>
            </div>
            <div class="product-list-info">
              <strong>${size} Water Can</strong>
              <div class="product-price">₹${price}</div>
              <div class="stock-row">${stockStatus(vendor.stock[size])}</div>
            </div>
            <button class="btn-filled-sm" onclick="showToast('🛒 Added ${size} to cart')">Add</button>
          </div>
        `).join('')}
      </div>
      
      ${vendor.images.length > 0 ? `
      <div class="section-header">
        <span class="section-title">Gallery</span>
      </div>
      <div class="vendor-gallery">
        ${vendor.images.map(img => `<img src="${img}" alt="Product">`).join('')}
      </div>
      ` : ''}
      
      <div class="vendor-actions" style="margin:0 16px 20px;">
        <button class="btn-outline" onclick="showToast('📞 Calling vendor...')">📞 Call</button>
        <button class="btn-filled-sm" onclick="goTo('order')">🛒 Order Now</button>
      </div>
    </div>
  `;
}

// ── Vendor Dashboard ──
function toggleStock(el) {
  el.classList.toggle('on');
  const isOn = el.classList.contains('on');
  showToast(isOn ? '✅ Stock enabled' : '❌ Stock disabled');
}

function saveVendorProduct() {
  const name = document.getElementById('productName')?.value;
  const price = document.getElementById('productPrice')?.value;
  const size = document.getElementById('productSize')?.value;
  
  if (!name || !price) {
    showToast('⚠️ Please fill all fields');
    return;
  }
  
  showToast(`✅ Product "${name}" saved!`);
  
  // Clear form
  if (document.getElementById('productName')) document.getElementById('productName').value = '';
  if (document.getElementById('productPrice')) document.getElementById('productPrice').value = '';
}

// ── Image Upload Handling ──
function handleImageUpload(input, previewId) {
  const files = input.files;
  if (!files || files.length === 0) return;
  
  const previewContainer = document.getElementById(previewId);
  if (!previewContainer) return;
  
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const div = document.createElement('div');
      div.className = 'product-preview-item';
      div.innerHTML = `
        <img src="${e.target.result}" alt="Product">
        <button class="remove-btn" onclick="this.parentElement.remove()">×</button>
      `;
      previewContainer.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
  
  showToast(`📸 ${files.length} image(s) uploaded`);
}

// ── Wallet Actions ──
function addMoney() {
  showToast('💳 Add Money - Coming soon!');
}

// ── Profile Actions ──
function editProfile() {
  showToast('✏️ Edit Profile - Coming soon!');
}

// ── Initialize App ──
document.addEventListener('DOMContentLoaded', function() {
  // Initialize home bottles
  initHomeBottles();
  
  // Initialize order bottles
  initOrderBottles();
  
  // Set initial active screen
  goTo('splash');
  
  console.log('🌊 AQUA CONNECT initialized');
});

// ── Keyboard handling for mobile ──
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const screens = ['home', 'vendors', 'orders', 'wallet', 'profile'];
    if (!screens.includes(state.currentScreen)) {
      goTo('home');
    }
  }
});

// ── Touch gesture support ──
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 100;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    const screenOrder = ['home', 'orders', 'wallet', 'profile'];
    const currentIdx = screenOrder.indexOf(state.currentScreen);
    
    if (diff > 0 && currentIdx < screenOrder.length - 1) {
      // Swipe left - next screen
      goTo(screenOrder[currentIdx + 1]);
    } else if (diff < 0 && currentIdx > 0) {
      // Swipe right - previous screen
      goTo(screenOrder[currentIdx - 1]);
    }
  }
}
