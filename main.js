import { SITE_CONFIG } from "./site.config.js";

const installerUrl = typeof SITE_CONFIG.installerUrl === "string" ? SITE_CONFIG.installerUrl.trim() : "";
const dialog = document.querySelector("#installer-modal");
let lastFocusedElement = null;

// ==========================================
// PRICING SWITCHER (MONTHLY vs FLEXIBLE)
// ==========================================
const btnMonthly = document.querySelector("#btn-monthly");
const btnFlexible = document.querySelector("#btn-flexible");
const deckMonthly = document.querySelector("#pricing-monthly");
const deckFlexible = document.querySelector("#pricing-flexible");

function switchPricing(mode) {
  if (mode === "monthly") {
    btnMonthly?.classList.add("active");
    btnFlexible?.classList.remove("active");
    deckMonthly?.classList.remove("is-hidden");
    deckFlexible?.classList.add("is-hidden");
  } else {
    btnFlexible?.classList.add("active");
    btnMonthly?.classList.remove("active");
    deckFlexible?.classList.remove("is-hidden");
    deckMonthly?.classList.add("is-hidden");
  }
}

btnMonthly?.addEventListener("click", () => switchPricing("monthly"));
btnFlexible?.addEventListener("click", () => switchPricing("flexible"));

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
const mobileToggle = document.querySelector("#mobile-toggle");
const navMenu = document.querySelector("#nav-menu");

mobileToggle?.addEventListener("click", () => {
  const isOpen = navMenu?.classList.toggle("is-open");
  mobileToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu?.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("is-open");
    mobileToggle?.setAttribute("aria-expanded", "false");
  });
});

// ==========================================
// INSTALLER / DOWNLOAD MODAL
// ==========================================
function closeInstallerDialog() {
  if (!dialog) return;
  if (typeof dialog.close === "function" && dialog.open) {
    dialog.close();
    return;
  }
  dialog.removeAttribute("open");
  dialog.hidden = true;
  document.body.classList.remove("has-open-dialog");
  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

function openInstallerDialog() {
  if (!dialog) return;
  lastFocusedElement = document.activeElement;
  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.hidden = false;
    dialog.setAttribute("open", "");
    document.body.classList.add("has-open-dialog");
  }
  dialog.querySelector("[data-modal-close]")?.focus();
}

function handleDownload() {
  if (installerUrl && installerUrl !== "#") {
    window.open(installerUrl, "_blank", "noopener,noreferrer");
    return;
  }
  openInstallerDialog();
}

document.querySelectorAll("[data-download]").forEach((button) => {
  button.addEventListener("click", handleDownload);
});

document.querySelector("[data-modal-close]")?.addEventListener("click", closeInstallerDialog);

dialog?.addEventListener("close", () => {
  document.body.classList.remove("has-open-dialog");
});

dialog?.addEventListener("cancel", () => {
  document.body.classList.remove("has-open-dialog");
});

// ==========================================
// AUTO YEAR
// ==========================================
document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});
