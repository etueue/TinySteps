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

// Helper: Cheerful Golden Star SVG Rating
function renderStarRating(rating, count) {
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
      <span class="reviews-count" style="color: #6B7280; font-size: 12.5px;">(${count.toLocaleString()} happy reviews)</span>
    </div>
  `;
}

// Fallback image generator: Cheerful Pastel Toy Graphic
function getFallbackSvg(title) {
  const cleanTitle = title.replace(/[<>"'&]/g, '').slice(0, 26);
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23FFF5F2"/><stop offset="100%" stop-color="%23EBF8FF"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)" rx="24"/><circle cx="160" cy="170" r="34" fill="%23FFD166"/><rect x="195" y="145" width="60" height="60" rx="12" fill="%234EA8DE"/><path d="M140 230 L260 230 L200 175 Z" fill="%2306D6A0"/><circle cx="200" cy="115" r="16" fill="%23FF6B81"/><text x="50%" y="300" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="15" font-weight="700" fill="%232D3142" text-anchor="middle">${cleanTitle}</text><text x="50%" y="325" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="12" font-weight="600" fill="%23FF6B81" text-anchor="middle">TinySteps Toddler Collection</text></svg>`;
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
    case 'montessori':
      return 'background: #E8F5E9; color: #2E7D32; border: 1px solid #C8E6C9;';
    case 'stem':
      return 'background: #E1F5FE; color: #0288D1; border: 1px solid #B3E5FC;';
    case 'sensory':
      return 'background: #F3E5F5; color: #7B1FA2; border: 1px solid #E1BEE7;';
    case 'pretend':
      return 'background: #FFF8E1; color: #F57F17; border: 1px solid #FFECB3;';
    default:
      return 'background: #FFF5F2; color: #FF6B81; border: 1px solid #FFE0D9;';
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
        <div style="width: 56px; height: 56px; border-radius: 50%; background: #FFF0F2; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #FF6B81;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
        <h3 style="font-size: 20px; margin-bottom: 8px; color: #2D3142;">No toys found</h3>
        <p style="color: #6B7280; font-size: 14px;">Try searching for friendly terms like "wooden", "blocks", or "sensory".</p>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = filtered
    .map((product) => {
      const fallback = getFallbackSvg(product.title);
      const catStyle = getCategoryBadgeStyle(product.category);
      return `
      <article class="product-card" data-id="${product.id}" style="border-radius: 20px; overflow: hidden; background: white; border: 1.5px solid rgba(255, 107, 129, 0.12); box-shadow: 0 4px 18px rgba(255, 107, 129, 0.05); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
        <div class="card-media" style="position: relative; height: 230px; background: #FFFDF9; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 16px;">
          ${product.badge ? `<span class="card-badge" style="position: absolute; top: 12px; left: 12px; background: #FFF0F2; color: #E53E3E; border: 1px solid #FED7D7; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.02em; z-index: 2;">${product.badge}</span>` : ""}
          <span class="card-age-tag" style="position: absolute; top: 12px; right: 12px; background: #EBF8FF; color: #2B6CB0; border: 1px solid #BEE3F8; font-weight: 700; font-size: 11px; padding: 4px 10px; border-radius: 9999px; z-index: 2;">${product.ageGroup || "All Ages"}</span>
          <img 
            src="${product.image}" 
            alt="${product.title}" 
            class="card-img" 
            loading="lazy" 
            style="max-height: 100%; max-width: 100%; object-fit: contain; transition: transform 0.3s ease;"
            onerror="this.onerror=null; this.src='${fallback}';"
          />
          <button class="btn-quick-view" onclick="openQuickView('${product.id}')" aria-label="Quick preview ${product.title}" style="border-radius: 9999px; background: rgba(255,255,255,0.95); color: #2D3142; border: 1px solid rgba(0,0,0,0.08); font-weight: 700;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>Quick Peek</span>
          </button>
        </div>

        <div class="card-body" style="padding: 20px;">
          <div class="card-meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span class="card-category" style="${catStyle} font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: 8px;">${product.categoryLabel}</span>
            <span class="card-price" style="font-weight: 800; font-size: 17px; color: #FF6B81;">${product.price}</span>
          </div>

          <h3 class="card-title" style="font-size: 16px; font-weight: 700; line-height: 1.4; margin-bottom: 10px;">
            <a href="${product.affiliateUrl}" target="_blank" rel="sponsored noopener" style="color: #2D3142; text-decoration: none;">${product.title}</a>
          </h3>

          ${renderStarRating(product.rating, product.reviews)}

          <p class="card-snippet" style="font-size: 13px; color: #5C677D; line-height: 1.55; margin: 12px 0 16px;">${product.description.slice(0, 105)}...</p>

          <div class="card-actions">
            <a href="${product.affiliateUrl}" target="_blank" rel="sponsored noopener" class="btn-amazon-cta" onclick="showToast('Taking you to Amazon Prime...')" style="background: linear-gradient(135deg, #FF6B81 0%, #FFA07A 100%); color: white; border-radius: 9999px; padding: 11px 18px; font-size: 13.5px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; box-shadow: 0 4px 14px rgba(255, 107, 129, 0.3);">
              <span>Check on Amazon</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
        </div>
      </article>
    `;
    })
    .join("");
}

// Quick View Modal
function openQuickView(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product || !modalOverlay) return;

  const fallback = getFallbackSvg(product.title);
  const catStyle = getCategoryBadgeStyle(product.category);
  const modalContent = document.getElementById("modalContent");
  if (modalContent) {
    modalContent.innerHTML = `
      <div class="modal-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 28px; padding: 10px;">
        <div class="modal-gallery" style="background: #FFFDF9; border-radius: 16px; padding: 24px; display: flex; align-items: center; justify-content: center;">
          <img src="${product.image}" alt="${product.title}" class="modal-main-img" style="max-height: 320px; width: auto; max-width: 100%; object-fit: contain;" onerror="this.onerror=null; this.src='${fallback}';"/>
        </div>
        <div class="modal-info">
          <div class="modal-badge-row" style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px; flex-wrap: wrap;">
            <span class="card-badge" style="background: #FFF0F2; color: #E53E3E; border: 1px solid #FED7D7; font-weight: 800; font-size: 11px; padding: 3px 10px; border-radius: 9999px;">${product.badge || 'Curated'}</span>
            <span class="card-age-tag" style="background: #EBF8FF; color: #2B6CB0; border: 1px solid #BEE3F8; font-weight: 700; font-size: 11px; padding: 3px 10px; border-radius: 9999px;">${product.ageGroup}</span>
            <span style="${catStyle} font-size: 11px; font-weight:700; padding: 3px 10px; border-radius: 8px;">${product.categoryLabel}</span>
          </div>

          <h2 class="modal-title" style="font-size: 22px; font-weight: 800; color: #2D3142; line-height: 1.35; margin-bottom: 12px;">${product.title}</h2>
          
          <div class="modal-price-rating" style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
            <span class="modal-price" style="font-size: 24px; font-weight: 900; color: #FF6B81;">${product.price}</span>
            ${renderStarRating(product.rating, product.reviews)}
          </div>

          <p class="modal-desc" style="font-size: 14.5px; color: #5C677D; line-height: 1.6; margin-bottom: 20px;">${product.description}</p>

          <div class="modal-benefits" style="background: #FFF8F5; border-radius: 12px; padding: 16px; border: 1px solid rgba(255,107,129,0.15); margin-bottom: 20px;">
            <h4 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #FF6B81; margin-bottom: 10px;">Child Development Highlights</h4>
            <ul style="padding-left: 18px; font-size: 13px; color: #5C677D; line-height: 1.6;">
              ${product.bullets.map(b => `<li style="margin-bottom: 6px;">${b}</li>`).join('')}
            </ul>
          </div>

          <div class="modal-actions">
            <a href="${product.affiliateUrl}" target="_blank" rel="sponsored noopener" class="btn-amazon-cta modal-cta" style="width: 100%; justify-content: center; padding: 14px 20px; font-size: 15px; font-weight: 800; border-radius: 9999px; background: linear-gradient(135deg, #FF6B81 0%, #FFA07A 100%); box-shadow: 0 6px 18px rgba(255, 107, 129, 0.35); text-decoration: none; color: white; display: flex; align-items: center; gap: 8px;">
              <span>View Price & Availability on Amazon</span>
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
