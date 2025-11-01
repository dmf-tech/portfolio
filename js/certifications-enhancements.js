/**
 * SIMPLIFIED CERTIFICATIONS ENHANCEMENTS
 * Streamlined JavaScript for reliable certification interactions
 */

(function() {
    'use strict';

    // Simplified certification modal functionality
    function enhanceCertificationModal() {
        const modal = document.getElementById('certificationModal');
        const closeBtn = document.getElementById('closeCertModal');
        const viewDetailsButtons = document.querySelectorAll('.view-cert-details');

        if (!modal || !closeBtn) return;

        // Simple modal opening
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const certCard = this.closest('.certification-card');
                
                if (certCard) {
                    // Collect certification data
                    const certData = {
                        title: certCard.dataset.certTitle || 'N/A',
                        issuer: certCard.dataset.certIssuer || 'N/A',
                        date: certCard.dataset.certDate || 'N/A',
                        expiry: certCard.dataset.certExpiry || 'N/A',
                        id: certCard.dataset.certId || 'N/A',
                        description: certCard.dataset.certDescription || 'No description available.',
                        skills: certCard.dataset.certSkills || ''
                    };

                    // Show modal immediately
                    modal.style.display = 'flex';
                    
                    // Small delay for smooth appearance
                    setTimeout(() => {
                        populateCertificationModal(certData);
                        modal.classList.add('active');
                        
                        // Focus management
                        closeBtn.focus();
                    }, 50);
                }
            });
        });

        // Simple modal closing
        function closeModal() {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }

        // Close button event
        closeBtn.addEventListener('click', closeModal);

        // Backdrop click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // ESC key handling
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Simplified modal content population
        function populateCertificationModal(certData) {
            // Update modal title
            const modalTitle = document.getElementById('certModalTitle');
            if (modalTitle) {
                modalTitle.textContent = certData.title;
            }

            // Update certification details
            const fields = [
                { id: 'certModalCertTitle', value: certData.title },
                { id: 'certModalIssuer', value: certData.issuer },
                { id: 'certModalDate', value: certData.date },
                { id: 'certModalExpiry', value: certData.expiry },
                { id: 'certModalId', value: certData.id }
            ];

            fields.forEach(field => {
                const element = document.getElementById(field.id);
                if (element) {
                    element.textContent = field.value;
                }
            });

            // Fixed description formatting
            const descriptionElement = document.getElementById('certModalDescription');
            if (descriptionElement && certData.description) {
                const formattedDescription = formatCertificationDescription(certData.description);
                descriptionElement.innerHTML = formattedDescription;
            }

            // Fixed skills display - ensure they show properly
            const skillsElement = document.getElementById('certModalSkills');
            if (skillsElement && certData.skills) {
                const skillsArray = certData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
                skillsElement.innerHTML = '';
                
                if (skillsArray.length > 0) {
                    skillsArray.forEach(skill => {
                        const skillTag = document.createElement('span');
                        skillTag.className = 'skill-tag'; // Apply the class
                        skillTag.textContent = skill;
                        // skillTag.style.display = 'inline-block'; // Now in CSS
                        // skillTag.style.opacity = '1'; // Now in CSS
                        skillsElement.appendChild(skillTag);
                    });
                } else {
                    skillsElement.innerHTML = '<span class="skill-tag">No skills listed</span>';
                }
            }
        }

        // Simplified description formatting
        function formatCertificationDescription(description) {
            return description
                .replace(/\|/g, '<br>')
                .replace(/COURSES:/g, '<br><br><strong>COURSES:</strong>')
                .replace(/MODULES:/g, '<br><br><strong>MODULES:</strong>')
                .replace(/•/g, '<span class="bullet-point-style">•</span>'); // Use the new class
        }
    }

    // Simplified certification cards
    function enhanceCertificationCards() {
        const cards = document.querySelectorAll('.certification-card');
        
        cards.forEach(card => {
            // Simple hover effects
            card.addEventListener('mouseenter', function() {
                this.classList.add('certification-card-hover-effect');
            });

            card.addEventListener('mouseleave', function() {
                this.classList.remove('certification-card-hover-effect');
            });

            // Ensure buttons are visible - now handled by CSS by default
            // const buttons = card.querySelectorAll('.certification-actions .btn');
            // buttons.forEach(btn => {
            //     btn.style.opacity = '1';
            //     btn.style.visibility = 'visible';
            //     btn.style.display = 'inline-block';
            // });
        });
    }

    // Simplified carousel navigation
    function enhanceCertificationCarousel() {
        const wrapper = document.querySelector('.certifications-carousel-wrapper');
        const container = document.querySelector('.certifications-container');
        const grid = document.querySelector('.certifications-grid');
        const prevBtn = document.getElementById('certPrevBtn');
        const nextBtn = document.getElementById('certNextBtn');
        const cards = document.querySelectorAll('.certification-card');

        if (!wrapper || !container || !grid || !prevBtn || !nextBtn || cards.length === 0) return;

        let currentIndex = 0;
        let cardsPerView = getCardsPerView();
        let maxIndex = Math.max(0, cards.length - cardsPerView);
        let isAnimating = false;

        // Calculate actual card width including gap for precise movement
        function getCardWidth() {
            if (cards.length === 0) return 0;
            const cardStyle = window.getComputedStyle(cards[0]);
            const cardWidth = cards[0].offsetWidth;
            const gap = parseInt(window.getComputedStyle(grid).gap) || 20;
            return cardWidth + gap;
        }

        // Simple button state management
        function updateButtonStates() {
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
            
            if (currentIndex === 0) {
                prevBtn.classList.add('disabled');
            } else {
                prevBtn.classList.remove('disabled');
            }
            
            if (currentIndex >= maxIndex) {
                nextBtn.classList.add('disabled');
            } else {
                nextBtn.classList.remove('disabled');
            }
        }

        // Improved carousel navigation with pixel-perfect movement
        function navigateCarousel(direction) {
            if (isAnimating) return;

            const previousIndex = currentIndex;
            
            if (direction === 'prev' && currentIndex > 0) {
                currentIndex--;
            } else if (direction === 'next' && currentIndex < maxIndex) {
                currentIndex++;
            }

            if (currentIndex !== previousIndex) {
                isAnimating = true;
                
                // Use pixel-based movement for precise positioning
                const cardWidth = getCardWidth();
                const moveDistance = cardWidth * currentIndex;
                
                // Apply precise transition - now handled by CSS variable
                // grid.style.transition = 'transform 0.3s ease';
                // grid.style.transform = `translateX(-${moveDistance}px)`;
                grid.style.setProperty('--carousel-translate-x', `-${moveDistance}px`);
                
                updateButtonStates();
                
                // Reset animation flag
                setTimeout(() => {
                    isAnimating = false;
                }, 300);
            }
        }

        // Simple button event handlers
        prevBtn.addEventListener('click', () => navigateCarousel('prev'));
        nextBtn.addEventListener('click', () => navigateCarousel('next'));

        // Simple responsive calculation
        function getCardsPerView() {
            const width = window.innerWidth;
            if (width <= 767) return 1;
            if (width <= 991) return 2;
            return 3;
        }

        // Enhanced resize handling with recalculation
        window.addEventListener('resize', function() {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                maxIndex = Math.max(0, cards.length - cardsPerView);
                
                // Ensure current index doesn't exceed new maxIndex
                if (currentIndex > maxIndex) {
                    currentIndex = maxIndex;
                }
                
                // Recalculate position with new card width
                const cardWidth = getCardWidth();
                const moveDistance = cardWidth * currentIndex;
                grid.style.setProperty('--carousel-translate-x', `-${moveDistance}px`);
                updateButtonStates();
            }
        });

        // Initialize with proper positioning
        function initialize() {
            // Ensure grid starts at position 0
            // grid.style.transform = 'translateX(0px)'; // Controlled by CSS variable
            currentIndex = 0;
            updateButtonStates();
            
        }

        // Initialize
        initialize();
    }

    // Simple scroll animations
    function enhanceCertificationScrollAnimations() {
        const cards = document.querySelectorAll('.certification-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }

    // Ensure all elements are visible
    function ensureElementsVisibility() {
        // Force visibility of all buttons
        const allButtons = document.querySelectorAll('.certification-actions .btn, .carousel-nav-btn');
        allButtons.forEach(btn => {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
            btn.style.display = btn.classList.contains('carousel-nav-btn') ? 'flex' : 'inline-block';
        });

        // Force visibility of skill tags
        const skillTags = document.querySelectorAll('.skills-tags .skill-tag');
        skillTags.forEach(tag => {
            tag.style.opacity = '1';
            tag.style.visibility = 'visible';
            tag.style.display = 'inline-block';
        });

        // Ensure modal elements are visible
        const modalElements = document.querySelectorAll('.cert-modal-close');
        modalElements.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.display = 'flex';
        });
    }

    // Initialize all enhancements
    function initCertificationEnhancements() {
        try {
            // Initialize all enhancement functions
            enhanceCertificationModal();
            enhanceCertificationCards();
            enhanceCertificationCarousel();
            enhanceCertificationScrollAnimations();
            ensureElementsVisibility();
            
            // console.log('✓ Simplified certification enhancements initialized');
        } catch (error) {
            console.warn('Certification enhancements initialization error:', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCertificationEnhancements);
    } else {
        initCertificationEnhancements();
    }

    // Ensure visibility after page load
    window.addEventListener('load', function() {
        setTimeout(ensureElementsVisibility, 100);
    });

})(); 