/* =========================================================
   script.js — Zenio Home
   Supabase client · Product catalogue · Cart · Utilities
   ========================================================= */

/* ── 1. Supabase initialisation ──────────────────────────── */
(function initSupabase() {
  const cfg = window.ZENIO_CONFIG || {};
  const url  = cfg.supabaseUrl;
  const key  = cfg.supabaseKey;

  if (!url || url.includes('__SUPABASE_URL__') || !key || key.includes('__SUPABASE_KEY__')) {
    console.warn('[Zenio] Supabase credentials not set — falling back to demo data.');
    window.ZENIO_SUPABASE = null;
    return;
  }

  // Supabase JS v2 is loaded via CDN in each HTML file
  window.ZENIO_SUPABASE = supabase.createClient(url, key);
  console.info('[Zenio] Supabase connected.');
})();


/* ── 2. Product helpers ──────────────────────────────────── */

/**
 * Fetch all products from Supabase `products` table.
 * Expected columns: id, name, category, cat_slug, price, old_price,
 *                   tag, emoji, description, is_new, image_url, in_stock
 * Falls back to ALL_PRODUCTS_DEMO if Supabase is unavailable.
 */
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
  // Normalise snake_case → camelCase
  return data.map(p => ({
    id:          p.id,
    name:        p.name,
    cat:         p.category,
    catSlug:     p.cat_slug,
    price:       parseFloat(p.price),
    oldPrice:    p.old_price ? parseFloat(p.old_price) : null,
    tag:         p.tag || null,
    emoji:       p.emoji || '📦',
    desc:        p.description || '',
    isNew:       p.is_new || false,
    imageUrl:    p.image_url || null,
    inStock:     p.in_stock !== false,
  }));
}

/* ── 3. Demo / fallback product data ─────────────────────── */
window.ALL_PRODUCTS_DEMO = [
  { id:1,  name:'Thermomètre Smart',        cat:'Maison Connectée', catSlug:'maison-connectee', price:34.99, oldPrice:null,   tag:null,    emoji:'🌡️', desc:'Suivi temp. & humidité, app mobile',        isNew:false },
  { id:2,  name:'Ampoule LED RGB',           cat:'Éclairage',        catSlug:'eclairage',        price:19.99, oldPrice:24.99,  tag:'Promo', emoji:'💡', desc:'16M couleurs, compatible Alexa & Google',  isNew:false },
  { id:3,  name:'Mini Aspirateur Bureau',    cat:'Bureau',           catSlug:'bureau',           price:27.99, oldPrice:null,   tag:null,    emoji:'🧹', desc:'Rechargeable USB-C, silencieux',           isNew:false },
  { id:4,  name:'Capteur Humidité Plante',   cat:'Bien-être',        catSlug:'bien-etre',        price:14.99, oldPrice:null,   tag:'Nouveau',emoji:'🌿',desc:'Alerte smartphone, IP65',                  isNew:true  },
  { id:5,  name:'Diffuseur Mag-Lev',         cat:'Bien-être',        catSlug:'bien-etre',        price:89.99, oldPrice:null,   tag:'Nouveau',emoji:'🌀',desc:'Lévitation magnétique, ultra silencieux',   isNew:true  },
  { id:6,  name:'Prise Connectée',           cat:'Maison Connectée', catSlug:'maison-connectee', price:22.99, oldPrice:29.99,  tag:'Promo', emoji:'🔌', desc:'Mesure conso. énergie, timer',             isNew:false },
  { id:7,  name:'Lampe de Bureau LED',       cat:'Éclairage',        catSlug:'eclairage',        price:49.99, oldPrice:null,   tag:null,    emoji:'🔦', desc:'Luminosité adaptative, chargeur Qi',       isNew:false },
  { id:8,  name:'Balance Cuisine Smart',     cat:'Cuisine Tech',     catSlug:'cuisine',          price:39.99, oldPrice:null,   tag:null,    emoji:'⚖️', desc:'Précision 1g, calcul nutritionnel app',    isNew:false },
  { id:9,  name:'Détecteur de Fumée WiFi',   cat:'Maison Connectée', catSlug:'maison-connectee', price:44.99, oldPrice:null,   tag:'Nouveau',emoji:'🔥',desc:'Alerte instantanée, 10 ans de batterie',   isNew:true  },
  { id:10, name:'Caméra Intérieure 1080p',   cat:'Maison Connectée', catSlug:'maison-connectee', price:59.99, oldPrice:74.99,  tag:'Promo', emoji:'📷', desc:'Vision nocturne, stockage cloud',          isNew:false },
  { id:11, name:'Ruban LED Connecté 5m',     cat:'Éclairage',        catSlug:'eclairage',        price:32.99, oldPrice:null,   tag:null,    emoji:'🌈', desc:'Découpe flexible, app + télécommande',     isNew:false },
  { id:12, name:'Serrure Connectée',         cat:'Maison Connectée', catSlug:'maison-connectee', price:129.99,oldPrice:null,   tag:'Nouveau',emoji:'🔑',desc:'Code, empreinte, smartphone',              isNew:true  },
  { id:13, name:'Robot Aspirateur',          cat:'Maison Connectée', catSlug:'maison-connectee', price:199.99,oldPrice:249.99, tag:'Promo', emoji:'🤖', desc:'Cartographie laser, retour base auto',     isNew:false },
  { id:14, name:'Purificateur d\'Air',       cat:'Bien-être',        catSlug:'bien-etre',        price:79.99, oldPrice:null,   tag:null,    emoji:'🫁', desc:'Filtre HEPA H13, silencieux 25dB',         isNew:false },
  { id:15, name:'Chargeur Bureau 65W',       cat:'Bureau',           catSlug:'bureau',           price:34.99, oldPrice:null,   tag:null,    emoji:'⚡', desc:'4 ports USB-C PD, charge rapide',          isNew:false },
  { id:16, name:'Organiseur Câbles Premium', cat:'Bureau',           catSlug:'bureau',           price:18.99, oldPrice:null,   tag:null,    emoji:'🗂️', desc:'Silicone souple, coloris discrets',        isNew:false },
  { id:17, name:'Machine à Expresso Smart',  cat:'Cuisine Tech',     catSlug:'cuisine',          price:149.99,oldPrice:null,   tag:'Nouveau',emoji:'☕',desc:'App mobile, chaleur précise ±1°C',         isNew:true  },
  { id:18, name:'Carafe Filtrante UV',       cat:'Cuisine Tech',     catSlug:'cuisine',          price:54.99, oldPrice:null,   tag:null,    emoji:'🧊', desc:'Stérilisation UV intégrée, 2.4L',          isNew:false },
];


/* ── 4. Catalogue page logic ─────────────────────────────── */

// Only runs on catalogue.html
if (document.getElementById('productsGrid')) {

  const ITEMS_PER_PAGE = 12;
  let ALL_PRODUCTS = [];
  let currentPage  = 1;
  let viewMode     = 'grid';
  let isLoading    = false;

  const urlParams = new URLSearchParams(window.location.search);
  const catParam  = urlParams.get('cat');

  /* ── Render skeleton loaders ── */
  function showSkeleton() {
    const grid = document.getElementById('productsGrid');
    grid.className = 'products-grid';
    grid.innerHTML = Array.from({ length: 6 }, () => `
      <div class="product-card skeleton-card">
        <div class="product-img-wrap">
          <div class="skeleton skeleton-img"></div>
        </div>
        <div class="product-info">
          <div class="skeleton skeleton-line" style="width:40%;height:10px;margin-bottom:8px"></div>
          <div class="skeleton skeleton-line" style="width:75%;height:16px;margin-bottom:8px"></div>
          <div class="skeleton skeleton-line" style="width:60%;height:12px;margin-bottom:16px"></div>
          <div class="skeleton skeleton-line" style="width:35%;height:14px"></div>
        </div>
      </div>
    `).join('');
  }

  /* ── Filter & sort ── */
  function getFilteredProducts() {
    const query       = (document.getElementById('searchBar')?.value || '').toLowerCase();
    const selectedCats= [...document.querySelectorAll('input[name="cat"]:checked')].map(i => i.value);
    const selectedDispo=[...document.querySelectorAll('input[name="dispo"]:checked')].map(i => i.value);
    const minPrice    = parseFloat(document.getElementById('priceMin')?.value) || 0;
    const maxPrice    = parseFloat(document.getElementById('priceMax')?.value) || Infinity;
    const sort        = document.getElementById('sortSelect')?.value || 'featured';

    let products = ALL_PRODUCTS.filter(p => {
      if (query && !p.name.toLowerCase().includes(query) && !p.cat.toLowerCase().includes(query) && !p.desc.toLowerCase().includes(query)) return false;
      if (selectedCats.length && !selectedCats.includes(p.catSlug)) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      if (selectedDispo.includes('promo')  && p.tag !== 'Promo' && p.tag !== 'Sale')   return false;
      if (selectedDispo.includes('nouveau')&& !p.isNew)   return false;
      if (selectedDispo.includes('stock')  && p.inStock === false) return false;
      return true;
    });

    const t = window.ZENIO_T || (k => k);
    if (sort === 'price-asc')  products.sort((a,b) => a.price - b.price);
    else if (sort === 'price-desc') products.sort((a,b) => b.price - a.price);
    else if (sort === 'name')  products.sort((a,b) => a.name.localeCompare(b.name));
    else if (sort === 'newest') products.sort((a,b) => b.isNew - a.isNew);

    return products;
  }

  /* ── Build one product card HTML ── */
  function productCardHTML(p) {
    const t      = window.ZENIO_T || (k => k);
    const lang   = (window.ZENIO_LANG && window.ZENIO_LANG()) || 'fr';
    const tagLabel = p.tag ? (p.tag === 'Nouveau' || p.tag === 'New' ? t('tag_new') : t('tag_promo')) : '';
    const imgEl  = p.imageUrl
      ? `<img src="${p.imageUrl}" alt="${p.name}" loading="lazy">`
      : `<div class="product-img-placeholder">${p.emoji}</div>`;

    return `
      <div class="product-card" onclick="window.location='produit.html?id=${p.id}'">
        <div class="product-img-wrap">
          ${imgEl}
          ${tagLabel ? `<span class="product-tag">${tagLabel}</span>` : ''}
          <button class="product-wishlist" onclick="event.stopPropagation();showToast('${t('wishlist_done')}')">♡</button>
        </div>
        <div class="product-info">
          <div class="product-category">${p.cat}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-desc-short">${p.desc}</div>
          <div class="product-footer">
            <div class="product-price">
              ${p.oldPrice ? `<span class="old-price">${p.oldPrice.toFixed(2).replace('.',',')} €</span>` : ''}
              ${p.price.toFixed(2).replace('.',',')} €
            </div>
            <button class="add-btn" onclick="event.stopPropagation();addToCart(${p.id})" data-i18n-inner="add_to_cart">
              ${t('add_to_cart')}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /* ── Render product grid + pagination ── */
  function renderProducts() {
    const t        = window.ZENIO_T || (k => k);
    const products = getFilteredProducts();
    const total    = products.length;
    const start    = (currentPage - 1) * ITEMS_PER_PAGE;
    const page     = products.slice(start, start + ITEMS_PER_PAGE);

    const countEl = document.getElementById('pageCount');
    if (countEl) countEl.textContent = t('products_count', total);

    const grid = document.getElementById('productsGrid');
    grid.className = 'products-grid' + (viewMode === 'list' ? ' list-view' : '');

    if (page.length === 0) {
      grid.innerHTML = `
        <div class="no-results" style="grid-column:1/-1">
          <div class="no-results-icon">🔍</div>
          <p style="font-size:14px">${t('no_results')}</p>
        </div>`;
    } else {
      grid.innerHTML = page.map(productCardHTML).join('');
    }

    // Pagination
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const pgEl = document.getElementById('pagination');
    if (pgEl) {
      if (totalPages <= 1) { pgEl.innerHTML = ''; return; }
      let btns = '';
      if (currentPage > 1) btns += `<button class="page-btn" onclick="goPage(${currentPage-1})">‹</button>`;
      for (let i = 1; i <= totalPages; i++) {
        btns += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
      }
      if (currentPage < totalPages) btns += `<button class="page-btn" onclick="goPage(${currentPage+1})">›</button>`;
      pgEl.innerHTML = btns;
    }
  }

  /* ── Public helpers used by inline onclick ── */
  window.applyFilters = function () { currentPage = 1; renderProducts(); renderActiveFilters(); };
  window.clearFilters = function () {
    document.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = false);
    const pi = document.getElementById('priceMin'); if(pi) pi.value = '';
    const pa = document.getElementById('priceMax'); if(pa) pa.value = '';
    const sb = document.getElementById('searchBar');if(sb) sb.value = '';
    applyFilters();
  };
  window.goPage = function (p) { currentPage = p; renderProducts(); window.scrollTo({top:0,behavior:'smooth'}); };
  window.setView = function (v) {
    viewMode = v;
    document.getElementById('gridBtn')?.classList.toggle('active', v === 'grid');
    document.getElementById('listBtn')?.classList.toggle('active', v === 'list');
    renderProducts();
  };

  /* ── Active filter tags ── */
  function renderActiveFilters() {
    const el   = document.getElementById('activeFilters');
    if (!el) return;
    const tags = [];
    document.querySelectorAll('input[name="cat"]:checked').forEach(i => {
      const label = i.nextElementSibling?.textContent || i.value;
      tags.push(`<span class="active-filter-tag">${label} <button onclick="uncheckFilter('cat','${i.value}')">✕</button></span>`);
    });
    el.innerHTML = tags.join('');
  }
  window.uncheckFilter = function (name, value) {
    const el = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (el) { el.checked = false; applyFilters(); }
  };

  /* ── Init catalogue ── */
  async function initCatalogue() {
    // Apply URL category param
    if (catParam) {
      const cb = document.querySelector(`input[name="cat"][value="${catParam}"]`);
      if (cb) cb.checked = true;
      const titles = {
        'maison-connectee':'Maison Connectée','eclairage':'Éclairage',
        'bureau':'Bureau','bien-etre':'Bien-être',
        'cuisine':'Cuisine Tech','nouveautes':'Nouveautés'
      };
      if (titles[catParam]) {
        const pt = document.getElementById('pageTitle');
        const bc = document.getElementById('breadcrumbCat');
        if (pt) pt.textContent = titles[catParam];
        if (bc) bc.textContent = titles[catParam];
      }
      if (catParam === 'nouveautes') {
        const nb = document.querySelector('input[name="dispo"][value="nouveau"]');
        if (nb) nb.checked = true;
      }
    }

    showSkeleton();

    try {
      ALL_PRODUCTS = await fetchProducts();
    } catch(e) {
      console.error('[Zenio] fetchProducts error:', e);
      ALL_PRODUCTS = window.ALL_PRODUCTS_DEMO || [];
    }

    renderProducts();
    updateCartUI();

    // Re-render on language change
    document.addEventListener('zenio:langchange', () => renderProducts());
  }

  initCatalogue();
}


/* ── 5. Cart ─────────────────────────────────────────────── */
let cart = JSON.parse(localStorage.getItem('zenio_cart') || '[]');

function saveCart()  { localStorage.setItem('zenio_cart', JSON.stringify(cart)); }

window.addToCart = function (productId) {
  const source   = window.ALL_PRODUCTS_DEMO || [];
  const allProds = (window.ALL_PRODUCTS && window.ALL_PRODUCTS.length) ? window.ALL_PRODUCTS : source;
  const p        = allProds.find(x => x.id === productId);
  if (!p) return;
  const existing = cart.find(x => x.id === productId);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  saveCart();
  updateCartUI();
  const t = window.ZENIO_T || (k => k);
  showToast(p.name + ' ' + t('added_to_cart'));
};

window.removeFromCart = function (id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
  updateCartUI();
};

window.changeQty = function (id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); updateCartUI(); }
};

function updateCartUI() {
  const t      = window.ZENIO_T || (k => k);
  const total  = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const count  = cart.reduce((s,i) => s + i.qty, 0);
  const badge  = document.getElementById('cartBadge');
  if (badge) { badge.textContent = count; badge.style.display = count > 0 ? 'flex' : 'none'; }

  const itemsEl  = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const totalEl  = document.getElementById('cartTotal');
  const titleEl  = document.getElementById('cartTitleLabel');
  if (titleEl) titleEl.textContent = t('cart_title');

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>${t('cart_empty')}</p></div>`;
    if (footerEl) footerEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}">` : item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.price.toFixed(2).replace('.',',')} €</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">${t('remove')}</button>
          </div>
        </div>
      </div>
    `).join('');
    const subtotalLabel = document.getElementById('subtotalLabel');
    if (subtotalLabel) subtotalLabel.textContent = t('subtotal');
    if (totalEl)  totalEl.textContent  = total.toFixed(2).replace('.',',') + ' €';
    if (footerEl) footerEl.style.display = 'block';
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.textContent = t('checkout');
  }
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

/* ── 6. Global re-render on lang change ──────────────────── */
document.addEventListener('zenio:langchange', () => updateCartUI());

/* ── 7. Lang toggle button wiring ───────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('langToggle');
  if (btn) btn.addEventListener('click', () => window.ZENIO_TOGGLE_LANG && window.ZENIO_TOGGLE_LANG());
  updateCartUI();
});
