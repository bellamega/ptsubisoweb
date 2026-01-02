// Mobile Menu Toggle
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const isClickInsideNav = navMenu.contains(event.target);
    const isClickOnToggle = mobileToggle.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu after clicking
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        }
    });
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    }
    
    lastScroll = currentScroll;
});

// Add transition to navbar
navbar.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

// Animate cards on scroll
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards with enhanced animation
document.querySelectorAll('.service-card, .machine-card, .feature-item, .feature-box, .reference-card, .faq-item, .vm-card, .service-item, .gallery-item').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    // Add staggered delay based on index
    setTimeout(() => {
        observer.observe(card);
    }, index * 50);
});

// Gallery lightbox functionality
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const imgSrc = this.querySelector('img').src;
        const caption = this.querySelector('.gallery-caption').textContent;
        
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${imgSrc}" alt="${caption}">
                <div class="lightbox-caption">${caption}</div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Animate lightbox
        setTimeout(() => {
            lightbox.style.opacity = '1';
            lightbox.querySelector('.lightbox-content').style.transform = 'scale(1)';
        }, 10);
        
        // Close lightbox
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        function closeLightbox() {
            lightbox.style.opacity = '0';
            lightbox.querySelector('.lightbox-content').style.transform = 'scale(0.8)';
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
            }, 300);
        }
        
        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.querySelector('.lightbox')) {
                closeLightbox();
            }
        });
    });
});

// Universal Slider Function for All Sections
function initUniversalSlider(sliderId, dotsId, sliderType) {
    const sliderContainer = document.getElementById(sliderId);
    const dotsContainer = document.getElementById(dotsId);
    const prevBtn = document.querySelector(`[data-slider="${sliderType}"].slider-prev`);
    const nextBtn = document.querySelector(`[data-slider="${sliderType}"].slider-next`);
    
    if (!sliderContainer) return;
    
    const items = sliderContainer.children;
    
    let currentIndex = 0;
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;
    
    // Create dots
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        Array.from(items).forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => scrollToIndex(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    // Update active dot
    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Scroll to specific index
    function scrollToIndex(index) {
        if (index < 0) index = 0;
        if (index >= items.length) index = items.length - 1;
        
        currentIndex = index;
        const item = items[index];
        
        sliderContainer.scrollTo({
            left: item.offsetLeft - 20,
            behavior: 'smooth'
        });
        
        updateDots();
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToIndex(currentIndex - 1);
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToIndex(currentIndex + 1);
        });
    }
    
    // Detect scroll and update current index
    let scrollTimeout;
    sliderContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollLeft = sliderContainer.scrollLeft;
            
            let closestIndex = 0;
            let closestDistance = Math.abs(items[0].offsetLeft - 20 - scrollLeft);
            
            Array.from(items).forEach((item, index) => {
                const distance = Math.abs(item.offsetLeft - 20 - scrollLeft);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });
            
            if (closestIndex !== currentIndex) {
                currentIndex = closestIndex;
                updateDots();
            }
        }, 150);
    });
    
    // Mouse drag
    sliderContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragging = false;
        sliderContainer.style.cursor = 'grabbing';
        sliderContainer.style.userSelect = 'none';
        startX = e.pageX - sliderContainer.offsetLeft;
        scrollLeft = sliderContainer.scrollLeft;
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        isDown = false;
        sliderContainer.style.cursor = 'grab';
    });
    
    sliderContainer.addEventListener('mouseup', () => {
        isDown = false;
        sliderContainer.style.cursor = 'grab';
        
        setTimeout(() => {
            if (isDragging) {
                snapToNearestCard();
            }
        }, 50);
    });
    
    sliderContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        isDragging = true;
        const x = e.pageX - sliderContainer.offsetLeft;
        const walk = (x - startX) * 2;
        sliderContainer.scrollLeft = scrollLeft - walk;
    });
    
    // Touch swipe
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;
    let touchScrollLeft = 0;
    let isTouchDragging = false;
    
    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchScrollLeft = sliderContainer.scrollLeft;
        touchStartTime = Date.now();
        isTouchDragging = false;
    }, { passive: true });
    
    sliderContainer.addEventListener('touchmove', (e) => {
        if (!touchStartX) return;
        
        const touchCurrentX = e.touches[0].clientX;
        const diff = touchStartX - touchCurrentX;
        
        if (Math.abs(diff) > 10) {
            isTouchDragging = true;
        }
        
        sliderContainer.scrollLeft = touchScrollLeft + diff;
    }, { passive: true });
    
    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const touchDuration = Date.now() - touchStartTime;
        const touchDistance = touchStartX - touchEndX;
        
        if (isTouchDragging) {
            snapToNearestCard();
        } else if (touchDuration < 300 && Math.abs(touchDistance) > 50) {
            handleSwipe();
        }
        
        touchStartX = 0;
        isTouchDragging = false;
    });
    
    function handleSwipe() {
        const swipeDistance = touchStartX - touchEndX;
        
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                scrollToIndex(currentIndex + 1);
            } else {
                scrollToIndex(currentIndex - 1);
            }
        }
    }
    
    function snapToNearestCard() {
        const scrollLeft = sliderContainer.scrollLeft;
        
        let closestIndex = 0;
        let closestDistance = Math.abs(items[0].offsetLeft - 20 - scrollLeft);
        
        Array.from(items).forEach((item, index) => {
            const distance = Math.abs(item.offsetLeft - 20 - scrollLeft);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });
        
        scrollToIndex(closestIndex);
    }
    
    // Initialize on mobile
    if (window.innerWidth <= 768) {
        createDots();
        sliderContainer.style.cursor = 'grab';
    }
    
    // Reinitialize on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth <= 768) {
                if (dotsContainer && dotsContainer.children.length === 0) {
                    createDots();
                }
                sliderContainer.style.cursor = 'grab';
            } else {
                if (dotsContainer) {
                    dotsContainer.innerHTML = '';
                }
                sliderContainer.style.cursor = 'default';
            }
        }, 250);
    });
}

// Initialize all sliders
initUniversalSlider('subisoSlider', 'subisoDots', 'subiso');
initUniversalSlider('servicesSlider', 'servicesDots', 'services');
initUniversalSlider('referenceSlider', 'referenceDots', 'reference');
initUniversalSlider('faqSlider', 'faqDots', 'faq');
initUniversalSlider('machineSlider', 'machineDots', 'machine');
initUniversalSlider('whyusSlider', 'whyusDots', 'whyus');

// Gallery Slider for Mobile
function initGallerySlider() {
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryDots = document.getElementById('galleryDots');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const items = document.querySelectorAll('.gallery-item');
    
    let currentIndex = 0;
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;
    
    // Create dots
    function createDots() {
        galleryDots.innerHTML = '';
        items.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'gallery-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => scrollToIndex(index));
            galleryDots.appendChild(dot);
        });
    }
    
    // Update active dot
    function updateDots() {
        const dots = document.querySelectorAll('.gallery-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Scroll to specific index - one card at a time with peek
    function scrollToIndex(index) {
        if (index < 0) index = 0;
        if (index >= items.length) index = items.length - 1;
        
        currentIndex = index;
        const item = items[index];
        
        // Calculate scroll position to show one card with a peek of next
        galleryGrid.scrollTo({
            left: item.offsetLeft - 20,
            behavior: 'smooth'
        });
        
        updateDots();
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToIndex(currentIndex - 1);
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToIndex(currentIndex + 1);
        });
    }
    
    // Detect scroll and update current index based on snap position
    let scrollTimeout;
    galleryGrid.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollLeft = galleryGrid.scrollLeft;
            
            // Find closest item to the left edge
            let closestIndex = 0;
            let closestDistance = Math.abs(items[0].offsetLeft - 20 - scrollLeft);
            
            items.forEach((item, index) => {
                const distance = Math.abs(item.offsetLeft - 20 - scrollLeft);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });
            
            if (closestIndex !== currentIndex) {
                currentIndex = closestIndex;
                updateDots();
            }
        }, 150);
    });
    
    // Mouse/Touch Drag to Scroll (Desktop & Mobile)
    galleryGrid.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragging = false;
        galleryGrid.style.cursor = 'grabbing';
        galleryGrid.style.userSelect = 'none';
        startX = e.pageX - galleryGrid.offsetLeft;
        scrollLeft = galleryGrid.scrollLeft;
    });
    
    galleryGrid.addEventListener('mouseleave', () => {
        isDown = false;
        galleryGrid.style.cursor = 'grab';
    });
    
    galleryGrid.addEventListener('mouseup', () => {
        isDown = false;
        galleryGrid.style.cursor = 'grab';
        
        // Snap to nearest card after drag
        setTimeout(() => {
            if (isDragging) {
                snapToNearestCard();
            }
        }, 50);
    });
    
    galleryGrid.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        isDragging = true;
        const x = e.pageX - galleryGrid.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        galleryGrid.scrollLeft = scrollLeft - walk;
    });
    
    // Touch swipe support - improved for tap and drag
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;
    let touchScrollLeft = 0;
    let isTouchDragging = false;
    
    galleryGrid.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchScrollLeft = galleryGrid.scrollLeft;
        touchStartTime = Date.now();
        isTouchDragging = false;
    }, { passive: true });
    
    galleryGrid.addEventListener('touchmove', (e) => {
        if (!touchStartX) return;
        
        const touchCurrentX = e.touches[0].clientX;
        const diff = touchStartX - touchCurrentX;
        
        // If moved more than 10px, it's a drag
        if (Math.abs(diff) > 10) {
            isTouchDragging = true;
        }
        
        // Manual scroll during drag
        galleryGrid.scrollLeft = touchScrollLeft + diff;
    }, { passive: true });
    
    galleryGrid.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const touchDuration = Date.now() - touchStartTime;
        const touchDistance = touchStartX - touchEndX;
        
        if (isTouchDragging) {
            // If it's a drag, snap to nearest card
            snapToNearestCard();
        } else if (touchDuration < 300 && Math.abs(touchDistance) > 50) {
            // Quick swipe - move one card
            handleSwipe();
        }
        
        touchStartX = 0;
        isTouchDragging = false;
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchStartX - touchEndX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe left - next card
                scrollToIndex(currentIndex + 1);
            } else {
                // Swipe right - previous card
                scrollToIndex(currentIndex - 1);
            }
        }
    }
    
    // Snap to nearest card after manual drag
    function snapToNearestCard() {
        const scrollLeft = galleryGrid.scrollLeft;
        
        let closestIndex = 0;
        let closestDistance = Math.abs(items[0].offsetLeft - 20 - scrollLeft);
        
        items.forEach((item, index) => {
            const distance = Math.abs(item.offsetLeft - 20 - scrollLeft);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });
        
        scrollToIndex(closestIndex);
    }
    
    // Set cursor style for desktop
    if (window.innerWidth <= 768) {
        galleryGrid.style.cursor = 'grab';
    }
    
    // Initialize dots on mobile
    if (window.innerWidth <= 768) {
        createDots();
    }
    
    // Reinitialize on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth <= 768) {
                if (galleryDots.children.length === 0) {
                    createDots();
                }
                galleryGrid.style.cursor = 'grab';
            } else {
                galleryDots.innerHTML = '';
                galleryGrid.style.cursor = 'default';
            }
        }, 250);
    });
}

// Initialize gallery slider
initGallerySlider();

// Add parallax effect to hero section (without moving the illustration)
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const decorativeSquares = document.querySelectorAll('.decorative-square');
    
    // Only animate decorative squares, not the illustration image
    decorativeSquares.forEach((square, index) => {
        if (scrolled < window.innerHeight) {
            square.style.transform = `rotate(${15 + scrolled * 0.05}deg) translateY(${scrolled * (0.2 + index * 0.1)}px)`;
        }
    });
});

// CTA Buttons functionality
const ctaButtons = document.querySelectorAll('.cta-button');

ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        const buttonText = this.textContent.trim();
        
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Handle different button actions
        if (buttonText.includes('WhatsApp')) {
            // Open WhatsApp (replace with your actual WhatsApp number)
            const phoneNumber = '6281234567890'; // Format: country code + number without +
            const message = encodeURIComponent('Halo, saya ingin konsultasi mengenai service mesin cetak');
            window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        } else if (buttonText.includes('Quotation')) {
            alert('Terima kasih! Silakan hubungi kami di:\n\nTelepon: +62 812-3456-7890\nEmail: info@printtechservice.com\n\nAtau isi form quotation yang akan kami kirimkan.');
        } else if (buttonText.includes('Hubungi') || buttonText.includes('Sekarang')) {
            // Show contact modal or scroll to contact section
            alert('Hubungi Kami:\n\n📞 +62 812-3456-7890\n📧 info@printtechservice.com\n📍 Bandung, Indonesia\n\nAtau klik tombol WhatsApp untuk chat langsung!');
        }
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Counter animation for numbers in Why Us section
const featureNumbers = document.querySelectorAll('.feature-number');

const numberObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const number = entry.target.textContent;
            entry.target.style.transform = 'scale(0)';
            
            setTimeout(() => {
                entry.target.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                entry.target.style.transform = 'scale(1)';
            }, 100);
            
            numberObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

featureNumbers.forEach(number => {
    numberObserver.observe(number);
});

// Add hover effect to machine cards
const machineCards = document.querySelectorAll('.machine-card');

machineCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderLeftWidth = '6px';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.borderLeftWidth = '4px';
    });
});

// Log page load
console.log('PrintTech Service - Website loaded successfully!');
console.log('Specialized in printing machine service & maintenance');