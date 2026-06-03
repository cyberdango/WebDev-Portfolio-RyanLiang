// Mobile navigation toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const header = document.querySelector(".site-header");

// Intro animation: show the button after the spaceship flight, then enter the website
const introScreen = document.getElementById("intro-screen");
const introFlight = document.querySelector(".css-ship-wrap");
const introEnter = document.getElementById("intro-enter");

if (introScreen && introEnter) {
    let introClosed = false;

    function showIntroEnterButton() {
        introScreen.classList.add("ready");
        introEnter.disabled = false;
        introEnter.focus();
    }

    function enterWebsite() {
        if (introClosed) {
            return;
        }

        introClosed = true;
        introScreen.classList.add("is-hidden");
        introScreen.setAttribute("aria-hidden", "true");
        document.body.classList.remove("intro-active");

        introScreen.addEventListener("transitionend", () => {
            introScreen.remove();
        }, { once: true });
    }

    if (introFlight) {
        introFlight.addEventListener("animationend", showIntroEnterButton, { once: true });
    }

    // Fallback in case the animation event does not fire.
    window.setTimeout(() => {
        if (!introScreen.classList.contains("ready")) {
            showIntroEnterButton();
        }
    }, 4000);

    introEnter.addEventListener("click", enterWebsite);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && introScreen.classList.contains("ready")) {
            enterWebsite();
        }
    });
}

if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

// Smooth scrolling and mobile menu closing
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        const targetSection = targetId ? document.querySelector(targetId) : null;

        if (targetSection) {
            event.preventDefault();

            const headerOffset = header ? header.offsetHeight + 12 : 0;
            const targetTop = targetSection.getBoundingClientRect().top + window.scrollY - headerOffset;

            window.scrollTo({
                top: targetTop,
                behavior: "smooth"
            });

            window.setTimeout(updateActiveNav, 250);

            if (navLinks && navToggle) {
                navLinks.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        }
    });
});

// Active navigation highlight
const sectionIds = ["home", "about", "images", "video", "contact"];
const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((section) => section !== null);
const navItems = document.querySelectorAll(".nav-link");

function updateActiveNav() {
    let activeId = "home";
    const checkPoint = header ? header.offsetHeight + 40 : 120;
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 8;

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= checkPoint && rect.bottom > checkPoint) {
            activeId = section.id;
        }
    });

    if (nearBottom) {
        activeId = "contact";
    }

    navItems.forEach((item) => {
        const target = item.getAttribute("href");
        item.classList.toggle("active", target === `#${activeId}`);
    });
}

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("load", updateActiveNav);

// Reveal panels when they enter the screen
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
        { threshold: 0.16 }
    );

    revealElements.forEach((element) => observer.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
}

// Show real images/videos only after the files load
document.querySelectorAll(".image-frame img").forEach((image) => {
    image.addEventListener("load", () => {
        image.parentElement.classList.add("is-loaded");
    });
});

document.querySelectorAll(".video-frame video").forEach((video) => {
    video.addEventListener("loadeddata", () => {
        video.parentElement.classList.add("is-loaded");
    });
});

// Image lightbox for the Images section
const lightbox = document.getElementById("image-lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");
const imageGalleryImages = document.querySelectorAll("#images img");

function openLightbox(image) {
    if (!lightbox || !lightboxImage || !lightboxClose) {
        return;
    }

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    lightboxClose.focus();
}

function closeLightbox() {
    if (!lightbox || !lightboxImage) {
        return;
    }

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
}

imageGalleryImages.forEach((image) => {
    image.setAttribute("tabindex", "0");

    image.addEventListener("click", () => {
        openLightbox(image);
    });

    image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openLightbox(image);
        }
    });
});

if (lightbox && lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox && lightbox.classList.contains("open")) {
        closeLightbox();
    }
});

// Show More toggle for extra About section details
const showMoreButton = document.getElementById("show-more-button");
const aboutExtraContent = document.getElementById("about-extra-content");

if (showMoreButton && aboutExtraContent) {
    showMoreButton.addEventListener("click", () => {
        const isOpen = aboutExtraContent.classList.toggle("open");

        showMoreButton.textContent = isOpen ? "Show Less" : "Show More";
        showMoreButton.setAttribute("aria-expanded", String(isOpen));
    });
}

// Contact form validation
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (name === "" || email === "" || message === "") {
            formMessage.textContent = "Please fill in your name, email, and message.";
            formMessage.style.color = "#ffb3d6";
            return;
        }

        formMessage.textContent = "Thank you. Your message is ready to send.";
        formMessage.style.color = "#67f3ff";
        contactForm.reset();
    });
}
