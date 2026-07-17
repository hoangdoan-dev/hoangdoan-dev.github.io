/* ==========================================================================
   DHCODE — modal.js
   Generic modal open/close + product detail modal rendering.
   ========================================================================== */

const ModalController = (() => {
  let lastFocused = null;

  function open(overlayEl) {
    if (!overlayEl) return;
    lastFocused = document.activeElement;
    overlayEl.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close(overlayEl) {
    if (!overlayEl) return;
    overlayEl.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  function closeAll() {
    document.querySelectorAll(".modal-overlay.open").forEach((el) => close(el));
  }

  return { open, close, closeAll };
})();

/* --------------------------------------------------------------------
   Product detail modal
   -------------------------------------------------------------------- */
const productModalOverlay = document.getElementById("product-modal-overlay");

function openProductModal(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const preview = document.getElementById("modal-preview");
  preview.className = `product-modal-preview ${product.gradient}`;
  preview.innerHTML = `<i class="fa-solid ${product.icon}"></i>`;

  document.getElementById("modal-category").textContent =
    CATEGORIES.find((c) => c.key === product.category)?.label || product.category;
  document.getElementById("modal-title").textContent = product.title;
  document.getElementById("modal-description").textContent = product.description;
  document.getElementById("modal-author").textContent = product.author;
  document.getElementById("modal-price").textContent = product.price;

  const starsHtml = Array.from({ length: 5 }, (_, i) =>
    `<i class="fa-${i < product.rating ? "solid" : "regular"} fa-star"></i>`
  ).join(" ");
  document.getElementById("modal-rating").innerHTML = starsHtml;

  document.getElementById("modal-demo-btn").href = product.demo;
  document.getElementById("modal-download-btn").href = product.download;

  ModalController.open(productModalOverlay);
}

/* --------------------------------------------------------------------
   Wire up close buttons + overlay click + Escape key
   -------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) ModalController.close(overlay);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const overlay = btn.closest(".modal-overlay");
      ModalController.close(overlay);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") ModalController.closeAll();
  });

  /* Login / Register modal */
  const authOverlay = document.getElementById("auth-modal-overlay");
  document.getElementById("login-btn").addEventListener("click", () => ModalController.open(authOverlay));

  const authTabs = document.querySelectorAll(".auth-tab");
  const authSubmitBtn = document.getElementById("auth-submit-btn");
  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      authTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      authSubmitBtn.textContent = tab.dataset.tab === "login" ? "Đăng nhập" : "Tạo tài khoản";
    });
  });
  document.getElementById("auth-form").addEventListener("submit", (e) => {
    e.preventDefault();
    ModalController.close(authOverlay);
  });

  /* Upload modal */
  const uploadOverlay = document.getElementById("upload-modal-overlay");
  document.getElementById("upload-btn").addEventListener("click", () => ModalController.open(uploadOverlay));
  document.getElementById("upload-form").addEventListener("submit", (e) => {
    e.preventDefault();
    ModalController.close(uploadOverlay);
  });

  /* Donate modal */
  const donateOverlay = document.getElementById("donate-modal-overlay");
  document.getElementById("support-btn").addEventListener("click", () => ModalController.open(donateOverlay));

  /* Contact button inside product modal -> open float contact menu */
  document.getElementById("modal-contact-btn").addEventListener("click", () => {
    ModalController.close(productModalOverlay);
    document.getElementById("float-menu").classList.add("open");
  });
});
