// ===== DOM Elements =====
const preloader = document.getElementById("preloader");
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const backToTop = document.getElementById("backToTop");
const filterBtns = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const testimonialTrack = document.getElementById("testimonialTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const sliderDots = document.getElementById("sliderDots");
const contactForm = document.getElementById("contactForm");

// ===== Preloader =====
window.addEventListener("load", () => {
  setTimeout(() => {
    preloader.classList.add("hidden");
  }, 1000);
});

// ===== Navbar Scroll Effect =====
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  lastScrollY = currentScrollY;

  // Back to top button visibility
  if (currentScrollY > 500) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }

  // Update active nav link based on scroll position
  updateActiveNavLink();
});

// ===== Mobile Navigation =====
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
  document.body.style.overflow = navLinks.classList.contains("active")
    ? "hidden"
    : "";
});

// Close mobile menu when clicking a link
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
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 150;
    const sectionId = section.getAttribute("id");
    const navLink = document.querySelector(
      `.nav-links a[href="#${sectionId}"]`
    );

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks
        .querySelectorAll("a")
        .forEach((link) => link.classList.remove("active"));
      if (navLink) navLink.classList.add("active");
    }
  });
}

// ===== Back to Top =====
backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ===== Counter Animation =====
const observerOptions = {
  threshold: 0.5,
  rootMargin: "0px",
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll(".stat-number");
      counters.forEach((counter) => {
        animateCounter(counter);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe hero stats
const heroStats = document.querySelector(".hero-stats");
if (heroStats) counterObserver.observe(heroStats);

// Observe stats section
const statsSection = document.querySelector(".stats-grid");
if (statsSection) counterObserver.observe(statsSection);

function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-count"));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += step;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
}

// ===== Product Filters =====
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active button
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    productCards.forEach((card) => {
      const category = card.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        card.style.display = "block";
        card.style.animation = "fadeInUp 0.5s ease forwards";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// ===== Testimonials Slider =====
let currentSlide = 0;
let testimonialCards = document.querySelectorAll(".testimonial-card");
let totalSlides = testimonialCards.length;
let slidesToShow = getSlidesToShow();

function getSlidesToShow() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function initSliderDots() {
  sliderDots.innerHTML = "";
  const dotsCount = Math.ceil(totalSlides - slidesToShow + 1);

  for (let i = 0; i < dotsCount; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    sliderDots.appendChild(dot);
  }
}

function updateSlider() {
  const cardWidth = testimonialCards[0].offsetWidth + 30; // Including gap
  testimonialTrack.style.transform = `translateX(-${
    currentSlide * cardWidth
  }px)`;

  // Update dots
  const dots = sliderDots.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = index;
  updateSlider();
}

function nextSlide() {
  const maxSlide = totalSlides - slidesToShow;
  currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
  updateSlider();
}

function prevSlide() {
  const maxSlide = totalSlides - slidesToShow;
  currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
  updateSlider();
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);
}

// Auto slide
let autoSlideInterval = setInterval(nextSlide, 5000);

// Pause on hover
if (testimonialTrack) {
  testimonialTrack.addEventListener("mouseenter", () => {
    clearInterval(autoSlideInterval);
  });

  testimonialTrack.addEventListener("mouseleave", () => {
    autoSlideInterval = setInterval(nextSlide, 5000);
  });
}

// Recalculate on resize
window.addEventListener("resize", () => {
  slidesToShow = getSlidesToShow();
  currentSlide = 0;
  initSliderDots();
  updateSlider();
});

// Initialize slider
if (testimonialTrack) {
  initSliderDots();
}

// ===== Contact Form =====
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Simple validation
    const requiredFields = ["name", "email", "subject", "message"];
    let isValid = true;

    requiredFields.forEach((field) => {
      const input = contactForm.querySelector(`[name="${field}"]`);
      if (!data[field] || data[field].trim() === "") {
        input.style.borderColor = "#ef4444";
        isValid = false;
      } else {
        input.style.borderColor = "";
      }
    });

    if (isValid) {
      // Simulate form submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background =
          "linear-gradient(135deg, #10b981 0%, #059669 100%)";

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
          contactForm.reset();
        }, 3000);
      }, 2000);
    }
  });
}

// ===== Smooth Reveal Animations =====
const revealElements = document.querySelectorAll(
  ".product-card, .stat-card, .feature, .contact-item"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }
);

revealElements.forEach((element) => {
  element.style.opacity = "0";
  element.style.transform = "translateY(30px)";
  element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  revealObserver.observe(element);
});

// ===== Parallax Effect for Hero =====
const heroSection = document.querySelector(".hero");
const shapes = document.querySelectorAll(".shape");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  if (scrollY < window.innerHeight) {
    shapes.forEach((shape, index) => {
      const speed = 0.1 + index * 0.05;
      shape.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }
});

// ===== Hover Effects for Product Cards =====
productCards.forEach((card) => {
  card.addEventListener("mouseenter", (e) => {
    const icon = card.querySelector(".product-icon");
    icon.style.transform = "scale(1.1) rotate(5deg)";
  });

  card.addEventListener("mouseleave", (e) => {
    const icon = card.querySelector(".product-icon");
    icon.style.transform = "scale(1) rotate(0deg)";
  });
});

// ===== Newsletter Form =====
const newsletterForm = document.querySelector(".newsletter-form");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector("input");
    const button = newsletterForm.querySelector("button");

    if (input.value && input.value.includes("@")) {
      const originalIcon = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i>';
      button.style.background =
        "linear-gradient(135deg, #10b981 0%, #059669 100%)";

      setTimeout(() => {
        button.innerHTML = originalIcon;
        button.style.background = "";
        input.value = "";
      }, 3000);
    }
  });
}

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", () => {
  // Set initial active nav link
  updateActiveNavLink();

  // Add loading animation to images
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("load", () => {
      img.style.opacity = "1";
    });
  });
});

// ===== Keyboard Navigation =====
document.addEventListener("keydown", (e) => {
  // Close mobile menu on Escape
  if (e.key === "Escape" && navLinks.classList.contains("active")) {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Testimonial slider navigation with arrow keys
  if (
    e.key === "ArrowRight" &&
    document.activeElement.closest(".testimonials")
  ) {
    nextSlide();
  }
  if (
    e.key === "ArrowLeft" &&
    document.activeElement.closest(".testimonials")
  ) {
    prevSlide();
  }
});

// ===== Touch Swipe for Testimonials =====
let touchStartX = 0;
let touchEndX = 0;

if (testimonialTrack) {
  testimonialTrack.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  testimonialTrack.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
}

// ===== Performance Optimization: Debounce =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounced scroll handler for performance
const debouncedScrollHandler = debounce(() => {
  updateActiveNavLink();
}, 100);

window.addEventListener("scroll", debouncedScrollHandler);

console.log("Helmstone Pvt Ltd - Website Initialized Successfully");
console.log("© 2015-2025 Helmstone Pvt Ltd. All rights reserved.");
