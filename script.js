document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  initDarkMode();
  initCustomCursor();
  initTypingAnimation();
  initParallax();
  initRevealText();
  initScrollAnimations();
  initHamburgerMenu();
  initScrollSpy();
  initScrollProgress();
  initBackToTop();
});

/* ===== Dark Mode ===== */
function initDarkMode() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  const saved = localStorage.getItem("theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
  btn.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

/* ===== Custom Cursor ===== */
function initCustomCursor() {
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursorFollower");
  if (!cursor || !follower) return;
  if (!window.matchMedia("(hover: hover)").matches) return;

  let cx = 0, cy = 0, fx = 0, fy = 0;

  document.addEventListener("mousemove", (e) => {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.left = cx + "px";
    cursor.style.top = cy + "px";
  });

  function animate() {
    fx += (cx - fx) * 0.15;
    fy += (cy - fy) * 0.15;
    follower.style.left = fx + "px";
    follower.style.top = fy + "px";
    requestAnimationFrame(animate);
  }
  animate();

  const hovers = document.querySelectorAll("a, button, [data-hover]");
  hovers.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
      follower.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
      follower.classList.remove("hover");
    });
  });
}

/* ===== Typing Animation ===== */
function initTypingAnimation() {
  const el = document.getElementById("typingTarget");
  if (!el) return;
  const text = el.getAttribute("data-text") || "";
  el.textContent = "";
  const cursor = document.createElement("span");
  cursor.classList.add("typing-cursor");
  el.appendChild(cursor);

  let i = 0;
  function type() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      setTimeout(type, 80);
    } else {
      setTimeout(() => cursor.classList.add("done"), 600);
    }
  }
  setTimeout(type, 1000);
}

/* ===== Parallax ===== */
function initParallax() {
  const bg = document.querySelector(".hero-bg");
  if (!bg) return;
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        bg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ===== Text Reveal (word-by-word) ===== */
function initRevealText() {
  document.querySelectorAll(".reveal-text").forEach((el) => {
    const text = el.textContent.trim();
    el.textContent = "";
    text.split("").forEach((char, i) => {
      const word = document.createElement("span");
      word.classList.add("word");
      const inner = document.createElement("span");
      inner.classList.add("word-inner");
      inner.textContent = char === " " ? "\u00A0" : char;
      inner.style.transitionDelay = `${i * 0.04}s`;
      word.appendChild(inner);
      el.appendChild(word);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  document.querySelectorAll(".reveal-text").forEach((el) => observer.observe(el));
}

/* ===== Scroll Animations ===== */
function initScrollAnimations() {
  const targets = document.querySelectorAll(".fade-up");
  if (!targets.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  targets.forEach((el, i) => {
    el.style.setProperty("--stagger", `${i * 0.1}s`);
    observer.observe(el);
  });
}

/* ===== Hamburger Menu ===== */
function initHamburgerMenu() {
  const btn = document.getElementById("hamburger");
  const nav = document.getElementById("mainNav");
  const overlay = document.getElementById("menuOverlay");
  if (!btn || !nav || !overlay) return;

  function open() {
    btn.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
    nav.classList.add("open");
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function close() {
    btn.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
  }

  btn.addEventListener("click", () => btn.classList.contains("open") ? close() : open());
  overlay.addEventListener("click", close);
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && btn.classList.contains("open")) close();
  });
}

/* ===== Scroll Spy ===== */
function initScrollSpy() {
  const sections = document.querySelectorAll(".section[id]");
  const links = document.querySelectorAll(".nav a[href^='#']");
  if (!sections.length || !links.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
        }
      });
    },
    { rootMargin: "-30% 0px -70% 0px" }
  );
  sections.forEach((s) => observer.observe(s));
}

/* ===== Scroll Progress ===== */
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (window.scrollY / h) * 100 + "%" : "0%";
  }, { passive: true });
}

/* ===== Back to Top ===== */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
