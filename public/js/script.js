document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Hamburger Menu Toggle
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isActive = navLinks.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
        });
        
        // Close menu when clicking a link
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // 2. Dynamic Sticky Navbar Scroll Styling
    const navbarContainer = document.querySelector(".navbar-container");
    if (navbarContainer) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 40) {
                navbarContainer.classList.add("scrolled");
            } else {
                navbarContainer.classList.remove("scrolled");
            }
        });
    }

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Animated Statistics Counters
    const animateCounters = () => {
        const stats = document.querySelectorAll(".stat-number");
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute("data-target"), 10);
            const format = stat.getAttribute("data-format");
            const duration = 2000; // 2 seconds animation time
            const startTime = performance.now();
            
            const updateCount = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Quadratic easeOut easing function
                const easeProgress = progress * (2 - progress);
                const currentVal = Math.floor(easeProgress * target);
                
                if (format === "k") {
                    stat.textContent = (currentVal / 1000).toFixed(0) + "K+";
                } else if (format === "m") {
                    stat.textContent = (currentVal / 1000000).toFixed(1) + "M+";
                } else {
                    stat.textContent = currentVal.toLocaleString() + "+";
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    // Force final exact display
                    if (format === "k") {
                        stat.textContent = (target / 1000).toFixed(0) + "K+";
                    } else if (format === "m") {
                        stat.textContent = (target / 1000000).toFixed(1) + "M+";
                    } else {
                        stat.textContent = target.toLocaleString() + "+";
                    }
                }
            };
            
            requestAnimationFrame(updateCount);
        });
    };

    // Trigger statistics counter when scrolled into view
    const statsSection = document.querySelector(".hero-stats-section");
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                statsObserver.unobserve(statsSection);
            }
        }, {
            threshold: 0.2
        });
        statsObserver.observe(statsSection);
    }

    // 5. Auth / Login Modal Interactivity
    const loginModal = document.getElementById("loginModal");
    const closeLoginModal = document.getElementById("closeLoginModal");
    const signinLinks = document.querySelectorAll(".nav-link-signin");

    const openModal = (e) => {
        if (e) e.preventDefault();
        if (loginModal) {
            loginModal.classList.add("active");
            loginModal.setAttribute("aria-hidden", "false");
            const firstInput = loginModal.querySelector("input");
            if (firstInput) firstInput.focus();
        }
    };

    const closeModal = () => {
        if (loginModal) {
            loginModal.classList.remove("active");
            loginModal.setAttribute("aria-hidden", "true");
        }
    };

    signinLinks.forEach(link => {
        link.addEventListener("click", openModal);
    });

    if (closeLoginModal) {
        closeLoginModal.addEventListener("click", closeModal);
    }

    if (loginModal) {
        loginModal.addEventListener("click", (e) => {
            if (e.target === loginModal) {
                closeModal();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && loginModal && loginModal.classList.contains("active")) {
            closeModal();
        }
    });

    // Role Pill Selection inside Modal
    const rolePills = document.querySelectorAll("#modalRoleSelector .role-pill");
    rolePills.forEach(pill => {
        pill.addEventListener("click", () => {
            rolePills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
        });
    });

    // Modal Form Submission Simulation
    const modalForm = document.getElementById("modalLoginForm");
    if (modalForm) {
        modalForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const alertBox = document.getElementById("modalAuthAlert");
            const submitBtn = document.getElementById("modalSubmitBtn");

            submitBtn.innerHTML = "<span>Authenticating...</span>";
            submitBtn.disabled = true;

            setTimeout(() => {
                if (alertBox) {
                    alertBox.className = "auth-alert alert-success";
                    alertBox.style.display = "block";
                    alertBox.innerHTML = "✓ Logged in successfully! Redirecting...";
                }
                setTimeout(() => {
                    closeModal();
                    submitBtn.innerHTML = '<span>Log In to Account</span><svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
                    submitBtn.disabled = false;
                    if (alertBox) alertBox.style.display = "none";
                }, 1200);
            }, 800);
        });
    }

    console.log("PulseX UI/UX SaaS Elements & Login Modal Orchestrated");
});