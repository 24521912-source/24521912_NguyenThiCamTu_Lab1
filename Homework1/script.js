
"use strict";

/* =====================================================
   HOMEWORK 1 - TASK T-03
   Accessible Dark Mode Toggle & Theme Persistence

   - Vanilla JavaScript ES6+
   - No external dependencies
   - No inline event handlers
   - No innerHTML
   ===================================================== */

(() => {
  const STORAGE_KEY = "theme";
  const DARK_THEME = "dark";
  const LIGHT_THEME = "light";

  const themeButton = document.querySelector("#theme-toggle");
  const documentRoot = document.documentElement;

  if (!themeButton) {
    console.warn("Theme toggle button was not found.");
    return;
  }

  /* ---------------------------------------------------
     01. READ SAVED THEME
     --------------------------------------------------- */

  function getSavedTheme() {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);

      if (
        savedTheme === DARK_THEME ||
        savedTheme === LIGHT_THEME
      ) {
        return savedTheme;
      }
    } catch {
      // Storage may be blocked by browser settings.
      // The application must continue working.
    }

    return null;
  }

  /* ---------------------------------------------------
     02. READ SYSTEM PREFERENCE
     --------------------------------------------------- */

  function getSystemTheme() {
    if (typeof window.matchMedia !== "function") {
      return LIGHT_THEME;
    }

    try {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      return prefersDark ? DARK_THEME : LIGHT_THEME;
    } catch {
      return LIGHT_THEME;
    }
  }

  /* ---------------------------------------------------
     03. RESOLVE INITIAL THEME
     --------------------------------------------------- */

  function getInitialTheme() {
    const savedTheme = getSavedTheme();

    if (savedTheme !== null) {
      return savedTheme;
    }

    return getSystemTheme();
  }

  /* ---------------------------------------------------
     04. APPLY THEME
     --------------------------------------------------- */

  function applyTheme(theme) {
    const isDark = theme === DARK_THEME;

    documentRoot.classList.toggle(
      "dark-theme",
      isDark
    );

    documentRoot.style.colorScheme =
      isDark ? DARK_THEME : LIGHT_THEME;

    themeButton.setAttribute(
      "aria-pressed",
      String(isDark)
    );

    themeButton.setAttribute(
      "aria-label",
      isDark
        ? "Switch to light mode"
        : "Switch to dark mode"
    );

    themeButton.textContent =
      isDark ? "Light Mode" : "Dark Mode";
  }

  /* ---------------------------------------------------
     05. SAVE THEME SAFELY
     --------------------------------------------------- */

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Continue without persistence if storage fails.
    }
  }

  /* ---------------------------------------------------
     06. HANDLE THEME TOGGLE
     --------------------------------------------------- */

  function handleThemeToggle() {
    const isDark = documentRoot.classList.contains(
      "dark-theme"
    );

    const nextTheme = isDark
      ? LIGHT_THEME
      : DARK_THEME;

    applyTheme(nextTheme);
    saveTheme(nextTheme);
  }

  /* ---------------------------------------------------
     07. INITIALIZATION
     --------------------------------------------------- */

  function initializeTheme() {
    const initialTheme = getInitialTheme();

    applyTheme(initialTheme);

    themeButton.addEventListener(
      "click",
      handleThemeToggle
    );
  }

  initializeTheme();
})();
