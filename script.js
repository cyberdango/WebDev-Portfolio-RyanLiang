// Basic framework startup log
console.log("Section framework loaded.");

// Mobile navigation toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        const target = targetId ? document.querySelector(targetId) : null;

        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            navLinks?.classList.remove("open");
            navToggle?.setAttribute("aria-expanded", "false");
        }
    });
});

// Active navigation highlight by scroll position
const sectionIds = ["home", "about", "interests", "gallery", "videos", "projects"];
const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((section) => section !== null);
const navItems = document.querySelectorAll(".nav-link");

function updateActiveNav() {
    let activeId = "home";

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom > 120) {
            activeId = section.id;
        }
    });

    navItems.forEach((item) => {
        const target = item.getAttribute("href");
        item.classList.toggle("active", target === `#${activeId}`);
    });
}

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("load", updateActiveNav);

// Lightweight reveal effect
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    revealElements.forEach((el) => observer.observe(el));
} else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
}
