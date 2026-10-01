(() => {
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("dicode-site-theme");
  } catch {
    // Keep the site usable when storage is blocked.
  }
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

  function setTheme(theme, persist) {
    root.dataset.theme = theme;
    toggle.setAttribute("aria-pressed", String(theme === "light"));
    toggle.setAttribute("aria-label", theme === "light" ? "تغییر به تم تیره" : "تغییر به تم روشن");
    document.querySelector('meta[name="theme-color"]').content = theme === "light" ? "#f5f6f9" : "#10131b";
    if (persist) {
      try {
        localStorage.setItem("dicode-site-theme", theme);
      } catch {
        // The selected theme still applies for this visit.
      }
    }
  }

  setTheme(savedTheme || (prefersLight ? "light" : "dark"), false);
  toggle.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark", true));

  const progress = document.querySelector(".scroll-progress > span");
  let scrollFrame = 0;
  const updateProgress = () => {
    scrollFrame = 0;
    const scrollable = root.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    root.style.setProperty("--scroll-progress", String(amount));
  };
  if (progress) {
    const scheduleProgress = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateProgress);
    };
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress, { passive: true });
    updateProgress();
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const targets = document.querySelectorAll("[data-reveal]");
    if (targets.length) {
      root.classList.add("motion-ready");
      const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -32px 0px" });

      targets.forEach((target) => {
        const siblingIndex = Array.from(target.parentElement.children).indexOf(target);
        target.style.setProperty("--reveal-delay", `${Math.min(siblingIndex, 5) * 65}ms`);
        observer.observe(target);
      });
    }
  }
})();
