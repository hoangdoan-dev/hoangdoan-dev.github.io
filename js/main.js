/* ==========================================================================
   DHCODE — main.js
   Loading sequence, intro animation, particle backgrounds, header behavior,
   search, category filter, pagination, product rendering, carousel.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initLoadingSequence();
  initBackgroundParticles();
  initHeaderScroll();
  initExploreDropdown();
  initSearch();
  initCategoryChips();
  renderTrendingCarousel();
  initFloatContact();

  state.filtered = filterProducts();
  renderProductGrid();
});

/* ==========================================================================
   Shared state
   ========================================================================== */
const state = {
  activeCategory: "all",
  searchTerm: "",
  currentPage: 1,
  perPage: 8,
  filtered: [],
};

/* ==========================================================================
   1. Loading screen -> Intro animation -> Main site
   ========================================================================== */
function initLoadingSequence() {
  const loadingScreen = document.getElementById("loading-screen");
  const introScreen = document.getElementById("intro-screen");

  drawParticleCanvas(document.getElementById("loading-particles"), { density: 70, speed: 0.3 });

  // Loading screen visible for ~2.4s, then fade out
  setTimeout(() => {
    loadingScreen.classList.add("fade-out");
    introScreen.classList.add("show");

    // Intro visible for ~2.2s, then fade to main site
    setTimeout(() => {
      introScreen.classList.add("fade-out");
      setTimeout(() => {
        loadingScreen.remove();
        introScreen.remove();
      }, 650);
    }, 2200);
  }, 2400);
}

/* ==========================================================================
   2. Canvas particle backgrounds
   ========================================================================== */
function drawParticleCanvas(canvas, { density = 50, speed = 0.4, color = "255,255,255" } = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = canvas.offsetWidth || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: density }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      alpha: Math.random() * 0.5 + 0.2,
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${p.alpha})`;
      ctx.fill();
    });
    animationId = requestAnimationFrame(tick);
  }

  resize();
  createParticles();
  tick();

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });

  // Stop animating once canvas is removed from DOM (loading/intro screens)
  const observer = new MutationObserver(() => {
    if (!document.body.contains(canvas)) {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function initBackgroundParticles() {
  const canvas = document.getElementById("bg-particles");
  canvas.width = window.innerWidth;
  canvas.height = document.documentElement.scrollHeight;
  drawParticleCanvas(canvas, { density: 60, speed: 0.15, color: "148,163,184" });

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  });
}

/* ==========================================================================
   3. Header scroll + explore dropdown
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById("site-header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  });
}

function initExploreDropdown() {
  const btn = document.getElementById("explore-btn");
  const panel = document.getElementById("dropdown-panel");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    btn.classList.toggle("active");
    panel.classList.toggle("open");
  });

  panel.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      const category = item.dataset.category;
      panel.classList.remove("open");
      btn.classList.remove("active");

      if (category === "trending") {
        document.querySelector(".trending-section").scrollIntoView({ behavior: "smooth" });
        return;
      }
      setActiveCategory(category);
      document.getElementById("products-section").scrollIntoView({ behavior: "smooth" });
    });
  });

  document.addEventListener("click", () => {
    panel.classList.remove("open");
    btn.classList.remove("active");
  });
}

/* ==========================================================================
   4. Realtime search (header + hero) with suggestions
   ========================================================================== */
function initSearch() {
  wireSearchInput(document.getElementById("header-search-input"), document.getElementById("search-suggestions"));
  wireSearchInput(document.getElementById("hero-search-input"), document.getElementById("hero-search-suggestions"));
}

function wireSearchInput(input, suggestionsEl) {
  input.addEventListener("input", () => {
    const term = input.value.trim().toLowerCase();
    state.searchTerm = term;

    if (!term) {
      suggestionsEl.classList.remove("open");
      state.currentPage = 1;
      state.filtered = filterProducts();
      renderProductGrid();
      return;
    }

    const matches = PRODUCTS.filter((p) =>
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    ).slice(0, 6);

    suggestionsEl.innerHTML = matches.length
      ? matches.map((p) => `
          <button class="suggestion-item" data-id="${p.id}">
            <i class="fa-solid ${p.icon}"></i> ${p.title}
            <small>${CATEGORIES.find((c) => c.key === p.category)?.label || ""}</small>
          </button>
        `).join("")
      : `<div class="suggestion-empty">Không có kết quả cho "${escapeHtml(input.value)}"</div>`;

    suggestionsEl.classList.add("open");

    suggestionsEl.querySelectorAll(".suggestion-item").forEach((el) => {
      el.addEventListener("click", () => {
        openProductModal(Number(el.dataset.id));
        suggestionsEl.classList.remove("open");
      });
    });

    state.currentPage = 1;
    state.filtered = filterProducts();
    renderProductGrid();
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target)) suggestionsEl.classList.remove("open");
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ==========================================================================
   5. Category chips + filtering
   ========================================================================== */
function initCategoryChips() {
  const wrap = document.getElementById("category-chips");
  wrap.innerHTML = CATEGORIES.map((c) => `
    <button class="chip ${c.key === "all" ? "active" : ""}" data-category="${c.key}">
      <i class="fa-solid ${c.icon}"></i> ${c.label}
    </button>
  `).join("");

  wrap.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => setActiveCategory(chip.dataset.category));
  });
}

function setActiveCategory(category) {
  state.activeCategory = category;
  state.currentPage = 1;
  document.querySelectorAll("#category-chips .chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.category === category);
  });
  state.filtered = filterProducts();
  renderProductGrid();
}

function filterProducts() {
  return PRODUCTS.filter((p) => {
    const matchesCategory = state.activeCategory === "all" || p.category === state.activeCategory;
    const matchesSearch =
      !state.searchTerm ||
      p.title.toLowerCase().includes(state.searchTerm) ||
      p.description.toLowerCase().includes(state.searchTerm);
    return matchesCategory && matchesSearch;
  });
}

/* ==========================================================================
   6. Product grid rendering + pagination
   ========================================================================== */
function renderProductGrid() {
  const grid = document.getElementById("product-grid");
  const emptyState = document.getElementById("empty-state");
  const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.perPage));
  state.currentPage = Math.min(state.currentPage, totalPages);

  const start = (state.currentPage - 1) * state.perPage;
  const pageItems = state.filtered.slice(start, start + state.perPage);

  emptyState.hidden = pageItems.length !== 0;
  grid.hidden = pageItems.length === 0;

  grid.innerHTML = pageItems.map((p, i) => productCardTemplate(p, i)).join("");

  grid.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => openProductModal(Number(card.dataset.id)));
  });

  renderPagination(totalPages);
}

function productCardTemplate(p, index) {
  const stars = Array.from({ length: 5 }, (_, i) =>
    `<i class="fa-${i < p.rating ? "solid" : "regular"} fa-star"></i>`
  ).join("");

  return `
    <div class="product-card reveal-up" data-id="${p.id}" style="animation-delay:${index * 60}ms">
      <div class="card-inner">
        <div class="card-preview ${p.gradient}"><i class="fa-solid ${p.icon}"></i></div>
        <div class="card-body">
          <span class="card-category">${CATEGORIES.find((c) => c.key === p.category)?.label || p.category}</span>
          <h3 class="card-title">${p.title}</h3>
          <p class="card-desc">${p.description}</p>
          <div class="card-footer">
            <span class="card-price">${p.price}</span>
            <span class="card-rating">${stars}</span>
          </div>
          <div class="card-view-btn">Xem chi tiết</div>
        </div>
      </div>
    </div>
  `;
}

function renderPagination(totalPages) {
  const el = document.getElementById("pagination");
  if (totalPages <= 1) {
    el.innerHTML = "";
    return;
  }

  let html = `<button class="page-btn" id="page-prev" ${state.currentPage === 1 ? "disabled" : ""}><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === state.currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
  }
  html += `<button class="page-btn" id="page-next" ${state.currentPage === totalPages ? "disabled" : ""}><i class="fa-solid fa-chevron-right"></i></button>`;

  el.innerHTML = html;

  el.querySelectorAll("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => goToPage(Number(btn.dataset.page)));
  });
  const prevBtn = document.getElementById("page-prev");
  const nextBtn = document.getElementById("page-next");
  if (prevBtn) prevBtn.addEventListener("click", () => goToPage(state.currentPage - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goToPage(state.currentPage + 1));
}

function goToPage(page) {
  state.currentPage = page;
  renderProductGrid();
  document.getElementById("products-section").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ==========================================================================
   7. Trending carousel
   ========================================================================== */
function renderTrendingCarousel() {
  const track = document.getElementById("carousel-track");
  const dotsWrap = document.getElementById("carousel-dots");
  const items = TRENDING_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

  const perSlide = 3;
  const slides = [];
  for (let i = 0; i < items.length; i += perSlide) {
    slides.push(items.slice(i, i + perSlide));
  }

  track.innerHTML = slides.map((slide) => `
    <div class="carousel-slide">
      ${slide.map((p) => productCardTemplate(p, 0)).join("")}
    </div>
  `).join("");

  track.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => openProductModal(Number(card.dataset.id)));
  });

  dotsWrap.innerHTML = slides.map((_, i) => `<button class="carousel-dot ${i === 0 ? "active" : ""}" data-slide="${i}"></button>`).join("");

  let current = 0;
  const totalSlides = slides.length;

  function goTo(index) {
    current = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll(".carousel-dot").forEach((d, i) => d.classList.toggle("active", i === current));
  }

  document.getElementById("carousel-prev").addEventListener("click", () => { goTo(current - 1); resetAutoplay(); });
  document.getElementById("carousel-next").addEventListener("click", () => { goTo(current + 1); resetAutoplay(); });
  dotsWrap.querySelectorAll(".carousel-dot").forEach((dot) => {
    dot.addEventListener("click", () => { goTo(Number(dot.dataset.slide)); resetAutoplay(); });
  });

  let autoplayId = setInterval(() => goTo(current + 1), 4500);
  function resetAutoplay() {
    clearInterval(autoplayId);
    autoplayId = setInterval(() => goTo(current + 1), 4500);
  }
}

/* ==========================================================================
   8. Floating contact button
   ========================================================================== */
function initFloatContact() {
  const avatar = document.getElementById("float-avatar");
  const menu = document.getElementById("float-menu");

  avatar.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && e.target !== avatar) menu.classList.remove("open");
  });
}
