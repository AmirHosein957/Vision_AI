// ==================== DOM Elements ====================
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const glassButtons = document.querySelectorAll('.glass-button');

// ==================== Mobile Navigation Toggle ====================
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // Hamburger animation
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active')
            ? 'rotate(45deg) translate(7px, 7px)'
            : 'none';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active')
            ? 'rotate(-45deg) translate(7px, -7px)'
            : 'none';
    });
}

// ==================== Smooth Scrolling ====================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');

        if (targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const spans = navToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        }
    });
});

// ==================== Advanced Ripple Effect ====================
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple-effect');

    const ripple = button.getElementsByClassName('ripple-effect')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);

    setTimeout(() => {
        circle.remove();
    }, 600);
}

// Add ripple effect to all glass buttons
glassButtons.forEach(button => {
    button.addEventListener('click', createRipple);
});

// ==================== Scroll Animations ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
const cards = document.querySelectorAll('.glass-card');
cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ==================== Navbar Background on Scroll ====================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.2)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.03)';
        navbar.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3)';
    }

    lastScroll = currentScroll;
});

// ==================== Product Card Interactions ====================
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    const buyButton = card.querySelector('.btn-buy');
    const variants = card.querySelectorAll('.variant');

    // Variant selection
    variants.forEach(variant => {
        variant.addEventListener('click', (e) => {
            e.stopPropagation();
            variants.forEach(v => v.style.background = 'rgba(255, 215, 0, 0.1)');
            variant.style.background = 'rgba(255, 215, 0, 0.3)';
            variant.style.borderColor = 'var(--primary-gold)';
        });
    });

    // Buy button action
    if (buyButton) {
        buyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const productTitle = card.querySelector('.product-title').textContent;
            showNotification(`محصول "${productTitle}" به سبد خرید اضافه شد!`);
        });
    }
});

// ==================== Contact Form Handling ====================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const inputs = contactForm.querySelectorAll('input, textarea');

        // Simulate form submission
        showNotification('پیام شما با موفقیت ارسال شد! به زودی با شما تماس می‌گیریم.');

        // Reset form
        inputs.forEach(input => input.value = '');
    });
}

// ==================== Notification System ====================
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification glass-card';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <span style="font-size: 24px;">✓</span>
            <span>${message}</span>
        </div>
    `;

    // Add notification styles
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.right = '20px';
    notification.style.padding = '20px 30px';
    notification.style.zIndex = '10000';
    notification.style.maxWidth = '400px';
    notification.style.background = 'rgba(0, 0, 0, 0.9)';
    notification.style.border = '2px solid var(--primary-gold)';
    notification.style.animation = 'slideInRight 0.5s ease';

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 215, 0, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== Hero Button Action ====================
const heroButton = document.querySelector('.hero .btn-primary');
if (heroButton) {
    heroButton.addEventListener('click', (e) => {
        e.preventDefault();
        const productsSection = document.querySelector('#products');
        if (productsSection) {
            const offsetTop = productsSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
}

// ==================== Parallax Effect for Hero ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const floatingShapes = document.querySelectorAll('.shape');

    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }

    floatingShapes.forEach((shape, index) => {
        const speed = 0.1 + (index * 0.05);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ==================== Dynamic Stats Counter ====================
const statsNumbers = document.querySelectorAll('.stat-number');

const countUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

statsNumbers.forEach(stat => {
    countUpObserver.observe(stat);
});

function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const number = parseInt(text.replace(/\D/g, ''));

    if (isNaN(number)) return;

    const duration = 2000;
    const steps = 60;
    const increment = number / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }

        const formattedNumber = Math.floor(current).toLocaleString('fa-IR');
        element.textContent = hasPlus ? formattedNumber + '+' : formattedNumber;
    }, duration / steps);
}

// ==================== Image Lazy Loading Effect ====================
const productImages = document.querySelectorAll('.product-img-placeholder');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'shimmer 3s infinite';
        }
    });
}, { threshold: 0.1 });

productImages.forEach(img => {
    imageObserver.observe(img);
});

// ==================== Cursor Trail Effect (Optional) ====================
let cursorTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    // Only on larger screens
    if (window.innerWidth > 768) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--primary-gold);
            border-radius: 50%;
            pointer-events: none;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            opacity: 0.6;
            z-index: 9999;
            transition: opacity 0.5s ease;
        `;

        document.body.appendChild(trail);
        cursorTrail.push(trail);

        if (cursorTrail.length > maxTrailLength) {
            const oldTrail = cursorTrail.shift();
            oldTrail.remove();
        }

        setTimeout(() => {
            trail.style.opacity = '0';
            setTimeout(() => trail.remove(), 500);
        }, 100);
    }
});

// ==================== Console Welcome Message ====================
console.log('%c🎮 GameGift Store', 'color: #FFD700; font-size: 24px; font-weight: bold;');
console.log('%cWelcome to the best gaming gift card store!', 'color: #FFA500; font-size: 14px;');
console.log('%cBuilt with ❤️ and modern web technologies', 'color: #DAA520; font-size: 12px;');

// ==================== Initialize ====================
console.log('✅ Website initialized successfully!');
