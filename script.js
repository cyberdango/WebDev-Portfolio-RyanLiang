
console.log("Section framework loaded.");


const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const header = document.querySelector(".site-header");

if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });
}


document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        const target = targetId ? document.querySelector(targetId) : null;

        if (target) {
            event.preventDefault();
            const headerOffset = header ? header.offsetHeight + 12 : 0;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({
                top: targetTop,
                behavior: "smooth"
            });
            navLinks?.classList.remove("open");
            navToggle?.setAttribute("aria-expanded", "false");
        }
    });
});


const sectionIds = ["home", "about", "interests", "images", "videos", "projects", "contact"];
const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((section) => section !== null);
const navItems = document.querySelectorAll(".nav-link");

function updateActiveNav() {
    let activeId = "home";
    const headerOffset = header ? header.offsetHeight + 28 : 120;

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= headerOffset && rect.bottom > headerOffset) {
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
