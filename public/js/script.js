document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Hamburger Menu Toggle
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
        
        // Close menu when clicking a link
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
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

    console.log("PulseX UI/UX SaaS Elements Fully Orchestrated");
});