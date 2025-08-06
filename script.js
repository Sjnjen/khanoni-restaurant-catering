
// Loading Screen
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    // Show loading screen immediately
    loadingScreen.style.display = 'flex';
    
    // Hide after content loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    });
});

// Header Scroll Effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Initialize Menu Tabs
function initMenuTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuCategories = document.querySelectorAll('.menu-category');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and categories
            tabBtns.forEach(btn => btn.classList.remove('active'));
            menuCategories.forEach(category => category.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding category
            const categoryId = btn.getAttribute('data-category');
            document.getElementById(categoryId).classList.add('active');
        });
    });
}

// Cart System
function initCartSystem() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.querySelector('.cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.total-amount');
    const clearCartBtn = document.querySelector('.clear-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    let cart = JSON.parse(localStorage.getItem('khanoniCart')) || [];

    // Open/Close Cart
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    
    function toggleCart() {
        cartModal.classList.toggle('active');
        document.body.style.overflow = cartModal.classList.contains('active') ? 'hidden' : 'auto';
    }

    // Add to Cart
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const btn = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const menuItem = btn.closest('.menu-item');
            const itemName = menuItem.getAttribute('data-name');
            const itemPrice = parseFloat(menuItem.getAttribute('data-price'));
            
            addToCart(itemName, itemPrice);
        }
    });

    function addToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }
        
        updateCart();
        animateCartIcon();
    }

    function updateCart() {
        // Save to localStorage
        localStorage.setItem('khanoniCart', JSON.stringify(cart));
        
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = totalItems;
        
        // Update cart items display
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.textContent = 'R0';
            return;
        }
        
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
                <div class="remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Update total
        cartTotal.textContent = `R${total.toFixed(2)}`;
        
        // Add event listeners to dynamic elements
        addCartItemEventListeners();
    }

    function addCartItemEventListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const item = cart[index];
                
                if (this.classList.contains('minus')) {
                    item.quantity > 1 ? item.quantity -= 1 : cart.splice(index, 1);
                } else if (this.classList.contains('plus')) {
                    item.quantity += 1;
                }
                
                updateCart();
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    function animateCartIcon() {
        const cartCount = document.querySelector('.cart-count');
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);
    }

    // Clear Cart
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCart();
    });

    // Checkout via WhatsApp
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before checking out.');
            return;
        }
        
        const phoneNumbers = ['270829341227', '270829341227'];
        const itemsList = cart.map(item => 
            `${item.name} x ${item.quantity} - R${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const message = `Hello Khanoni,\nI would like to place an order:\n\n${itemsList}\n\nTotal: R${total.toFixed(2)}\n\nDelivery Address: [Please provide your address]`;
        
        window.open(`https://wa.me/${phoneNumbers[0]}?text=${encodeURIComponent(message)}`, '_blank');
    });

    // Initialize cart on page load
    updateCart();
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize all functionality
function init() {
    initMenuTabs();
    initCartSystem();
    initSmoothScrolling();
}

// Start the application

init();
