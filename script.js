/* =========================================================
   script.js — Zenio Home
   Supabase client · Catalogue · Product detail · Cart
   ========================================================= */

/* ── 1. Supabase initialisation ──────────────────────────── */
(function initSupabase() {
  const cfg = window.ZENIO_CONFIG || {};
  const url = cfg.supabaseUrl;
  const key = cfg.supabaseKey;

  if (!url || url.includes('__SUPABASE_URL__') || !key || key.includes('__SUPABASE_KEY__')) {
    console.warn('[Zenio] Supabase credentials not set — falling back to demo data.');
    window.ZENIO_SUPABASE = null;
    return;
  }

  window.ZENIO_SUPABASE = supabase.createClient(url, key);
  console.info('[Zenio] Supabase connected.');
})();

window.ZENIO_PRODUCTS = [];

/* ── 2. Product helpers ──────────────────────────────────── */
function normalizeProduct(p) {
  const images = Array.isArray(p.images)
    ? p.images
    : p.image_url
      ? [p.image_url]
      : [];

  return {
    id: Number(p.id),
    name: p.name || 'Zenio Fan Product',
    cat: p.category || 'Zenio Fan',
    catSlug: 'zenio-fan',
    price: Number.parseFloat(p.price || 0),
    oldPrice: p.old_price ? Number.parseFloat(p.old_price) : null,
    tag: p.tag || null,
    emoji: p.emoji || '❄️',
    desc: p.description || '',
    isNew: Boolean(p.is_new),
    images,
    imageUrl: images[0] || null,
    inStock: p.in_stock !== false,
  };
}

async function fetchProducts() {
  if (!window.ZENIO_SUPABASE) {
    return window.ALL_PRODUCTS_DEMO || [];
  }

  const { data, error } = await window.ZENIO_SUPABASE
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('[Zenio] Supabase fetch error:', error.message);
    return window.ALL_PRODUCTS_DEMO || [];
  }

  return data.map(normalizeProduct);
}

async function fetchProductById(id) {
  if (!window.ZENIO_SUPABASE) {
    return (window.ALL_PRODUCTS_DEMO || []).find(p => Number(p.id) === Number(id)) || null;
  }

  const { data, error } = await window.ZENIO_SUPABASE
    .from('products')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (error) {
    console.error('[Zenio] Product fetch error:', error.message);
    return null;
  }

  return normalizeProduct(data);
}

function formatPrice(price) {
  return `${Number(price).toFixed(2).replace('.', ',')} €`;
}

function productImageHTML(product, className = '') {
  const img = product.images?.[0] || product.imageUrl;

  if (img) {
    return `<img class="${className}" src="${img}" alt="${product.name}" loading="lazy">`;
  }

  return `<div class="product-img-placeholder">${product.emoji || '❄️'}</div>`;
}

/* ── 3. Demo fallback data ───────────────────────────────── */
window.ALL_PRODUCTS_DEMO = [
  {
    id: 1,
    name: 'ArcticBreeze™ Mini Air Conditioner',
    cat: 'Zenio Fan',
    catSlug: 'zenio-fan',
    price: 34.99,
    oldPrice: null,
    tag: null,
    emoji: '❄️',
    desc: 'Portable personal cooling for desks, bedrooms, and small spaces.',
    images: [],
    imageUrl: null,
    inStock: true,
  },
];

/* ── 4. Catalogue page logic ─────────────────────────────── */
if (document.getElementById('productsGrid')) {
  const ITEMS_PER_PAGE = 12;
  let ALL_PRODUCTS = [];
  let currentPage = 1;
  let viewMode = 'grid';

  function showSkeleton() {
    const grid = document.getElementById('productsGrid');
    grid.className = 'products-grid';

    grid.innerHTML = Array.from({ length: 6 }, () => `
      <div class="product-card skeleton-card">
        <div class="product-img-wrap">
          <div class="skeleton skeleton-img"></div>
        </div>
        <div class="product-info">
          <div class="skeleton skeleton-line" style="width:45%;height:10px;margin-bottom:10px"></div>
          <div class="skeleton skeleton-line" style="width:75%;height:18px;margin-bottom:16px"></div>
          <div class="skeleton skeleton-line" style="width:35%;height:16px"></div>
        </div>
      </div>
    `).join('');
  }

  function getFilteredProducts() {
    const query = (document.getElementById('searchBar')?.value || '').toLowerCase();
    const minPrice = parseFloat(document.getElementById('priceMin')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('priceMax')?.value) || Infinity;
    const sort = document.getElementById('sortSelect')?.value || 'featured';

    let products = ALL_PRODUCTS.filter(p => {
      const searchable = `${p.name} ${p.cat}`.toLowerCase();

      if (query && !searchable.includes(query)) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      if (p.inStock === false) return false;

      return true;
    });

    if (sort === 'price-asc') products.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);
    else if (sort === 'name') products.sort((a, b) => a.name.localeCompare(b.name));
    else products.sort((a, b) => a.id - b.id);

    return products;
  }

  function productCardHTML(p) {
    const t = window.ZENIO_T || (k => k);
    const img = p.images?.[0] || p.imageUrl;

    const imgEl = img
      ? `<img src="${img}" alt="${p.name}" loading="lazy">`
      : `<div class="product-img-placeholder">${p.emoji || '❄️'}</div>`;

    return `
      <article class="product-card" data-product-id="${p.id}">
        <a class="product-card-link" href="produit.html?id=${encodeURIComponent(p.id)}">
          <div class="product-img-wrap">
            ${imgEl}
          </div>

          <div class="product-info">
            <div class="product-category">${p.cat || 'Zenio Fan'}</div>
            <h3 class="product-name">${p.name}</h3>

            <div class="product-footer">
              <div class="product-price">
                ${p.oldPrice ? `<span class="old-price">${formatPrice(p.oldPrice)}</span>` : ''}
                ${formatPrice(p.price)}
              </div>
            </div>
          </div>
        </a>

        <button class="add-btn" onclick="event.stopPropagation();addToCart(${Number(p.id)})">
          ${t('add_to_cart') || '+ Panier'}
        </button>
      </article>
    `;
  }

  function renderProducts() {
    const products = getFilteredProducts();
    const total = products.length;
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const page = products.slice(start, start + ITEMS_PER_PAGE);

    const countEl = document.getElementById('pageCount');
    if (countEl) countEl.textContent = `${total} products`;

    const grid = document.getElementById('productsGrid');
    grid.className = 'products-grid' + (viewMode === 'list' ? ' list-view' : '');

    if (!page.length) {
      grid.innerHTML = `
        <div class="no-results" style="grid-column:1/-1">
          <div class="no-results-icon">🔍</div>
          <p>No products found.</p>
        </div>
      `;
    } else {
      grid.innerHTML = page.map(productCardHTML).join('');
    }

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const pgEl = document.getElementById('pagination');

    if (pgEl) {
      if (totalPages <= 1) {
        pgEl.innerHTML = '';
        return;
      }

      let btns = '';

      if (currentPage > 1) {
        btns += `<button class="page-btn" onclick="goPage(${currentPage - 1})">‹</button>`;
      }

      for (let i = 1; i <= totalPages; i++) {
        btns += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
      }

      if (currentPage < totalPages) {
        btns += `<button class="page-btn" onclick="goPage(${currentPage + 1})">›</button>`;
      }

      pgEl.innerHTML = btns;
    }
  }

  window.applyFilters = function () {
    currentPage = 1;
    renderProducts();
  };

  window.clearFilters = function () {
    const pi = document.getElementById('priceMin');
    const pa = document.getElementById('priceMax');
    const sb = document.getElementById('searchBar');

    if (pi) pi.value = '';
    if (pa) pa.value = '';
    if (sb) sb.value = '';

    applyFilters();
  };

  window.goPage = function (page) {
    currentPage = page;
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.setView = function (v) {
    viewMode = v;
    document.getElementById('gridBtn')?.classList.toggle('active', v === 'grid');
    document.getElementById('listBtn')?.classList.toggle('active', v === 'list');
    renderProducts();
  };

  async function initCatalogue() {
    const pt = document.getElementById('pageTitle');
    const bc = document.getElementById('breadcrumbCat');

    if (pt) pt.textContent = 'Zenio Fan';
    if (bc) bc.textContent = 'Zenio Fan';

    showSkeleton();

    try {
      ALL_PRODUCTS = await fetchProducts();
      window.ZENIO_PRODUCTS = ALL_PRODUCTS;
    } catch (e) {
      console.error('[Zenio] fetchProducts error:', e);
      ALL_PRODUCTS = window.ALL_PRODUCTS_DEMO || [];
      window.ZENIO_PRODUCTS = ALL_PRODUCTS;
    }

    renderProducts();
    updateCartUI();
  }

  initCatalogue();
}

/* ── 5. Product detail page logic ────────────────────────── */
if (document.getElementById('productLayout')) {
  async function initProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id'));

    const layout = document.getElementById('productLayout');

    if (!id) {
      layout.innerHTML = `<div class="product-not-found">Product not found.</div>`;
      return;
    }

    const product = await fetchProductById(id);

    if (!product) {
      layout.innerHTML = `<div class="product-not-found">Product not found.</div>`;
      return;
    }

    document.title = `${product.name} — Zenio Home`;

    const breadcrumbName = document.getElementById('breadcrumbName');
    if (breadcrumbName) breadcrumbName.textContent = product.name;

    const images = product.images?.length ? product.images : [product.imageUrl].filter(Boolean);
    const mainImage = images[0];

    layout.innerHTML = `
      <div class="product-gallery">
        <div class="main-img-wrap" id="mainImageWrap">
          ${
            mainImage
              ? `<img src="${mainImage}" alt="${product.name}" id="mainProductImage">`
              : `<div class="main-img-placeholder">${product.emoji || '❄️'}</div>`
          }
        </div>

        ${
          images.length > 1
            ? `<div class="gallery-thumbnails">
                ${images.map((img, index) => `
                  <button class="thumb ${index === 0 ? 'active' : ''}" onclick="setMainProductImage('${img}', ${index})">
                    <img src="${img}" alt="${product.name} image ${index + 1}">
                  </button>
                `).join('')}
              </div>`
            : ''
        }
      </div>

      <div class="product-info-panel">
        <div class="product-cat-label">${product.cat || 'Zenio Fan'}</div>
        <h1 class="product-name-large">${product.name}</h1>

        <div class="price-block">
          <div class="price-main">${formatPrice(product.price)}</div>
        </div>

        <div class="product-short-desc">
          ${product.desc.replace(/\n/g, '<br>')}
        </div>

        <div class="delivery-info">
          <div class="delivery-row">
            <span class="delivery-icon">🔒</span>
            <span>Secure encrypted checkout</span>
          </div>
          <div class="delivery-row">
            <span class="delivery-icon">🛡️</span>
            <span>Payment information protected</span>
          </div>
          <div class="delivery-row">
            <span class="delivery-icon">📦</span>
            <span>Carefully packed for a clean delivery experience</span>
          </div>
        </div>

        <div class="add-to-cart-block">
          <button class="btn-add-cart" onclick="addToCart(${product.id})">
            Add to Cart
          </button>
        </div>

        <div class="accordion">
          <div class="accordion-item">
            <button class="accordion-btn open" onclick="toggleAccordion(this)">
              Product Details <span class="icon">+</span>
            </button>
            <div class="accordion-body" style="max-height: 500px;">
              <div class="accordion-body-inner">
                ${product.desc.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>

          <div class="accordion-item">
            <button class="accordion-btn" onclick="toggleAccordion(this)">
              Payment Security <span class="icon">+</span>
            </button>
            <div class="accordion-body">
              <div class="accordion-body-inner">
                Your payment is protected through secure checkout technology. Transactions are processed using encrypted systems designed to protect your personal and billing information. Zenio Home does not store sensitive card details.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const relatedGrid = document.getElementById('relatedGrid');
    if (relatedGrid) {
      const allProducts = await fetchProducts();
      window.ZENIO_PRODUCTS = allProducts;

      relatedGrid.innerHTML = allProducts
        .filter(p => Number(p.id) !== Number(product.id))
        .slice(0, 4)
        .map(p => `
          <article class="product-card" onclick="window.location='produit.html?id=${p.id}'">
            <div class="product-img-wrap">
              ${productImageHTML(p)}
            </div>
            <div class="product-info">
              <div class="product-category">${p.cat}</div>
              <div class="product-name-sm">${p.name}</div>
              <div class="product-footer">
                <div class="product-price">${formatPrice(p.price)}</div>
                <button class="add-btn" onclick="event.stopPropagation();addToCart(${p.id})">+ Panier</button>
              </div>
            </div>
          </article>
        `)
        .join('');
    }
  }

  window.setMainProductImage = function (src, activeIndex) {
    const img = document.getElementById('mainProductImage');
    if (img) img.src = src;

    document.querySelectorAll('.thumb').forEach((thumb, index) => {
      thumb.classList.toggle('active', index === activeIndex);
    });
  };

  window.toggleAccordion = function (btn) {
    const body = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');

    btn.classList.toggle('open', !isOpen);
    body.style.maxHeight = isOpen ? '0' : `${body.scrollHeight}px`;
  };

  initProductDetail();
}

/* ── 6. Cart ─────────────────────────────────────────────── */
let cart = JSON.parse(localStorage.getItem('zenio_cart') || '[]');

function saveCart() {
  localStorage.setItem('zenio_cart', JSON.stringify(cart));
}

window.addToCart = async function (productId) {
  const id = Number(productId);

  let source = window.ZENIO_PRODUCTS?.length
    ? window.ZENIO_PRODUCTS
    : [];

  let product = source.find(x => Number(x.id) === id);

  if (!product) {
    product = await fetchProductById(id);
  }

  if (!product) return;

  const existing = cart.find(x => Number(x.id) === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, id, qty: 1 });
  }

  saveCart();
  updateCartUI();

  const t = window.ZENIO_T || (k => k);
  showToast(`${product.name} ${t('added_to_cart') || 'added to cart'}`);
};

window.removeFromCart = function (id) {
  cart = cart.filter(x => Number(x.id) !== Number(id));
  saveCart();
  updateCartUI();
};

window.changeQty = function (id, delta) {
  const item = cart.find(x => Number(x.id) === Number(id));
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
    updateCartUI();
  }
};

function updateCartUI() {
  const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0);
  const count = cart.reduce((sum, item) => sum + Number(item.qty), 0);

  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');

  if (!itemsEl) return;

  if (!cart.length) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Your cart is empty.</p>
      </div>
    `;

    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = cart.map(item => {
    const img = item.images?.[0] || item.imageUrl;

    return `
      <div class="cart-item">
        <div class="cart-item-img">
          ${img ? `<img src="${img}" alt="${item.name}">` : item.emoji || '❄️'}
        </div>

        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>

          <div class="cart-item-controls">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (totalEl) totalEl.textContent = formatPrice(total);
  if (footerEl) footerEl.style.display = 'block';
}

window.toggleCart = function () {
  document.getElementById('cartDrawer')?.classList.toggle('open');
  document.getElementById('cartOverlay')?.classList.toggle('open');
};

window.showToast = function (msg) {
  const el = document.getElementById('toast');
  if (!el) return;

  el.textContent = msg;
  el.classList.add('show');

  setTimeout(() => el.classList.remove('show'), 2800);
};

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('langToggle');

  if (btn) {
    btn.addEventListener('click', () => {
      if (window.ZENIO_TOGGLE_LANG) window.ZENIO_TOGGLE_LANG();
    });
  }

  updateCartUI();
});
