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
     * 6. Flip Card Mobile Support
     * Enables touch-to-flip on mobile devices
     */
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', function() {
            // Toggle focus to trigger the CSS hover/focus-within state
            if (document.activeElement === this) {
                document.activeElement.blur();
            } else {
                this.focus();
            }
        });
    });

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
            const message = link.getAttribute('data-message') || 'Hola! Quisiera más información.';
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
});
