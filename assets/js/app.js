/**
 * TINYSTEPS - Interactive Toddler & Educational Toy Showcase
 * Cheerful Pastel & Mindful Playroom Edition
 * Master dataset loaded from assets/js/products.js
 */

// App State
let currentCategory = "all";
let searchQuery = "";

// DOM Elements
const productsContainer = document.getElementById("productsGrid");
const productCountEl = document.getElementById("productCount");
const searchInput = document.getElementById("searchInput");
const categoryTabs = document.querySelectorAll(".category-tab");
const modalOverlay = document.getElementById("quickViewModal");
const toastNotice = document.getElementById("toastNotice");

// Helper: Escape HTML strings safely
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Helper: Safe image fallback
function handleImgFallback(img) {
  img.onerror = null;
  img.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22400%22%20viewBox%3D%220%200%20400%20400%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23FFFDF9%22%20rx%3D%2224%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22160%22%20r%3D%2245%22%20fill%3D%22%23FFE0E6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%22260%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20font-weight%3D%22700%22%20fill%3D%22%232D3142%22%20text-anchor%3D%22middle%22%3ETinySteps%20Curated%3C%2Ftext%3E%3C%2Fsvg%3E";
}

// Helper: Cheerful Golden Star SVG Rating
function renderStarRating(rating, count) {
  const safeCount = count ? count.toLocaleString() : "500+";
  return `
    <div class="product-rating">
      <div class="star-icons">
        <svg class="star-icon" viewBox="0 0 24 24" fill="#FFB703"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <svg class="star-icon" viewBox="0 0 24 24" fill="#FFB703"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <svg class="star-icon" viewBox="0 0 24 24" fill="#FFB703"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <svg class="star-icon" viewBox="0 0 24 24" fill="#FFB703"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <svg class="star-icon" viewBox="0 0 24 24" fill="#FFB703"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </div>
      <span class="rating-num" style="font-weight: 700; color: #2D3142;">${rating}</span>
      <span class="reviews-count" style="color: #6B7280; font-size: 12px;">(${safeCount} reviews)</span>
    </div>
  `;
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupEventListeners();
});

// Category Filter Shortcut
function filterByCategory(category) {
  currentCategory = category;
  categoryTabs.forEach((t) => {
    if (t.dataset.category === category) {
      t.classList.add("active");
    } else {
      t.classList.remove("active");
    }
  });
  renderProducts();
  const targetSection = document.getElementById("curators-picks");
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Event Listeners
function setupEventListeners() {
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      categoryTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentCategory = tab.dataset.category;
      renderProducts();
    });
  });

  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

// Filter Logic
function getFilteredProducts() {
  if (typeof PRODUCTS === "undefined") return [];
  return PRODUCTS.filter((p) => {
    const matchesCategory = currentCategory === "all" || p.category === currentCategory;
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      (p.badge && p.badge.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });
}

// Category Badge Color Palette
function getCategoryBadgeStyle(cat) {
  switch (cat) {
    case "montessori":
      return "background: #E8F5E9; color: #2E7D32; border: 1px solid #C8E6C9;";
    case "stem":
      return "background: #E1F5FE; color: #0288D1; border: 1px solid #B3E5FC;";
    case "sensory":
      return "background: #F3E5F5; color: #7B1FA2; border: 1px solid #E1BEE7;";
    case "pretend":
      return "background: #FFF8E1; color: #F57F17; border: 1px solid #FFECB3;";
    default:
      return "background: #FFF5F2; color: #FF6B81; border: 1px solid #FFE0D9;";
  }
}

// Render Products Grid
function renderProducts() {
  if (!productsContainer) return;
  const filtered = getFilteredProducts();

  if (productCountEl) {
    productCountEl.innerHTML = ` ${filtered.length} cheerful toys ready to play`;
  }

  if (filtered.length === 0) {
    productsContainer.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 20px; border: 1px dashed rgba(255,107,129,0.3);">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: #FFF0F2; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #FF6B81;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <h3 style="font-size: 20px; margin-bottom: 8px; color: #2D3142;">No toys found</h3>
        <p style="color: #6B7280; font-size: 14px;">Try searching for friendly terms like "wooden", "blocks", or "sensory".</p>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = filtered
    .map((product) => {
      const catStyle = getCategoryBadgeStyle(product.category);
      return `
      <article class="product-card" id="card-${product.id}">
        <div class="product-image-wrap" onclick="openQuickView('${product.id}')" title="Click to view details">
          ${product.badge ? `<span class="product-pill ${product.isViral ? 'viral' : ''}">${escapeHtml(product.badge)}</span>` : ""}
          <span class="product-age-pill">${escapeHtml(product.ageGroup || "Ages 1-3")}</span>
          <button class="btn-pin-overlay" title="Save to Pinterest" onclick="saveToPinterest('${product.id}', event)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
            </svg>
          </button>
          <img 
            src="${product.image}" 
            alt="${escapeHtml(product.title)}" 
            class="product-img" 
            loading="lazy" 
            onerror="handleImgFallback(this)"
          />
        </div>

        <div class="product-details">
          <div class="product-meta-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="product-category-meta" style="${catStyle} font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 8px;">${escapeHtml(product.categoryLabel)}</span>
            <span class="product-price" style="font-weight: 800; font-size: 16px; color: #FF6B81;">${escapeHtml(product.price)}</span>
          </div>

          <h3 class="product-title" onclick="openQuickView('${product.id}')" title="${escapeHtml(product.title)}">
            ${escapeHtml(product.title)}
          </h3>

          ${renderStarRating(product.rating, product.reviews)}

          <p class="product-desc" onclick="openQuickView('${product.id}')">
            ${escapeHtml(product.description)}
          </p>

          <div class="product-footer">
            <a href="${product.affiliateUrl}" target="_blank" rel="noopener sponsored" class="btn-affiliate-shop" onclick="event.stopPropagation()">
              <span>Check on Amazon</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
            <button class="btn-quick-view" title="Quick View" onclick="openQuickView('${product.id}')" aria-label="Quick View ${escapeHtml(product.title)}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>
      </article>
    `;
    })
    .join("");
}

// Pinterest Save Function
function saveToPinterest(productId, event) {
  if (event) event.stopPropagation();

  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const currentUrl = window.location.href.split("#")[0];
  const pinUrl = encodeURIComponent(`${currentUrl}#card-${product.id}`);
  
  const imgUrl = product.image.startsWith("http") 
    ? encodeURIComponent(product.image) 
    : encodeURIComponent(new URL(product.image, window.location.href).href);

  const pinDesc = encodeURIComponent(
    `Montessori & Sensory Toy Find: ${product.title}. Tap the link to view tested reviews and details on TinySteps.`
  );

  const pinterestShareUrl = `https://www.pinterest.com/pin/create/button/?url=${pinUrl}&media=${imgUrl}&description=${pinDesc}`;

  const popupWidth = 700;
  const popupHeight = 600;
  const left = window.screen.width / 2 - popupWidth / 2;
  const top = window.screen.height / 2 - popupHeight / 2;

  window.open(
    pinterestShareUrl,
    "PinIt",
    `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
}

// Quick View Modal
function openQuickView(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product || !modalOverlay) return;

  const catStyle = getCategoryBadgeStyle(product.category);
  const modalContent = document.getElementById("modalContent");
  if (modalContent) {
    const bulletsHtml = (product.bullets || [])
      .map((b) => `<li style="margin-bottom: 6px;">${escapeHtml(b)}</li>`)
      .join("");

    modalContent.innerHTML = `
      <div class="modal-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 28px; padding: 10px;">
        <div class="modal-gallery" style="background: #FFFDF9; border-radius: 16px; padding: 24px; display: flex; align-items: center; justify-content: center;">
          <img src="${product.image}" alt="${escapeHtml(product.title)}" class="modal-main-img" style="max-height: 320px; width: auto; max-width: 100%; object-fit: contain;" onerror="handleImgFallback(this)"/>
        </div>
        <div class="modal-info">
          <div class="modal-badge-row" style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px; flex-wrap: wrap;">
            ${product.badge ? `<span class="card-badge" style="background: #FFF0F2; color: #E53E3E; border: 1px solid #FED7D7; font-weight: 800; font-size: 11px; padding: 3px 10px; border-radius: 9999px;">${escapeHtml(product.badge)}</span>` : ""}
            <span class="card-age-tag" style="background: #EBF8FF; color: #2B6CB0; border: 1px solid #BEE3F8; font-weight: 700; font-size: 11px; padding: 3px 10px; border-radius: 9999px;">${escapeHtml(product.ageGroup || "Ages 1-3")}</span>
            <span style="${catStyle} font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 8px;">${escapeHtml(product.categoryLabel)}</span>
          </div>

          <h2 class="modal-title" style="font-size: 22px; font-weight: 800; color: #2D3142; line-height: 1.35; margin-bottom: 12px;">${escapeHtml(product.title)}</h2>
          
          <div class="modal-price-rating" style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
            <span class="modal-price" style="font-size: 24px; font-weight: 900; color: #FF6B81;">${escapeHtml(product.price)}</span>
            ${renderStarRating(product.rating, product.reviews)}
          </div>

          <p class="modal-desc" style="font-size: 14.5px; color: #5C677D; line-height: 1.6; margin-bottom: 20px;">${escapeHtml(product.description)}</p>

          <div class="modal-benefits" style="background: #FFF8F5; border-radius: 12px; padding: 16px; border: 1px solid rgba(255,107,129,0.15); margin-bottom: 20px;">
            <h4 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #FF6B81; margin-bottom: 10px;">Child Development Highlights</h4>
            <ul style="padding-left: 18px; font-size: 13px; color: #5C677D; line-height: 1.6;">
              ${bulletsHtml}
            </ul>
          </div>

          <div class="modal-actions">
            <a href="${product.affiliateUrl}" target="_blank" rel="noopener sponsored" class="btn-amazon-cta modal-cta" style="width: 100%; justify-content: center; padding: 14px 20px; font-size: 15px; font-weight: 800; border-radius: 9999px; background: linear-gradient(135deg, #FF6B81 0%, #FFA07A 100%); box-shadow: 0 6px 18px rgba(255, 107, 129, 0.35); text-decoration: none; color: white; display: flex; align-items: center; gap: 8px;">
              <span>Check on Amazon</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
            <div style="font-size: 11px; color: #94A3B8; text-align: center; margin-top: 10px;">
              As an Amazon Associate, TinySteps earns from qualifying purchases at zero added cost to you.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// Toast Notice
function showToast(message) {
  if (!toastNotice) return;
  toastNotice.textContent = message;
  toastNotice.classList.add("show");
  setTimeout(() => {
    toastNotice.classList.remove("show");
  }, 2500);
}
