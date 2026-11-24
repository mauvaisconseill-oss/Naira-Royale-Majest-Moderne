/* ============================================
   NAIRA ROYALE — Main JavaScript
   Cart, Products, UI interactions
   ============================================ */

// ==========================================
// PRODUCT DATA
// ==========================================
const PRODUCTS = [
  {
    id: 1,
    name: "Robe Halter Bleu Océan",
    slug: "robe-halter-bleu-ocean",
    price: 189.00,
    oldPrice: null,
    image: "img/products/robe-bleu-ocean.jpg",
    category: "halter",
    collection: "tie-dye",
    color: "bleu",
    colorHex: "#1E3A8A",
    badge: "Meilleure vente",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Robe longue halter en tie-dye bleu océan. Bustier smocké pour un maintien parfait et une silhouette sublimée. Pièce unique faite main.",
    isNew: false,
    rating: 4.9,
    reviews: 23
  },
  {
    id: 2,
    name: "Robe Halter Ambre Doré",
    slug: "robe-halter-ambre-dore",
    price: 189.00,
    oldPrice: null,
    image: "img/products/robe-ambre.jpg",
    category: "halter",
    collection: "tie-dye",
    color: "ambre",
    colorHex: "#D4A017",
    badge: "Nouveau",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Robe longue halter tie-dye dans des tons ambre et doré chaleureux. Bustier smocké élastique. Chaque pièce est unique.",
    isNew: true,
    rating: 5.0,
    reviews: 12
  },
  {
    id: 3,
    name: "Robe Halter Fuchsia Sunset",
    slug: "robe-halter-fuchsia-sunset",
    price: 199.00,
    oldPrice: null,
    image: "img/products/robe-fuchsia-orange.jpg",
    category: "halter",
    collection: "tie-dye",
    color: "fuchsia",
    colorHex: "#DB2777",
    badge: null,
    sizes: ["S", "M", "L", "XL"],
    description: "Robe longue halter aux couleurs vibrantes fuchsia et orange. Effet sunset tie-dye fait main. Bustier smocké pour un confort optimal.",
    isNew: false,
    rating: 4.8,
    reviews: 18
  },
  {
    id: 4,
    name: "Robe Halter Bleu Royal",
    slug: "robe-halter-bleu-royal",
    price: 195.00,
    oldPrice: null,
    image: "img/products/robe-bleu-royal.jpg",
    category: "halter",
    collection: "tie-dye",
    color: "royal",
    colorHex: "#1E40AF",
    badge: "Meilleure vente",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Robe longue halter dans un bleu royal profond et majestueux. Bustier smocké, coupe flatteuse. Pièce artisanale unique.",
    isNew: false,
    rating: 4.9,
    reviews: 31
  },
  {
    id: 5,
    name: "Robe Halter Terracotta",
    slug: "robe-halter-terracotta",
    price: 189.00,
    oldPrice: null,
    image: "img/products/robe-terracotta.jpg",
    category: "halter",
    collection: "tie-dye",
    color: "terracotta",
    colorHex: "#9A3412",
    badge: "Nouveau",
    sizes: ["S", "M", "L", "XL"],
    description: "Robe longue halter aux teintes terracotta et rouille. Tie-dye artisanal, bustier smocké. Des tons chauds pour un look sophistiqué.",
    isNew: true,
    rating: 4.7,
    reviews: 8
  },
  {
    id: 6,
    name: "Robe Dos Nu Émeraude",
    slug: "robe-dos-nu-emeraude",
    price: 199.00,
    oldPrice: null,
    image: "img/products/robe-emeraude.jpg",
    category: "soiree",
    collection: "tie-dye",
    color: "emeraude",
    colorHex: "#166534",
    badge: null,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Robe longue dos nu dans des teintes émeraude et chartreuse. Noué au cou, dos ouvert élégant. Tie-dye fait main.",
    isNew: false,
    rating: 4.9,
    reviews: 15
  },
  {
    id: 7,
    name: "Robe Halter Violet Rose",
    slug: "robe-halter-violet-rose",
    price: 195.00,
    oldPrice: null,
    image: "img/products/robe-violet-rose.jpg",
    category: "halter",
    collection: "tie-dye",
    color: "violet",
    colorHex: "#7C3AED",
    badge: null,
    sizes: ["S", "M", "L", "XL"],
    description: "Robe longue halter dans un dégradé violet et rose envoûtant. Bustier smocké, silhouette flatteuse. Pièce unique tie-dye.",
    isNew: false,
    rating: 4.8,
    reviews: 20
  },
  {
    id: 8,
    name: "Robe Dos Nu Noir Cuivré",
    slug: "robe-dos-nu-noir-cuivre",
    price: 209.00,
    oldPrice: 229.00,
    image: "img/products/robe-noir-cuivre.jpg",
    category: "soiree",
    collection: "tie-dye",
    color: "noir",
    colorHex: "#1C1917",
    badge: "Édition Limitée",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Robe longue dos nu en noir et cuivré, parfaite pour les soirées. Noué au cou avec un dos ouvert spectaculaire. Tie-dye artisanal.",
    isNew: false,
    rating: 5.0,
    reviews: 27
  }
];

// ==========================================
// CART STATE
// ==========================================
let cart = JSON.parse(localStorage.getItem('nairaRoyaleCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('nairaRoyaleWishlist')) || [];
if (!Array.isArray(wishlist)) wishlist = [];
wishlist = [...new Set(wishlist.map(Number).filter(id => PRODUCTS.some(product => product.id === id)))];

function saveCart() {
  localStorage.setItem('nairaRoyaleCart', JSON.stringify(cart));
  updateCartUI();
}

function saveWishlist() {
  localStorage.setItem('nairaRoyaleWishlist', JSON.stringify(wishlist));
  updateWishlistUI();
}

// ==========================================
// CART FUNCTIONS
// ==========================================
function addToCart(productId, size = 'M', qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return false;

  const existingIdx = cart.findIndex(item => item.id === productId && item.size === size);
  if (existingIdx > -1) {
    cart[existingIdx].qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size,
      color: product.color,
      qty: qty
    });
  }
  saveCart();
  showToast(`${product.name} ajouté au panier ✓`);
  if (document.getElementById('cartSidebar')) openCart();
  return true;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  // Re-render if on cart page
  if (typeof renderCartPage === 'function' && document.getElementById('cartTableBody')) {
    renderCartPage();
  }
}

function updateCartQty(index, newQty) {
  if (newQty <= 0) {
    removeFromCart(index);
    return;
  }
  cart[index].qty = newQty;
  saveCart();
  if (document.getElementById('cartTableBody')) {
    renderCartPage();
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function formatPrice(price) {
  return price.toFixed(2).replace('.', ',') + ' €';
}

// ==========================================
// WISHLIST
// ==========================================
function toggleWishlist(productId) {
  const id = Number(productId);
  if (!PRODUCTS.some(product => product.id === id)) return;

  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast('Retiré de la liste de souhaits');
  } else {
    wishlist.push(id);
    showToast('Ajouté à la liste de souhaits ♡');
  }
  saveWishlist();

  const isWished = wishlist.includes(id);
  document.querySelectorAll(`[data-wishlist="${id}"]`).forEach(btn => {
    btn.classList.toggle('wishlisted', isWished);
    btn.classList.toggle('active', isWished);
    const icon = btn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fas', isWished);
      icon.classList.toggle('far', !isWished);
    }
  });
}

// ==========================================
// UI UPDATES
// ==========================================
function updateCartUI() {
  // Update cart count badge
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    const count = getCartCount();
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'flex' : 'none';
  }

  // Update cart item count in sidebar
  const itemCountEl = document.getElementById('cartItemCount');
  if (itemCountEl) itemCountEl.textContent = getCartCount();

  // Update cart sidebar items
  const cartItemsEl = document.getElementById('cartItems');
  const cartEmptyEl = document.getElementById('cartEmpty');
  const cartFooterEl = document.getElementById('cartFooter');
  const cartTotalEl = document.getElementById('cartTotal');

  if (cartItemsEl && cartEmptyEl) {
    if (cart.length === 0) {
      cartEmptyEl.style.display = 'block';
      if (cartFooterEl) cartFooterEl.style.display = 'none';
      // Clear any cart item HTML but keep the empty message
      const items = cartItemsEl.querySelectorAll('.cart-item');
      items.forEach(item => item.remove());
    } else {
      cartEmptyEl.style.display = 'none';
      if (cartFooterEl) cartFooterEl.style.display = 'block';
      if (cartTotalEl) cartTotalEl.textContent = formatPrice(getCartTotal());

      // Clear and re-render
      const existingItems = cartItemsEl.querySelectorAll('.cart-item');
      existingItems.forEach(item => item.remove());

      cart.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-variant">Taille: ${item.size}</div>
            <div class="cart-item-price">${formatPrice(item.price)} × ${item.qty}</div>
            <button class="cart-item-remove" onclick="removeFromCart(${idx})">Supprimer</button>
          </div>
        `;
        cartItemsEl.insertBefore(div, cartEmptyEl);
      });
    }
  }
}

function updateWishlistUI() {
  const count = wishlist.length;
  document.querySelectorAll('.wishlist-count').forEach(countEl => {
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'flex' : 'none';
  });

  const wishlistBtn = document.getElementById('wishlistBtn');
  if (wishlistBtn) {
    const icon = wishlistBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fas', count > 0);
      icon.classList.toggle('far', count === 0);
    }
    wishlistBtn.setAttribute('aria-label', `Favoris${count ? ` (${count})` : ''}`);
  }

  renderWishlistPanel();
}

function setupWishlistPanel() {
  if (document.getElementById('wishlistPanel')) return;

  const overlay = document.createElement('div');
  overlay.className = 'wishlist-overlay';
  overlay.id = 'wishlistOverlay';

  const panel = document.createElement('aside');
  panel.className = 'wishlist-panel';
  panel.id = 'wishlistPanel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'wishlistTitle');
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="wishlist-header">
      <h2 id="wishlistTitle">Mes favoris</h2>
      <button class="wishlist-close" id="wishlistClose" type="button" aria-label="Fermer les favoris">&times;</button>
    </div>
    <div class="wishlist-items" id="wishlistItems"></div>
  `;
  document.body.append(overlay, panel);

  overlay.addEventListener('click', closeWishlist);
  panel.querySelector('#wishlistClose').addEventListener('click', closeWishlist);
  panel.addEventListener('click', event => {
    const removeButton = event.target.closest('[data-remove-wishlist]');
    if (removeButton) toggleWishlist(removeButton.dataset.removeWishlist);
  });
}

function renderWishlistPanel() {
  const items = document.getElementById('wishlistItems');
  if (!items) return;

  items.replaceChildren();
  const products = wishlist
    .map(id => PRODUCTS.find(product => product.id === id))
    .filter(Boolean);

  if (!products.length) {
    const empty = document.createElement('p');
    empty.className = 'wishlist-empty';
    empty.textContent = 'Aucune robe dans vos favoris pour le moment.';
    items.appendChild(empty);
    return;
  }

  products.forEach(product => {
    const item = document.createElement('article');
    item.className = 'wishlist-item';

    const link = document.createElement('a');
    link.className = 'wishlist-item-image';
    link.href = `product.html?id=${product.id}`;
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    image.loading = 'lazy';
    link.appendChild(image);

    const details = document.createElement('div');
    details.className = 'wishlist-item-details';
    const nameLink = document.createElement('a');
    nameLink.className = 'wishlist-item-name';
    nameLink.href = link.href;
    nameLink.textContent = product.name;
    const price = document.createElement('span');
    price.className = 'wishlist-item-price';
    price.textContent = formatPrice(product.price);
    const removeButton = document.createElement('button');
    removeButton.className = 'wishlist-remove';
    removeButton.type = 'button';
    removeButton.dataset.removeWishlist = product.id;
    removeButton.textContent = 'Retirer des favoris';
    details.append(nameLink, price, removeButton);
    item.append(link, details);
    items.appendChild(item);
  });
}

function openWishlist() {
  setupWishlistPanel();
  const overlay = document.getElementById('wishlistOverlay');
  const panel = document.getElementById('wishlistPanel');
  if (overlay) overlay.classList.add('active');
  if (panel) {
    panel.classList.add('active');
    panel.setAttribute('aria-hidden', 'false');
  }
  const wishlistBtn = document.getElementById('wishlistBtn');
  if (wishlistBtn) wishlistBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeWishlist() {
  const overlay = document.getElementById('wishlistOverlay');
  const panel = document.getElementById('wishlistPanel');
  if (overlay) overlay.classList.remove('active');
  if (panel) {
    panel.classList.remove('active');
    panel.setAttribute('aria-hidden', 'true');
  }
  const wishlistBtn = document.getElementById('wishlistBtn');
  if (wishlistBtn) wishlistBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// ==========================================
// CART SIDEBAR
// ==========================================
function openCart() {
  const overlay = document.getElementById('cartOverlay');
  const sidebar = document.getElementById('cartSidebar');
  if (overlay) overlay.classList.add('active');
  if (sidebar) sidebar.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const overlay = document.getElementById('cartOverlay');
  const sidebar = document.getElementById('cartSidebar');
  if (overlay) overlay.classList.remove('active');
  if (sidebar) sidebar.classList.remove('active');
  document.body.style.overflow = '';
}

// ==========================================
// PRODUCT CARD RENDERING
// ==========================================
function createProductCard(product, showActions = true, showSizes = false) {
  const isWished = wishlist.includes(product.id);
  return `
    <div class="product-card reveal" data-category="${product.category}" data-color="${product.color}">
      <div class="product-card-img">
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </a>
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        ${showActions ? `<div class="product-actions">
          <button class="product-action-btn ${isWished ? 'wishlisted' : ''}" data-wishlist="${product.id}" onclick="toggleWishlist(${product.id})" aria-label="Favoris">
            <i class="${isWished ? 'fas' : 'far'} fa-heart"></i>
          </button>
          <a href="product.html?id=${product.id}" class="product-action-btn" aria-label="Voir">
            <i class="far fa-eye"></i>
          </a>
        </div>` : ''}
        ${showSizes ? `<div class="product-sizes" aria-label="Tailles disponibles">
          ${product.sizes.map(size => `<span>${size}</span>`).join('')}
        </div>` : ''}
      </div>
      <div class="product-card-info">
        <h3 class="product-card-name">
          <a href="product.html?id=${product.id}">${product.name}</a>
        </h3>
      </div>
    </div>
  `;
}

function createEveningPromoCard(contextClass) {
  return `
    <a class="editorial-promo ${contextClass}" href="catalogue.html" aria-label="Découvrir les robes de soirée">
      <img src="img/products/robe-noir-cuivre.jpg" alt="Robe de soirée noir cuivré" loading="lazy">
      <span class="editorial-promo-content">
        <span class="editorial-promo-eyebrow">La sélection</span>
        <strong>Robes de soirée</strong>
        <span class="editorial-promo-link">Découvrir <span aria-hidden="true">⟶</span></span>
      </span>
    </a>
  `;
}

function addTestimonialCard({ name, rating, text }) {
  const card = document.createElement('div');
  card.className = 'testimonial-card';

  const stars = document.createElement('div');
  stars.className = 'testimonial-stars';
  stars.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const review = document.createElement('p');
  review.className = 'testimonial-text';
  review.textContent = `« ${text} »`;

  const author = document.createElement('div');
  author.className = 'testimonial-author';
  author.textContent = name;

  const verified = document.createElement('div');
  verified.className = 'testimonial-verified';
  verified.textContent = '✓ Avis cliente';

  card.append(stars, review, author, verified);
  document.querySelector('.testimonials-slider')?.appendChild(card);
}

function setupTestimonials() {
  const form = document.getElementById('testimonialForm');
  const message = document.getElementById('testimonialFormMessage');
  if (!form || !message) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const text = formData.get('text').trim();
    const rating = Number(formData.get('rating'));

    addTestimonialCard({ name, rating, text });
    form.reset();
    message.textContent = 'Merci ! Votre avis a bien été ajouté.';
  });
}

function shouldShowEveningPromo() {
  const collection = new URLSearchParams(window.location.search).get('collection');
  if (collection && collection !== 'soiree') return false;

  const activeCategories = Array.from(
    document.querySelectorAll('.filter-option input[type="checkbox"]:checked')
  ).map(input => input.value).filter(value => value !== 'all');

  return activeCategories.length === 0 || activeCategories.includes('soiree');
}

function renderCatalogueProducts(products) {
  const grid = document.getElementById('catalogueGrid');
  if (!grid) return;

  const cards = products.map(product => createProductCard(product, true, true));
  if (shouldShowEveningPromo()) {
    cards.splice(Math.min(2, cards.length), 0, createEveningPromoCard('catalogue-promo'));
  }
  grid.innerHTML = cards.join('');
}

// ==========================================
// RENDER FEATURED PRODUCTS (Homepage)
// ==========================================
function renderFeaturedProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const featured = PRODUCTS.slice(0, 4);
  grid.innerHTML = createEveningPromoCard('featured-promo') +
    featured.map(product => createProductCard(product, false)).join('');

  // Trigger reveal animations
  setTimeout(() => observeRevealElements(), 100);
}

function setupFeaturedCarousel() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const getScrollDistance = () => {
    const card = grid.querySelector('.product-card');
    if (!card) return 0;

    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  document.querySelectorAll('.featured-carousel-arrow').forEach(button => {
    button.addEventListener('click', () => {
      const distance = getScrollDistance();
      if (!distance) return;

      grid.scrollBy({
        left: distance * Number(button.dataset.direction),
        behavior: 'smooth'
      });
    });
  });

}

// ==========================================
// RENDER CATALOGUE
// ==========================================
function renderCatalogue() {
  const grid = document.getElementById('catalogueGrid');
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const collection = params.get('collection');
  let filtered = [...PRODUCTS];

  if (collection === 'nouveautes') {
    filtered = filtered.filter(p => p.isNew);
  } else if (collection === 'halter' || collection === 'soiree') {
    filtered = filtered.filter(p => p.category === collection);
  } else if (collection === 'tie-dye') {
    filtered = filtered.filter(p => p.collection === 'tie-dye');
  }

  renderCatalogueProducts(filtered);

  const countEl = document.getElementById('resultCount');
  if (countEl) countEl.textContent = filtered.length;

  document.querySelectorAll('.catalogue-category').forEach(button => {
    button.classList.toggle('active', button.dataset.filter === (collection || 'all'));
  });

  setTimeout(() => observeRevealElements(), 100);
}

// ==========================================
// RENDER PRODUCT DETAIL
// ==========================================
function renderProductDetail() {
  const grid = document.getElementById('productDetailGrid');
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id')) || 1;
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];

  // Update page title
  document.title = `${product.name} — Naira Royale`;

  const stars = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '');

  grid.innerHTML = `
    <!-- Gallery -->
    <div class="product-gallery">
      <div class="product-main-image">
        <img src="${product.image}" alt="${product.name}" id="mainProductImage">
      </div>
    </div>

    <!-- Info -->
    <div class="product-info">
      <div class="breadcrumb" style="justify-content:flex-start; margin-bottom:20px;">
        <a href="index.html">Accueil</a>
        <span class="sep">›</span>
        <a href="catalogue.html">Boutique</a>
        <span class="sep">›</span>
        <span>${product.name}</span>
      </div>

      ${product.badge ? `<span style="display:inline-block; background:var(--gold); color:white; padding:4px 14px; font-size:0.7rem; font-weight:600; letter-spacing:1px; text-transform:uppercase; border-radius:4px; margin-bottom:12px;">${product.badge}</span>` : ''}

      <h1 class="product-title">${product.name}</h1>

      <div class="product-rating">
        <span class="stars">${stars}</span>
        <span class="count">${product.rating} (${product.reviews} avis)</span>
      </div>

      <div class="product-price">${formatPrice(product.price)}</div>
      <p class="product-description">${product.description}</p>

      <!-- Color -->
      <div class="product-option">
        <div class="product-option-label">Couleur : <span style="font-weight:400; text-transform:capitalize;">${product.color}</span></div>
        <div class="color-options">
          ${PRODUCTS.map(p => `
            <a href="product.html?id=${p.id}" class="color-option ${p.id === product.id ? 'active' : ''}" style="background:${p.colorHex};" title="${p.color}"></a>
          `).join('')}
        </div>
      </div>

      <div class="product-option">
        <div class="product-option-label">Choisissez une taille — ajout direct au panier</div>
        <div class="size-options">
          ${product.sizes.map(size => `
            <button type="button" class="size-btn" onclick="selectSize(this, '${size}', ${product.id})">${size}</button>
          `).join('')}
        </div>
      </div>

      <div class="add-to-cart-row">
        <span style="flex:1; font-size:0.82rem; color:var(--gray);">Touchez votre taille pour ajouter la robe au panier.</span>
        <button class="btn-wishlist ${wishlist.includes(product.id) ? 'active' : ''}" onclick="toggleWishlist(${product.id})" data-wishlist="${product.id}">
          <i class="${wishlist.includes(product.id) ? 'fas' : 'far'} fa-heart"></i>
        </button>
      </div>

      <!-- Trust -->
      <div class="trust-badges" style="margin-top:24px;">
        <div class="trust-badge"><i class="fas fa-hand-sparkles"></i> Création artisanale</div>
        <div class="trust-badge"><i class="fas fa-gem"></i> Pièce unique</div>
        <div class="trust-badge"><i class="fas fa-comments"></i> Conseil personnalisé</div>
      </div>
    </div>
  `;

  // Render recommended products (all except current)
  const recommended = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);
  const recGrid = document.getElementById('recommendedProducts');
  if (recGrid) {
    recGrid.innerHTML = recommended.map(p => createProductCard(p)).join('');
  }

  // Setup tabs
  setupTabs();
}

let selectedSize = 'M';

function selectSize(btn, size, productId) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedSize = size;
  addProductToCart(productId, size);
}

function changeQty(delta) {
  const input = document.getElementById('qtyInput');
  if (!input) return;
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  if (val > 10) val = 10;
  input.value = val;
}

function addProductToCart(productId, size = selectedSize) {
  const qtyInput = document.getElementById('qtyInput');
  const qty = qtyInput ? parseInt(qtyInput.value) : 1;
  if (addToCart(productId, size, qty)) {
    window.location.href = 'panier.html';
  }
}

// ==========================================
// RENDER CART PAGE
// ==========================================
function renderCartPage() {
  const tbody = document.getElementById('cartTableBody');
  const emptyEl = document.getElementById('cartPageEmpty');
  const tableEl = document.getElementById('cartTable');
  const summaryEl = document.getElementById('cartSummary');

  if (!tbody) return;

  if (cart.length === 0) {
    if (tableEl) tableEl.style.display = 'none';
    if (summaryEl) summaryEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  if (tableEl) tableEl.style.display = 'table';
  if (summaryEl) summaryEl.style.display = 'block';
  if (emptyEl) emptyEl.style.display = 'none';

  tbody.innerHTML = cart.map((item, idx) => `
    <tr>
      <td>
        <div style="display:flex; gap:16px; align-items:center;">
          <img src="${item.image}" alt="${item.name}" style="width:80px; height:100px; object-fit:cover; border-radius:4px;">
          <div>
            <div style="font-family:var(--font-heading); font-weight:500;">${item.name}</div>
            <div style="font-size:0.8rem; color:var(--gray); margin-top:4px;">Taille: ${item.size}</div>
          </div>
        </div>
      </td>
      <td>${formatPrice(item.price)}</td>
      <td>
        <div class="quantity-selector">
          <button class="qty-btn" onclick="updateCartQty(${idx}, ${item.qty - 1})">−</button>
          <input type="number" class="qty-input" value="${item.qty}" readonly>
          <button class="qty-btn" onclick="updateCartQty(${idx}, ${item.qty + 1})">+</button>
        </div>
      </td>
      <td style="font-weight:600; color:var(--gold-dark);">${formatPrice(item.price * item.qty)}</td>
      <td>
        <button onclick="removeFromCart(${idx})" style="color:var(--gray-light); font-size:1.2rem;" aria-label="Supprimer">
          <i class="fas fa-times"></i>
        </button>
      </td>
    </tr>
  `).join('');

  // Update summary
  const subtotal = getCartTotal();
  const subtotalEl = document.getElementById('summarySubtotal');
  const totalEl = document.getElementById('summaryTotal');
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl) totalEl.textContent = formatPrice(subtotal); // Shipping calculated at checkout
}

// ==========================================
// RENDER CHECKOUT PAGE
// ==========================================
function renderCheckoutPage() {
  const checkoutItems = document.getElementById('checkoutItems');
  if (!checkoutItems) return;
  if (cart.length === 0) {
    window.location.href = 'panier.html';
    return;
  }

  checkoutItems.innerHTML = cart.map(item => `
    <div class="checkout-summary-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-variant">Taille: ${item.size} × ${item.qty}</div>
      </div>
      <div class="item-price">${formatPrice(item.price * item.qty)}</div>
    </div>
  `).join('');

  const subtotal = getCartTotal();
  const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
  const delivery = selectedDelivery ? selectedDelivery.value : 'domicile';
  const shipping = subtotal >= 150 ? 0 : delivery === 'relais' ? 3.90 : 5.90;
  const total = subtotal + shipping;

  const subEl = document.getElementById('checkoutSubtotal');
  const totalEl = document.getElementById('checkoutTotal');
  const shippingEl = document.getElementById('checkoutShipping');

  if (subEl) subEl.textContent = formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Gratuit' : formatPrice(shipping);
  if (totalEl) totalEl.textContent = formatPrice(total);
}

function showCheckoutMessage(message, isError = true) {
  const messageEl = document.getElementById('checkoutPaymentMessage');
  if (!messageEl) return;
  messageEl.textContent = message;
  messageEl.style.color = isError ? 'var(--error)' : 'var(--success)';
}

function showCheckoutStatus(message, isError = false) {
  const statusEl = document.getElementById('checkoutPaymentStatus');
  if (!statusEl) return;
  statusEl.hidden = false;
  statusEl.classList.toggle('is-error', isError);
  statusEl.textContent = message;
}

function checkoutPayload() {
  const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
  return {
    items: cart.map(item => ({ id: item.id, size: item.size, quantity: item.qty })),
    delivery: selectedDelivery ? selectedDelivery.value : 'domicile'
  };
}

async function postCheckoutRequest(endpoint, payload) {
  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    throw new Error('Connexion impossible. Vérifie ta connexion puis réessaie.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Le serveur a renvoyé une réponse invalide.');
  }
  if (!response.ok) throw new Error(data.error || 'Le paiement n’a pas pu être démarré.');
  return data;
}

async function startCheckoutPayment(provider, button) {
  const originalLabel = button.innerHTML;
  button.disabled = true;
  showCheckoutMessage(`Connexion à ${provider}…`, false);

  try {
    const endpoint = provider === 'Stripe' ? '/api/create-stripe-checkout' : '/api/paypal-create-order';
    const data = await postCheckoutRequest(endpoint, checkoutPayload());
    const targetUrl = provider === 'Stripe' ? data.url : data.approvalUrl;
    if (!targetUrl) throw new Error(`${provider} n’a pas fourni de lien de paiement.`);

    let parsedUrl;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      throw new Error(`Le lien de paiement ${provider} est invalide.`);
    }

    const allowedHosts = provider === 'Stripe'
      ? ['checkout.stripe.com']
      : ['www.paypal.com', 'www.sandbox.paypal.com'];
    if (parsedUrl.protocol !== 'https:' || !allowedHosts.includes(parsedUrl.hostname)) {
      throw new Error(`Le lien de paiement ${provider} n’est pas sûr.`);
    }

    window.location.assign(parsedUrl.href);
  } catch (error) {
    showCheckoutMessage(error.message);
    button.disabled = false;
    button.innerHTML = originalLabel;
  }
}

function finishCheckoutPayment(message) {
  cart = [];
  saveCart();
  updateCartUI();
  const layout = document.getElementById('checkoutLayout');
  if (layout) layout.hidden = true;
  showCheckoutStatus(message);
  window.history.replaceState({}, '', 'checkout.html?payment=confirmed');
}

async function handleCheckoutReturn() {
  const params = new URLSearchParams(window.location.search);
  const payment = params.get('payment');

  if (payment === 'cancelled') {
    showCheckoutStatus('Paiement annulé. Ton panier est conservé, tu peux réessayer.');
    window.history.replaceState({}, '', 'checkout.html');
    return;
  }

  if (payment === 'stripe-return') {
    const sessionId = params.get('session_id');
    if (!sessionId) {
      showCheckoutStatus('La référence Stripe est absente. Ton panier est conservé.', true);
      return;
    }
    showCheckoutStatus('Vérification du paiement Stripe…');
    try {
      const result = await postCheckoutRequest('/api/stripe-session-status', { sessionId });
      if (result.paid) {
        finishCheckoutPayment('Paiement confirmé. Merci pour ta commande !');
      } else {
        showCheckoutStatus('Stripe n’a pas confirmé le paiement. Ton panier est conservé.', true);
      }
    } catch (error) {
      showCheckoutStatus(error.message, true);
    }
  }

  if (payment === 'paypal-return') {
    const orderId = params.get('token');
    if (!orderId) {
      showCheckoutStatus('La référence PayPal est absente. Ton panier est conservé.', true);
      return;
    }
    showCheckoutStatus('Confirmation du paiement PayPal…');
    try {
      const result = await postCheckoutRequest('/api/paypal-capture-order', { orderId });
      if (result.paid) {
        finishCheckoutPayment('Paiement confirmé. Merci pour ta commande !');
      } else {
        showCheckoutStatus('PayPal n’a pas confirmé le paiement. Ton panier est conservé.', true);
      }
    } catch (error) {
      showCheckoutStatus(error.message, true);
    }
  }
}

function setupCheckoutPayments() {
  const stripeButton = document.getElementById('stripePayButton');
  const paypalButton = document.getElementById('paypalPayButton');
  if (!stripeButton || !paypalButton) return;

  stripeButton.addEventListener('click', () => startCheckoutPayment('Stripe', stripeButton));
  paypalButton.addEventListener('click', () => startCheckoutPayment('PayPal', paypalButton));
  document.querySelectorAll('input[name="delivery"]').forEach(input => {
    input.addEventListener('change', renderCheckoutPage);
  });
  handleCheckoutReturn();
}

// ==========================================
// TABS
// ==========================================
function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      const tabContent = document.getElementById('tab-' + tabId);
      if (tabContent) tabContent.classList.add('active');
    });
  });
}

// ==========================================
// FAQ
// ==========================================
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  const wasActive = item.classList.contains('active');
  
  // Close all
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
  
  // Toggle current
  if (!wasActive) {
    item.classList.add('active');
  }
}

// ==========================================
// SEARCH
// ==========================================
function openSearch() {
  const overlay = document.getElementById('searchOverlay');
  if (overlay) {
    overlay.classList.add('active');
    const input = document.getElementById('searchInput');
    if (input) setTimeout(() => input.focus(), 300);
  }
}

function closeSearch() {
  const overlay = document.getElementById('searchOverlay');
  if (overlay) overlay.classList.remove('active');
}

// ==========================================
// NEWSLETTER
// ==========================================
function handleNewsletter(e) {
  e.preventDefault();
  showToast('✨ Merci ! Vous êtes inscrit(e) à la newsletter');
  e.target.reset();
  return false;
}

// ==========================================
// CONTACT FORM
// ==========================================
function handleContact(e) {
  e.preventDefault();
  showToast('✨ Message envoyé ! Nous vous répondrons sous 24h');
  e.target.reset();
  return false;
}

// ==========================================
// FILTER RESET
// ==========================================
function resetFilters() {
  document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
    cb.checked = cb.value === 'all';
  });
  document.querySelectorAll('.filter-color').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.price-range input').forEach(i => { i.value = ''; });
  renderCatalogue();
  showToast('Filtres réinitialisés');
}

// ==========================================
// TOAST
// ==========================================
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==========================================
// SCROLL REVEAL
// ==========================================
function observeRevealElements() {
  const reveals = document.querySelectorAll('.reveal:not(.visible)');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ==========================================
// HEADER SCROLL
// ==========================================
function handleHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
}

// ==========================================
// MOBILE MENU
// ==========================================
function toggleMobileMenu() {
  const nav = document.getElementById('navMain');
  const toggle = document.getElementById('menuToggle');
  if (nav) nav.classList.toggle('open');
  if (toggle) toggle.classList.toggle('active');
}

function setupNavMegaMenu(nav, linkText, menuId, ariaLabel, featuredProducts, menuColumns) {
  const navLink = Array.from(nav.children).find(
    child => child.tagName === 'A' && child.textContent.trim() === linkText
  );
  if (!navLink) return;

  const dropdown = document.createElement('div');
  dropdown.className = 'nav-dropdown';
  navLink.parentNode.insertBefore(dropdown, navLink);
  dropdown.appendChild(navLink);

  const menu = document.createElement('div');
  menu.className = 'mega-menu';
  menu.id = menuId;
  menu.setAttribute('role', 'region');
  menu.setAttribute('aria-label', ariaLabel);
  navLink.setAttribute('aria-haspopup', 'true');
  navLink.setAttribute('aria-controls', menu.id);

  const inner = document.createElement('div');
  inner.className = 'mega-menu-inner';

  const gallery = document.createElement('div');
  gallery.className = 'mega-menu-gallery';
  featuredProducts.forEach(product => {
    const card = document.createElement('a');
    card.href = `product.html?id=${product.id}`;

    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    image.loading = 'lazy';

    const caption = document.createElement('span');
    caption.textContent = product.name;
    card.append(image, caption);
    gallery.appendChild(card);
  });
  inner.appendChild(gallery);

  menuColumns.forEach(({ heading, links }) => {
    const column = document.createElement('div');
    column.className = 'mega-menu-column';

    const title = document.createElement('span');
    title.className = 'mega-menu-heading';
    title.textContent = heading;
    column.appendChild(title);

    links.forEach(([label, href]) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      column.appendChild(link);
    });

    inner.appendChild(column);
  });

  menu.appendChild(inner);
  dropdown.appendChild(menu);
}

function setupHeaderMegaMenus() {
  const nav = document.getElementById('navMain');
  if (!nav) return;

  const collectionLinks = [
    { heading: 'À découvrir', links: [
      ['Toutes les robes', 'catalogue.html'],
      ['Nouveautés', 'catalogue.html?collection=nouveautes'],
      ['Nos meilleures ventes', 'index.html#featured']
    ] },
    { heading: 'Nos styles', links: [
      ['Robes Halter', 'catalogue.html?collection=halter'],
      ['Tie-Dye Signature', 'catalogue.html?collection=tie-dye'],
      ['Robes de soirée', 'catalogue.html']
    ] }
  ];

  setupNavMegaMenu(
    nav,
    'Boutique',
    'boutiqueMegaMenu',
    'Collections de la boutique',
    PRODUCTS.slice(0, 2),
    collectionLinks
  );
  setupNavMegaMenu(
    nav,
    'Nouveautés',
    'nouveautesMegaMenu',
    'Nouveautés de la boutique',
    PRODUCTS.filter(product => product.isNew).slice(0, 2),
    [
      { heading: 'À découvrir', links: [
        ['Toutes les nouveautés', 'catalogue.html?collection=nouveautes'],
        ['Toutes les robes', 'catalogue.html'],
        ['Nos meilleures ventes', 'index.html#featured']
      ] },
      ...collectionLinks.slice(1)
    ]
  );
}

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  setupWishlistPanel();
  // Update cart UI on load
  updateCartUI();
  updateWishlistUI();

  // Render featured products on homepage
  renderFeaturedProducts();
  setupFeaturedCarousel();

  // Render catalogue and apply URL category filters
  renderCatalogue();
  setupTestimonials();
  setupCheckoutPayments();

  const introDescription = document.getElementById('catalogueIntroDescription');
  const introToggle = document.getElementById('catalogueIntroToggle');
  if (introDescription && introToggle) {
    introToggle.addEventListener('click', () => {
      const expanded = introToggle.getAttribute('aria-expanded') === 'true';
      introToggle.setAttribute('aria-expanded', String(!expanded));
      introDescription.classList.toggle('is-expanded', !expanded);
      introToggle.textContent = expanded ? 'EN SAVOIR PLUS' : 'VOIR MOINS';
    });
  }

  // Header scroll
  window.addEventListener('scroll', handleHeaderScroll);

  // Cart button
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      if (document.getElementById('cartSidebar')) {
        openCart();
      } else {
        window.location.href = 'panier.html';
      }
    });
  }

  const wishlistBtn = document.getElementById('wishlistBtn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', event => {
      event.preventDefault();
      openWishlist();
    });
  }

  // Cart close
  const cartClose = document.getElementById('cartClose');
  if (cartClose) cartClose.addEventListener('click', closeCart);

  const cartOverlay = document.getElementById('cartOverlay');
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Search
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) searchBtn.addEventListener('click', openSearch);

  const searchClose = document.getElementById('searchClose');
  if (searchClose) searchClose.addEventListener('click', closeSearch);

  // Close search on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      closeCart();
      closeWishlist();
    }
  });

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) menuToggle.addEventListener('click', toggleMobileMenu);

  setupHeaderMegaMenus();

  // Close mobile nav on link click
  document.querySelectorAll('.nav-main a').forEach(link => {
    link.addEventListener('click', () => {
      const nav = document.getElementById('navMain');
      if (nav) nav.classList.remove('open');
    });
  });

  // Back to top
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Tabs setup
  setupTabs();

  // Scroll reveal
  observeRevealElements();

  // Delivery options toggle
  document.querySelectorAll('.delivery-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.delivery-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // View toggle (grid/list)
  document.querySelectorAll('.view-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = document.getElementById('catalogueGrid');
      if (grid) {
        if (btn.dataset.view === 'list') {
          grid.style.gridTemplateColumns = '1fr 1fr';
        } else {
          grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        }
      }
    });
  });

  // Sort
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const grid = document.getElementById('catalogueGrid');
      if (!grid) return;

      let sorted = [...PRODUCTS];
      switch (sortSelect.value) {
        case 'price-asc':
          sorted.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          sorted.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'newest':
          sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
      }

      renderCatalogueProducts(sorted);
      observeRevealElements();
    });
  }

  // Color filter clicks
  document.querySelectorAll('.filter-color').forEach(dot => {
    dot.addEventListener('click', () => {
      dot.classList.toggle('active');
      applyFilters();
    });
  });

  // Category filter
  document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });

  // Top catalogue category navigation
  document.querySelectorAll('.catalogue-category').forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      const url = new URL(window.location.href);

      if (filter === 'all') {
        url.searchParams.delete('collection');
      } else {
        url.searchParams.set('collection', filter);
      }

      window.history.replaceState({}, '', url);
      renderCatalogue();
    });
  });

  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (q.length < 2) return;
      
      const results = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.color.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );

      if (results.length > 0) {
        closeSearch();
        window.location.href = `catalogue.html?search=${encodeURIComponent(q)}`;
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = e.target.value.trim();
        if (q) {
          closeSearch();
          window.location.href = `catalogue.html?search=${encodeURIComponent(q)}`;
        }
      }
    });
  }
});

function applyFilters() {
  const grid = document.getElementById('catalogueGrid');
  if (!grid) return;

  // Get active colors
  const activeColors = Array.from(document.querySelectorAll('.filter-color.active')).map(d => d.dataset.color);

  // Get active categories
  const activeCategories = Array.from(document.querySelectorAll('.filter-option input[type="checkbox"]:checked')).map(cb => cb.value).filter(v => v !== 'all');

  let filtered = [...PRODUCTS];

  if (activeColors.length > 0) {
    filtered = filtered.filter(p => activeColors.includes(p.color));
  }

  if (activeCategories.length > 0) {
    filtered = filtered.filter(p => activeCategories.includes(p.category));
  }

  renderCatalogueProducts(filtered);
  
  const countEl = document.getElementById('resultCount');
  if (countEl) countEl.textContent = filtered.length;

  observeRevealElements();
}
