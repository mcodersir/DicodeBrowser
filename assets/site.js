(() => {
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");
  const savedTheme = localStorage.getItem("dicode-site-theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

  function setTheme(theme, persist) {
    root.dataset.theme = theme;
    toggle.setAttribute("aria-pressed", String(theme === "light"));
    toggle.setAttribute("aria-label", theme === "light" ? "تغییر به تم تیره" : "تغییر به تم روشن");
    document.querySelector('meta[name="theme-color"]').content = theme === "light" ? "#f7f4ee" : "#0c1113";
    if (persist) localStorage.setItem("dicode-site-theme", theme);
  }

  setTheme(savedTheme || (prefersLight ? "light" : "dark"), false);
  toggle.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark", true));
})();
