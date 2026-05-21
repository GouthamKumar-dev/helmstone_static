// ===== DOM Elements =====
const preloader      = document.getElementById("preloader");
const navbar         = document.getElementById("navbar");
const hamburger      = document.getElementById("hamburger");
const navLinks       = document.getElementById("navLinks");
const backToTop      = document.getElementById("backToTop");
const testimonialTrack = document.getElementById("testimonialTrack");
const prevBtn        = document.getElementById("prevBtn");
const nextBtn        = document.getElementById("nextBtn");
const sliderDots     = document.getElementById("sliderDots");
const contactForm    = document.getElementById("contactForm");

// ===== Preloader =====
window.addEventListener("load", () => {
  setTimeout(() => {
    preloader.classList.add("hidden");
  }, 1400);
});

// ===== Navbar Scroll Effect =====
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  navbar.classList.toggle("scrolled", scrollY > 80);
  backToTop.classList.toggle("visible", scrollY > 500);

  updateActiveNavLink();
});

// ===== Mobile Navigation =====
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
  document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// ===== Active Navigation Link =====
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const top    = section.offsetTop - 160;
    const id     = section.getAttribute("id");
    const link   = navLinks.querySelector(`a[href="#${id}"]`);

    if (scrollY >= top && scrollY < top + section.offsetHeight) {
      navLinks.querySelectorAll("a").forEach((a) => a.classList.remove("active"));
      if (link) link.classList.add("active");
    }
  });
}

// ===== Back to Top =====
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Counter Animation =====
function animateCounter(el) {
  const target   = parseInt(el.getAttribute("data-count"));
  const duration = 2000;
  const step     = target / (duration / 16);
  let current    = 0;

  const tick = () => {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current);
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
    }
  };
  tick();
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat-number").forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

const heroStats  = document.querySelector(".hero-stats");
const statsGrid  = document.querySelector(".stats-grid");
if (heroStats) counterObserver.observe(heroStats);
if (statsGrid)  counterObserver.observe(statsGrid);

// ===== Testimonials Slider =====
let currentSlide = 0;
const cards      = document.querySelectorAll(".testimonial-card");
const total      = cards.length;

function slidesToShow() {
  if (window.innerWidth <= 768)  return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function buildDots() {
  if (!sliderDots) return;
  sliderDots.innerHTML = "";
  const count = Math.max(total - slidesToShow() + 1, 1);
  for (let i = 0; i < count; i++) {
    const d = document.createElement("span");
    d.classList.add("dot");
    if (i === 0) d.classList.add("active");
    d.addEventListener("click", () => goTo(i));
    sliderDots.appendChild(d);
  }
}

function updateSlider() {
  if (!testimonialTrack || !cards.length) return;
  const cardW = cards[0].offsetWidth + 28;
  testimonialTrack.style.transform = `translateX(-${currentSlide * cardW}px)`;
  document.querySelectorAll(".slider-dots .dot").forEach((d, i) => {
    d.classList.toggle("active", i === currentSlide);
  });
}

function goTo(idx) {
  currentSlide = idx;
  updateSlider();
}

function nextSlide() {
  const max = Math.max(total - slidesToShow(), 0);
  currentSlide = currentSlide >= max ? 0 : currentSlide + 1;
  updateSlider();
}

function prevSlide() {
  const max = Math.max(total - slidesToShow(), 0);
  currentSlide = currentSlide <= 0 ? max : currentSlide - 1;
  updateSlider();
}

if (prevBtn) prevBtn.addEventListener("click", prevSlide);
if (nextBtn) nextBtn.addEventListener("click", nextSlide);

let autoSlide = setInterval(nextSlide, 5000);

if (testimonialTrack) {
  testimonialTrack.addEventListener("mouseenter", () => clearInterval(autoSlide));
  testimonialTrack.addEventListener("mouseleave", () => {
    autoSlide = setInterval(nextSlide, 5000);
  });
}

window.addEventListener("resize", () => {
  currentSlide = 0;
  buildDots();
  updateSlider();
});

buildDots();

// ===== Contact Form =====
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data     = Object.fromEntries(new FormData(contactForm));
    const required = ["name", "email", "subject", "message"];
    let valid      = true;

    required.forEach((field) => {
      const el = contactForm.querySelector(`[name="${field}"]`);
      if (!data[field]?.trim()) {
        el.style.borderColor = "#EF4444";
        valid = false;
      } else {
        el.style.borderColor = "";
      }
    });

    if (!valid) return;

    const btn  = contactForm.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled  = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = "linear-gradient(135deg, #10B981, #059669)";

      setTimeout(() => {
        btn.innerHTML        = orig;
        btn.style.background = "";
        btn.disabled         = false;
        contactForm.reset();
      }, 3000);
    }, 2000);
  });
}

// ===== Scroll Reveal =====
const revealItems = document.querySelectorAll(
  ".feature-card, .stat-card, .pillar, .contact-item, .testimonial-card, .feezy-checklist li"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity    = "1";
          entry.target.style.transform  = "translateY(0)";
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
);

revealItems.forEach((el) => {
  el.style.opacity   = "0";
  el.style.transform = "translateY(24px)";
  el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
  revealObserver.observe(el);
});

// ===== Newsletter =====
const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input  = newsletterForm.querySelector("input");
    const button = newsletterForm.querySelector("button");

    if (input.value?.includes("@")) {
      const orig = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i>';
      button.style.background = "linear-gradient(135deg, #10B981, #059669)";

      setTimeout(() => {
        button.innerHTML        = orig;
        button.style.background = "";
        input.value             = "";
      }, 3000);
    }
  });
}

// ===== Keyboard Navigation =====
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLinks.classList.contains("active")) {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// ===== Touch Swipe =====
let touchStartX = 0;

if (testimonialTrack) {
  testimonialTrack.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  testimonialTrack.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
  }, { passive: true });
}

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", updateActiveNavLink);
