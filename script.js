const topbar = document.querySelector(".topbar");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const revealNodes = document.querySelectorAll(".reveal, .reveal-delay");
const counters = document.querySelectorAll("[data-counter]");

const closeMenu = () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 980px)").matches) {
      closeMenu();
    }
  });
});

window.addEventListener("scroll", () => {
  topbar.classList.toggle("scrolled", window.scrollY > 10);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

revealNodes.forEach((node) => revealObserver.observe(node));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const node = entry.target;
      const target = Number(node.dataset.counter || 0);
      const duration = 1300;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);

        if (target === 100) {
          node.textContent = `${value}%`;
        } else {
          node.textContent = `${value}+`;
        }

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(node);
    });
  },
  { threshold: 0.4 },
);

counters.forEach((counter) => counterObserver.observe(counter));

const sectionMap = navLinks
  .map((link) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return null;

    const section = document.querySelector(id);
    if (!section) return null;

    return { link, section };
  })
  .filter(Boolean);

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      sectionMap.forEach(({ link }) => link.classList.remove("active"));
      const active = sectionMap.find(({ section }) => section === entry.target);
      active?.link.classList.add("active");
    });
  },
  { threshold: 0.45 },
);

sectionMap.forEach(({ section }) => activeObserver.observe(section));

document.getElementById("year").textContent = String(new Date().getFullYear());
