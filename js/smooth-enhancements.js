// Smooth Enhancements & Image Loading Optimizations
(function() {
    'use strict';

    // Enhanced Image Loading with Smooth Transitions
    function enhanceImageLoading() {
        const images = document.querySelectorAll('img[src]');
        
        images.forEach(img => {
            // Skip if already loaded
            if (img.complete && img.naturalHeight !== 0) {
                img.classList.add('loaded');
                return;
            }
            
            // Add loading class initially
            img.classList.add('loading');
            
            // Create a new image to preload
            const imageLoader = new Image();
            
            imageLoader.onload = function() {
                // Smooth transition when image loads
                requestAnimationFrame(() => {
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                });
            };
            
            imageLoader.onerror = function() {
                img.classList.remove('loading');
                // Add error handling if needed
                console.warn('Failed to load image:', img.src);
            };
            
            // Start loading
            imageLoader.src = img.src;
        });
    }

    // Enhanced Intersection Observer for Smooth Animations
    function enhanceScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add smooth delay for staggered animations
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animation elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Smooth Carousel Transitions
    function enhanceCarousels() {
        const carousels = document.querySelectorAll('[data-project-carousel]');
        
        carousels.forEach(carousel => {
            const images = carousel.querySelectorAll('.carousel-image');
            let currentIndex = 0;
            
            // Enhance existing carousel functionality
            function smoothTransition(newIndex) {
                if (newIndex === currentIndex) return;
                
                const currentImage = images[currentIndex];
                const newImage = images[newIndex];
                
                if (currentImage) {
                    currentImage.style.transform = 'translateX(-20px) translateZ(0)';
                    currentImage.style.opacity = '0';
                }
                
                if (newImage) {
                    // Small delay for smooth transition
                    setTimeout(() => {
                        newImage.style.transform = 'translateX(0) translateZ(0)';
                        newImage.style.opacity = '1';
                    }, 150);
                }
                
                currentIndex = newIndex;
            }
            
            // Store enhancement function for external use
            carousel.smoothTransition = smoothTransition;
        });
    }

    // Performance Optimizations
    function optimizePerformance() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--transition-duration', '0.01ms');
        }

        // Optimize scroll performance
        let ticking = false;
        
        function updateScrollPosition() {
            // Throttle scroll events for better performance
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        }, { passive: true });

        // Optimize resize performance
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Trigger any resize-dependent functionality
                window.dispatchEvent(new Event('optimizedResize'));
            }, 250);
        }, { passive: true });
    }

    // Enhanced Button Ripple Effect (preserve existing while improving)
    function enhanceButtonInteractions() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.btn');
            if (!button) return;
            
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
        
        // Add ripple animation CSS if not exists
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Smooth Modal Transitions (preserve existing functionality)
    function enhanceModals() {
        const modals = document.querySelectorAll('.modal, .cert-modal, .blog-modal');
        
        modals.forEach(modal => {
            const content = modal.querySelector('.modal-content, .cert-modal-content, .blog-modal-content');
            
            // Enhance opening transition
            const originalDisplay = modal.style.display;
            
            modal.addEventListener('transitionstart', () => {
                if (modal.classList.contains('active')) {
                    modal.style.pointerEvents = 'auto';
                }
            });
            
            modal.addEventListener('transitionend', () => {
                if (!modal.classList.contains('active')) {
                    modal.style.pointerEvents = 'none';
                }
            });
        });
    }

    // Lazy Loading Enhancement
    function enhanceLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('loaded');
                        lazyImageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                lazyImageObserver.observe(img);
            });
        }
    }

    // Smooth Page Load Transitions
    function enhancePageLoad() {
        // Add loading class to body initially
        document.body.classList.add('loading');
        
        window.addEventListener('load', () => {
            // Small delay to ensure everything is ready
            setTimeout(() => {
                document.body.classList.remove('loading');
                document.body.classList.add('loaded');
                
                // Trigger enhanced animations
                enhanceImageLoading();
                enhanceScrollAnimations();
            }, 100);
        });
    }

    // Initialize all enhancements
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Initialize enhancements in order
        enhancePageLoad();
        optimizePerformance();
        enhanceCarousels();
        enhanceButtonInteractions();
        enhanceModals();
        enhanceLazyLoading();
        
        // Initialize immediately visible images
        enhanceImageLoading();
        
        // Initialize scroll animations for elements already in view
        setTimeout(enhanceScrollAnimations, 100);
    }

    // Expose utilities for external use
    window.SmoothEnhancements = {
        enhanceImageLoading,
        enhanceScrollAnimations,
        enhanceCarousels,
        optimizePerformance
    };

    // Start initialization
    init();

})(); 