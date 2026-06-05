/**
 * NAXASNAILS - MAIN JAVASCRIPT
 * Vanilla JS Implementation for UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * 1. Mobile Menu Toggle
     * Handles opening and closing of the mobile navigation menu
     */
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav__link');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /**
     * 2. Sticky Header
     * Adds 'scrolled' class to header when scrolling past 80px
     */
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    /**
     * 3. Back to Top Button
     * Shows button after 300px scroll and scrolls to top smoothly
     */
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * 4. Scroll Reveal Animations (Intersection Observer)
     * Fades in elements as they enter the viewport
     */
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    /**
     * 5. Lightbox for Gallery
     * Opens images in a full-screen modal
     */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox__img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;

    if (galleryItems.length > 0 && lightbox && lightboxImg && lightboxClose) {
        
        const openLightbox = (imgSrc, imgAlt) => {
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgAlt;
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            setTimeout(() => { lightboxImg.src = ''; }, 300); // Clear image after transition
        };

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                // Use data-large if available, else standard src
                const largeSrc = img.getAttribute('data-large') || img.src;
                openLightbox(largeSrc, img.alt);
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        
        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    /**
     * 6. Flip Card Mobile Support and Interactive Marquee
     * Enables touch-to-flip on mobile devices and makes the marquee draggable by mouse and touch
     */
    let dragDistance = 0;
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // If the user was dragging the marquee, prevent card flip
            if (dragDistance > 8) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            // Toggle focus to trigger the CSS hover/focus-within state
            if (document.activeElement === this) {
                document.activeElement.blur();
            } else {
                this.focus();
            }
        });
    });

    const marquee = document.querySelector('.tecnicas__marquee');
    const track = document.querySelector('.tecnicas__marquee-track');
    
    if (marquee && track) {
        let isDown = false;
        let startX;
        let scrollLeftStart;
        let dragStartX = 0;
        let autoScrollSpeed = 0.7; // px per frame
        let isInteracting = false;
        let interactionTimeout = null;
        let animationFrameId = null;

        const getHalfWidth = () => {
            return track.scrollWidth / 2;
        };

        const startInteraction = () => {
            isInteracting = true;
            if (interactionTimeout) clearTimeout(interactionTimeout);
        };

        const endInteraction = () => {
            if (interactionTimeout) clearTimeout(interactionTimeout);
            interactionTimeout = setTimeout(() => {
                isInteracting = false;
            }, 2500); // Resume auto scroll after 2.5s of inactivity
        };

        // Prevent default image drag behavior
        marquee.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });

        // Mouse events for grabbing and dragging
        marquee.addEventListener('mousedown', (e) => {
            isDown = true;
            marquee.classList.add('is-dragging');
            startX = e.pageX - marquee.offsetLeft;
            scrollLeftStart = marquee.scrollLeft;
            dragStartX = e.pageX;
            dragDistance = 0;
            startInteraction();
        });

        marquee.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                marquee.classList.remove('is-dragging');
                endInteraction();
            }
        });

        marquee.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                marquee.classList.remove('is-dragging');
                endInteraction();
            }
        });

        marquee.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - marquee.offsetLeft;
            const walk = (x - startX) * 1.5; // Scroll speed multiplier
            marquee.scrollLeft = scrollLeftStart - walk;
            
            dragDistance = Math.abs(e.pageX - dragStartX);
            
            // Infinite looping scroll during drag
            const halfWidth = getHalfWidth();
            if (marquee.scrollLeft >= halfWidth) {
                marquee.scrollLeft -= halfWidth;
                scrollLeftStart -= halfWidth;
            } else if (marquee.scrollLeft <= 0) {
                marquee.scrollLeft += halfWidth;
                scrollLeftStart += halfWidth;
            }
        });

        // Touch events for mobile swiping
        marquee.addEventListener('touchstart', () => {
            dragDistance = 0;
            startInteraction();
        }, { passive: true });

        marquee.addEventListener('touchmove', () => {
            // Register interaction during touch scroll
            dragDistance = 9; // Mark as dragged so we don't trigger flip on tap end if they swiped
            startInteraction();
        }, { passive: true });

        marquee.addEventListener('touchend', () => {
            endInteraction();
            // Reset dragDistance after touch release (needs a short delay so the click event doesn't trigger)
            setTimeout(() => {
                dragDistance = 0;
            }, 50);
        }, { passive: true });

        // Auto-scroll loop
        const step = () => {
            if (!isDown && !isInteracting) {
                marquee.scrollLeft += autoScrollSpeed;
                
                const halfWidth = getHalfWidth();
                if (marquee.scrollLeft >= halfWidth) {
                    marquee.scrollLeft -= halfWidth;
                } else if (marquee.scrollLeft <= 0) {
                    marquee.scrollLeft += halfWidth;
                }
            }
            animationFrameId = requestAnimationFrame(step);
        };

        // Start auto-scroll
        animationFrameId = requestAnimationFrame(step);

        // Pause/resume when tab is backgrounded
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animationFrameId = requestAnimationFrame(step);
            }
        });
    }

    /**
     * 7. WhatsApp Helper Function
     * @param {string} phone - Phone number without '+'. Example: '56956721633'
     * @param {string} message - Message to pre-fill
     * @returns {string} Formatted WhatsApp URL
     */
    const buildWhatsAppURL = (phone, message) => {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${phone}?text=${encodedMessage}`;
    };

    /**
     * 8. WhatsApp Direct Links
     * Attach click events to elements with .js-whatsapp-link class
     */
    const phoneNumber = '56956721633'; // Target phone number
    const whatsappLinks = document.querySelectorAll('.js-whatsapp-link');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const message = link.getAttribute('data-message') || 'Hola! Quisiera mÃ¡s informaciÃ³n.';
            const url = buildWhatsAppURL(phoneNumber, message);
            window.open(url, '_blank', 'noopener,noreferrer');
        });
    });

    /**
     * 9. Contact Form Submit to WhatsApp
     * Gathers form data and redirects to WhatsApp
     */
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather form data
            const formData = new FormData(contactForm);
            const nombre = formData.get('nombre').trim();
            const servicio = formData.get('servicio');
            const mensaje = formData.get('mensaje').trim();
            
            // Construct the message
            let whatsappMessage = `Hola Naxasnails! Soy ${nombre}.\n`;
            whatsappMessage += `Me interesa el servicio de: *${servicio}*.\n`;
            
            if (mensaje) {
                whatsappMessage += `\nDetalles adicionales: ${mensaje}`;
            }
            
            // Generate URL and open
            const url = buildWhatsAppURL(phoneNumber, whatsappMessage);
            window.open(url, '_blank', 'noopener,noreferrer');
            
            // Optional: reset form
            contactForm.reset();
        });
    }

    // =========================================================================
    // 10. DARK MODE TOGGLE - Premium Emocional
    // Detecta preferencia del SO, guarda en localStorage, anima transicion suave
    // =========================================================================
    const htmlEl      = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    const applyTheme = (theme) => {
        htmlEl.setAttribute('data-theme', theme);
        if (themeToggle) {
            const isDark = theme === 'dark';
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute(
                'aria-label',
                isDark ? 'Activar modo claro' : 'Activar modo oscuro'
            );
        }
    };

    const getSavedTheme = () => {
        const saved = localStorage.getItem('naxasnails-theme');
        if (saved !== null) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : '';
    };

    applyTheme(getSavedTheme());

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('naxasnails-theme') === null) {
            applyTheme(e.matches ? 'dark' : '');
        }
    });

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? '' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('naxasnails-theme', newTheme);
        });
    }

    // =========================================================================
    // 11. BOTON "VOLVER ARRIBA" con ANILLO DE PROGRESO DE SCROLL
    // Usa requestAnimationFrame para maxima performance (sin layout thrashing).
    // Circunferencia del anillo r=25: 2 * PI * 25 aprox 157.08
    // =========================================================================
    const progressTrack = document.getElementById('progress-ring-track');

    if (progressTrack) {
        const RADIUS        = 25;
        const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

        progressTrack.style.strokeDasharray  = CIRCUMFERENCE;
        progressTrack.style.strokeDashoffset = CIRCUMFERENCE;

        let ticking = false;

        const updateProgressRing = () => {
            const scrollTop    = window.scrollY || document.documentElement.scrollTop;
            const docHeight    = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const scrollable   = docHeight - windowHeight;

            const progress = scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0;
            progressTrack.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgressRing);
                ticking = true;
            }
        }, { passive: true });

        updateProgressRing();
    }
});
