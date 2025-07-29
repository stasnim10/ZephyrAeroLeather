// Zephyr Aero Leather - Modern Interactive Features JavaScript

// Global State Management
class ZephyrApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('zephyr_cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('zephyr_wishlist')) || [];
        this.currentFilter = 'all';
        this.searchSuggestions = [
            'Aviator Passport Wallet',
            'Adventurer Saddle Bag',
            'Traveler Sunglass Case',
            'Commuter Leather Belt',
            'Minimalist Wallet',
            'iPhone Cases',
            'Key Chains',
            'Leather Bags',
            'Flight Bags',
            'Duffle Bags',
            'Tote Bags',
            'Backpacks'
        ];
        this.isLoading = false;
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.startLoadingSequence();
    }

    startLoadingSequence() {
        // Simulate realistic loading
        const loadingSteps = [
            { message: 'Loading Zephyr Experience...', duration: 800 },
            { message: 'Preparing Collections...', duration: 600 },
            { message: 'Crafting Interface...', duration: 400 }
        ];

        let currentStep = 0;
        const loadingText = document.querySelector('.loading-text');

        const nextStep = () => {
            if (currentStep < loadingSteps.length) {
                const step = loadingSteps[currentStep];
                loadingText.textContent = step.message;
                currentStep++;
                setTimeout(nextStep, step.duration);
            } else {
                this.hideLoading();
            }
        };

        nextStep();
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.add('hidden');
        
        // Initialize animations after loading
        setTimeout(() => {
            this.initializeScrollAnimations();
            this.initializeParallax();
        }, 500);
    }

    setupEventListeners() {
        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.updateCartCount();
            this.initializeScrollProgress();
            this.initializeScrollToTop();
            this.initializeHeaderScroll();
            this.initializeSearchAutocomplete();
            this.initializeFilterTabs();
            this.initializeNewsletterForm();
            this.initializeKeyboardShortcuts();
            this.initializeThemeToggle();
        });

        // Window events
        window.addEventListener('scroll', this.debounce(this.handleScroll.bind(this), 10));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        
        // Error handling
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handleError.bind(this));
    }

    initializeComponents() {
        // Initialize all interactive components
        this.initializeProductCards();
        this.initializeCollectionCards();
        this.initializeFeatureItems();
        this.initializeStatCounters();
    }

    // Advanced Notification System
    showNotification(message, type = 'success', duration = 4000) {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fas fa-check',
            error: 'fas fa-times',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info'
        };

        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${icons[type] || icons.success}"></i>
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Show notification with animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Auto dismiss
        const dismissTimer = setTimeout(() => {
            this.dismissNotification(notification);
        }, duration);
        
        // Manual dismiss
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(dismissTimer);
            this.dismissNotification(notification);
        });
        
        return notification;
    }

    dismissNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }

    // Advanced Cart System
    addToCart(productId, price, name) {
        if (this.isLoading) return;
        
        this.setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            const existingItem = this.cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
                this.showNotification(`Increased ${name} quantity to ${existingItem.quantity}`, 'success');
            } else {
                this.cart.push({
                    id: productId,
                    price: price,
                    quantity: 1,
                    name: name,
                    addedAt: new Date().toISOString()
                });
                this.showNotification(`${name} added to cart!`, 'success');
            }
            
            this.saveCart();
            this.updateCartCount();
            this.animateCartIcon();
            this.setLoading(false);
        }, 800);
    }

    removeFromCart(productId) {
        const index = this.cart.findIndex(item => item.id === productId);
        if (index > -1) {
            const item = this.cart[index];
            this.cart.splice(index, 1);
            this.saveCart();
            this.updateCartCount();
            this.showNotification(`${item.name} removed from cart`, 'warning');
        }
    }

    addToWishlist(productId, name) {
        if (this.wishlist.includes(productId)) {
            this.showNotification('Item already in wishlist', 'warning');
            return;
        }
        
        this.wishlist.push(productId);
        this.saveWishlist();
        this.showNotification(`${name} added to wishlist!`, 'success');
        
        // Update wishlist button state
        const wishlistBtns = document.querySelectorAll(`[data-product="${productId}"] .btn-wishlist`);
        wishlistBtns.forEach(btn => {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        });
    }

    removeFromWishlist(productId, name) {
        const index = this.wishlist.indexOf(productId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.saveWishlist();
            this.showNotification(`${name} removed from wishlist`, 'warning');
            
            // Update wishlist button state
            const wishlistBtns = document.querySelectorAll(`[data-product="${productId}"] .btn-wishlist`);
            wishlistBtns.forEach(btn => {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="far fa-heart"></i>';
            });
        }
    }

    saveCart() {
        localStorage.setItem('zephyr_cart', JSON.stringify(this.cart));
    }

    saveWishlist() {
        localStorage.setItem('zephyr_wishlist', JSON.stringify(this.wishlist));
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Advanced Search System
    initializeSearchAutocomplete() {
        const searchInput = document.getElementById('searchInput');
        const suggestions = document.getElementById('searchSuggestions');
        
        if (!searchInput || !suggestions) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const value = e.target.value.toLowerCase().trim();
            
            if (value.length < 2) {
                suggestions.style.display = 'none';
                return;
            }
            
            searchTimeout = setTimeout(() => {
                this.showSearchSuggestions(value, suggestions);
            }, 300);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(searchInput.value);
                suggestions.style.display = 'none';
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
                suggestions.style.display = 'none';
            }
        });
    }

    showSearchSuggestions(query, container) {
        const filtered = this.searchSuggestions.filter(item => 
            item.toLowerCase().includes(query)
        ).slice(0, 6);
        
        if (filtered.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.innerHTML = filtered.map(item => `
            <div class="search-suggestion" data-suggestion="${item}">
                <i class="search-suggestion-icon fas fa-search"></i>
                <span>${this.highlightMatch(item, query)}</span>
            </div>
        `).join('');
        
        container.style.display = 'block';
        
        // Add click handlers
        container.querySelectorAll('.search-suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                const searchInput = document.getElementById('searchInput');
                searchInput.value = suggestion.dataset.suggestion;
                container.style.display = 'none';
                this.performSearch(suggestion.dataset.suggestion);
            });
        });
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    performSearch(query) {
        if (!query.trim()) {
            this.showNotification('Please enter a search term', 'warning');
            return;
        }
        
        this.setLoading(true);
        
        setTimeout(() => {
            this.setLoading(false);
            this.showNotification(`Searching for "${query}"...`, 'info');
            // In a real app, this would redirect to search results
        }, 1200);
    }

    // Advanced Filter System
    initializeFilterTabs() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const filter = tab.dataset.filter;
                this.applyFilter(filter);
                
                // Update active state
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }

    applyFilter(filter) {
        this.currentFilter = filter;
        const products = document.querySelectorAll('.product-card');
        
        products.forEach((product, index) => {
            const collection = product.dataset.collection;
            const shouldShow = filter === 'all' || collection === filter;
            
            if (shouldShow) {
                product.style.display = 'block';
                // Stagger animation
                setTimeout(() => {
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, index * 100);
            } else {
                product.style.opacity = '0';
                product.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    product.style.display = 'none';
                }, 300);
            }
        });
        
        const activeCount = document.querySelectorAll(`.product-card[data-collection="${filter}"]`).length;
        const totalCount = products.length;
        const displayCount = filter === 'all' ? totalCount : activeCount;
        
        this.showNotification(`Showing ${displayCount} ${filter === 'all' ? '' : filter} products`, 'info', 2000);
    }

    // Advanced Animation System
    initializeScrollAnimations() {
        const animateElements = document.querySelectorAll('.product-card, .collection-card, .feature-item, .stat-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        
        this.observers.set('scroll', observer);
    }

    initializeParallax() {
        const parallaxElements = document.querySelectorAll('.c-hero-banner');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(el => {
                el.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // Counter Animation
    initializeStatCounters() {
        const statItems = document.querySelectorAll('.stat-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target.querySelector('.stat-number').dataset.target;
                    this.animateCounter(entry.target, parseInt(target));
                }
            });
        });
        
        statItems.forEach(item => observer.observe(item));
        this.observers.set('stats', observer);
    }

    animateCounter(element, target) {
        const counter = element.querySelector('.stat-number');
        const duration = 2500;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const displayValue = Math.floor(current);
            const suffix = target === 100 ? '%' : target > 50 ? '+' : '';
            counter.textContent = displayValue + suffix;
        }, 16);
    }

    // Product Card Interactions
    initializeProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const productId = card.dataset.product;
            const productName = card.querySelector('h4').textContent;
            const productPrice = parseFloat(card.querySelector('.product-price').textContent.replace('$', ''));
            
            // Add to cart button
            const addToCartBtn = card.querySelector('.btn-add-cart');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.addToCart(productId, productPrice, productName);
                });
            }
            
            // Wishlist button
            const wishlistBtn = card.querySelector('.btn-wishlist');
            if (wishlistBtn) {
                // Set initial state
                if (this.wishlist.includes(productId)) {
                    wishlistBtn.classList.add('active');
                    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
                }
                
                wishlistBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.wishlist.includes(productId)) {
                        this.removeFromWishlist(productId, productName);
                    } else {
                        this.addToWishlist(productId, productName);
                    }
                });
            }
            
            // Quick view button
            const quickViewBtn = card.querySelector('.quick-view-btn');
            if (quickViewBtn) {
                quickViewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openQuickView(productId, productName);
                });
            }
        });
    }

    openQuickView(productId, productName) {
        this.setLoading(true);
        
        setTimeout(() => {
            this.setLoading(false);
            this.showNotification(`Quick view for ${productName}`, 'info');
            // In a real app, this would open a modal with product details
        }, 1000);
    }

    // Collection Card Interactions
    initializeCollectionCards() {
        const collectionCards = document.querySelectorAll('.collection-card');
        
        collectionCards.forEach(card => {
            card.addEventListener('click', () => {
                const collection = card.dataset.collection;
                this.showNotification(`Exploring ${collection} collection...`, 'info');
                // In a real app, this would navigate to the collection page
            });
        });
    }

    // Feature Item Interactions
    initializeFeatureItems() {
        const featureItems = document.querySelectorAll('.feature-item');
        
        featureItems.forEach(item => {
            item.addEventListener('click', () => {
                const title = item.querySelector('h4').textContent;
                this.showNotification(`Learn more about ${title}`, 'info');
            });
        });
    }

    // Newsletter Form
    initializeNewsletterForm() {
        const form = document.querySelector('.newsletter-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('.newsletter-input').value;
            
            if (!this.isValidEmail(email)) {
                this.showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            this.setLoading(true);
            
            setTimeout(() => {
                this.setLoading(false);
                this.showNotification('Thank you for subscribing! Welcome to the Zephyr family.', 'success');
                form.reset();
            }, 1500);
        });
    }

    // Scroll Progress
    initializeScrollProgress() {
        const progressBar = document.getElementById('progressBar');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        });
    }

    // Scroll to Top
    initializeScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        document.body.appendChild(scrollBtn);
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
    }

    // Header Scroll Effect
    initializeHeaderScroll() {
        const header = document.querySelector('.st-global-header');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Keyboard Shortcuts
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // ESC key to close modals/suggestions
            if (e.key === 'Escape') {
                const suggestions = document.getElementById('searchSuggestions');
                if (suggestions) {
                    suggestions.style.display = 'none';
                }
            }
            
            // Ctrl/Cmd + K for search focus
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
            
            // Ctrl/Cmd + / for help
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showKeyboardShortcuts();
            }
        });
    }

    showKeyboardShortcuts() {
        const shortcuts = [
            'Ctrl/Cmd + K: Focus search',
            'Ctrl/Cmd + /: Show shortcuts',
            'Esc: Close modals'
        ];
        
        this.showNotification(`Keyboard shortcuts: ${shortcuts.join(', ')}`, 'info', 6000);
    }

    // Theme Toggle (for future dark mode)
    initializeThemeToggle() {
        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
    }

    // Utility Functions
    handleScroll() {
        // Throttled scroll handler for performance
        this.updateScrollProgress();
    }

    handleResize() {
        // Handle window resize events
        this.updateLayout();
    }

    handleError(event) {
        console.error('Application error:', event.error || event.reason);
        this.showNotification('Something went wrong. Please try again.', 'error');
    }

    updateScrollProgress() {
        // Update scroll-based animations and effects
    }

    updateLayout() {
        // Update layout-dependent calculations
    }

    setLoading(loading) {
        this.isLoading = loading;
        const overlay = document.getElementById('loadingOverlay');
        
        if (loading) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    debounce(func, wait) {
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

    // Cleanup
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// Initialize the application
const zephyrApp = new ZephyrApp();

// Global functions for HTML onclick handlers
window.addToCart = (productId, price) => {
    const productName = document.querySelector(`[data-product="${productId}"] h4`).textContent;
    zephyrApp.addToCart(productId, price, productName);
};

window.addToWishlist = (productId) => {
    const productName = document.querySelector(`[data-product="${productId}"] h4`).textContent;
    zephyrApp.addToWishlist(productId, productName);
};

window.openQuickView = (productId) => {
    const productName = document.querySelector(`[data-product="${productId}"] h4`).textContent;
    zephyrApp.openQuickView(productId, productName);
};

window.filterProducts = (filter) => {
    zephyrApp.applyFilter(filter);
};

window.trackClick = (collection, product) => {
    console.log(`Clicked: ${collection} - ${product}`);
    // Analytics tracking would go here
};

window.trackButtonClick = (section, action) => {
    console.log(`Button clicked: ${section} - ${action}`);
    // Analytics tracking would go here
};

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZephyrApp;
}
