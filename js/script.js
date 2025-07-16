document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Helper function to select elements
    const select = (selector, scope = document) => scope.querySelector(selector);
    const selectAll = (selector, scope = document) => scope.querySelectorAll(selector);

    // --- Header Scroll Effect ---
    const header = select('#header');
    if (header) {
        const headerScrolled = () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('load', headerScrolled);
        window.addEventListener('scroll', headerScrolled);
    }

    // --- Mobile Navigation Toggle ---
    const hamburger = select('.hamburger');
    const navMenu = select('.nav-menu');

    if (hamburger && navMenu) {
        const toggleMobileNav = () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('mobile-nav-active');
            const isExpanded = navMenu.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        };

        hamburger.addEventListener('click', toggleMobileNav);

        // Close mobile nav when a link is clicked
        selectAll('.nav-menu a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    toggleMobileNav();
                }
            });
        });

        // Close mobile nav on window resize if open
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
                toggleMobileNav();
            }
        });
    }

    // --- Smooth Scroll for Anchor Links & Active Link Highlighting ---
    const navLinks = selectAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = select(targetId);
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // If mobile nav is open, close it
                if (navMenu && navMenu.classList.contains('active')) {
                    // Assuming toggleMobileNav is the function that handles this
                    // If not, replicate the close logic here:
                    navMenu.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                    document.body.classList.remove('mobile-nav-active');
                    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    const updateActiveNavLink = () => {
        const sections = selectAll('section[id]'); // Get all sections with an ID
        const headerHeight = header ? header.offsetHeight : 0;
        let currentSectionId = '';

        // Determine the current scroll position, adjusted for the fixed header.
        // This is the point in the document that is currently at the top of the visible content area.
        const scrollPosition = window.scrollY + headerHeight;

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            
            // A section is considered a candidate for being active if its top
            // is at or above the current scroll position (adjusted for header).
            // We add a small buffer (e.g., 1 pixel) to handle exact alignments.
            if (sectionTop <= scrollPosition + 1) {
                currentSectionId = section.getAttribute('id');
            } else {
                // If this section's top is below the scrollPosition,
                // it means the previous section was the last one to qualify.
                break;
            }
        }
        
        // Special case: If scrolled to the very bottom of the page,
        // ensure the last section is marked active.
        if ((window.innerHeight + Math.ceil(window.scrollY)) >= document.body.offsetHeight - 2) { // -2px buffer for precision
            if (sections.length > 0) {
                currentSectionId = sections[sections.length - 1].getAttribute('id');
            }
        }

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-link');
            }
        });
    };
    window.addEventListener('scroll', updateActiveNavLink);
    window.addEventListener('load', updateActiveNavLink);


    // --- Scroll to Top Button ---
    const scrollToTopBtn = select('#scrollToTopBtn');
    if (scrollToTopBtn) {
        const toggleScrollToTopBtn = () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('active');
            } else {
                scrollToTopBtn.classList.remove('active');
            }
        };
        window.addEventListener('scroll', toggleScrollToTopBtn);
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Animate on Scroll (Intersection Observer) ---
    const animatedElements = selectAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerInstance.unobserve(entry.target); // Unobserve after animation
                }
            });
        }, {
            threshold: 0.1 // Adjust threshold as needed (0.1 means 10% visible)
        });
        animatedElements.forEach(el => observer.observe(el));
    }

    // --- About Me Tabs ---
    const aboutTabs = selectAll('.about-tabs-nav .tab-link');
    const aboutPanes = selectAll('.about-tabs-content .tab-pane');

    aboutTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.dataset.target;

            aboutTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            aboutPanes.forEach(pane => {
                if (pane.id === targetId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });

    // --- Enhanced Experience Section Accordion ---
    const experienceCards = selectAll('.experience-card');
    experienceCards.forEach(card => {
        const header = card.querySelector('.card-header');
        const content = card.querySelector('.card-content');
        const toggle = header.querySelector('.expand-toggle');
        
        if (header && content && toggle) {
            header.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get current expanded state
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                
                if (isExpanded) {
                    // Collapse
                    content.style.maxHeight = '0px';
                    content.classList.remove('active');
                    header.setAttribute('aria-expanded', 'false');
                    toggle.style.transform = 'rotate(0deg)';
                } else {
                    // Expand
                    content.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    header.setAttribute('aria-expanded', 'true');
                    toggle.style.transform = 'rotate(180deg)';
                }
            });

            // Keyboard accessibility
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click();
                }
            });

            // Handle resize to update maxHeight if expanded
            window.addEventListener('resize', () => {
                if (content.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });

    // --- Certifications Carousel ---
    const certificationsCarouselContainer = select('.certifications-carousel-container');
    if (certificationsCarouselContainer) {
        const grid = select('.certifications-grid', certificationsCarouselContainer);
        const cards = selectAll('.certification-card', grid);
        const prevBtn = select('#certPrevBtn'); // Now in wrapper, not container
        const nextBtn = select('#certNextBtn'); // Now in wrapper, not container

        let currentIndex = 0;
        let itemsPerSlide = 3; // Default for desktop, will be adjusted
        let totalSlides = 0;
        // let cardWidthWithGap = 0; // This variable is not used in the current simplified logic

        const calculateCarouselParameters = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 767) { // Mobile
                itemsPerSlide = 1;
            } else if (screenWidth <= 992) { // Tablet
                itemsPerSlide = 2;
            } else { // Desktop - This ensures 3 items per slide as requested
                itemsPerSlide = 3;
            }

            if (cards.length > 0) {
                // const cardStyle = window.getComputedStyle(cards[0]);
                // const cardMarginRight = parseFloat(cardStyle.marginRight) || 0; // Not needed if using grid gap
                // const gridGap = parseFloat(window.getComputedStyle(grid).gap) || 20; // Already read in updateCarousel

                // const cardClientWidth = cards[0].offsetWidth; // Already read in updateCarousel
                // cardWidthWithGap = cardClientWidth + (itemsPerSlide > 1 ? gridGap : 0) ; // Not currently used

                totalSlides = Math.ceil(cards.length / itemsPerSlide);
            } else {
                totalSlides = 0;
            }
             // If only one page of items (or fewer items than itemsPerSlide), disable navigation
            if (cards.length <= itemsPerSlide) {
                totalSlides = 1; // Ensure it's considered as one slide for button logic
            }
            updateCarousel(); // This will also call updateNavButtons
        };


        const updateCarousel = () => {
            if (!grid || cards.length === 0) return;

            let slideAmount = 0;
            if (cards.length > 0) {
                const firstCard = cards[0];
                // const cardStyle = window.getComputedStyle(firstCard); // Not strictly needed here
                const cardClientWidth = firstCard.offsetWidth; // Relies on CSS to give the card its width
                const gridGap = parseFloat(window.getComputedStyle(grid).gap) || 20; // Default gap if not specified in CSS

                // Calculate the total width of one "view" or "page"
                // This is (width of N cards) + (width of N-1 gaps between them)
                const viewWidth = (cardClientWidth * itemsPerSlide) + (gridGap * (itemsPerSlide - 1));
                
                // For a single item per slide, there are no internal gaps in the "view"
                if (itemsPerSlide === 1) {
                    // Slide by card width + one gap (to account for the space it occupies in the flex grid)
                    // Or just cardClientWidth if it's the only item and no gap is visually relevant for the slide.
                    // Using cardClientWidth + gridGap ensures consistent movement if multiple single items are scrolled.
                    slideAmount = currentIndex * (cardClientWidth + gridGap);
                } else {
                    slideAmount = currentIndex * viewWidth;
                }
            }
            grid.style.transform = `translateX(-${slideAmount}px)`;
            updateNavButtons();
        };

        const updateNavButtons = () => {
            if (!prevBtn || !nextBtn) return;

            if (currentIndex === 0) {
                prevBtn.classList.add('disabled');
                prevBtn.setAttribute('disabled', 'true');
            } else {
                prevBtn.classList.remove('disabled');
                prevBtn.removeAttribute('disabled');
            }

            if (currentIndex >= totalSlides - 1 || cards.length <= itemsPerSlide) {
                nextBtn.classList.add('disabled');
                nextBtn.setAttribute('disabled', 'true');
            } else {
                nextBtn.classList.remove('disabled');
                nextBtn.removeAttribute('disabled');
            }
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < totalSlides - 1) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
        }

        // Initial setup and resize handling
        calculateCarouselParameters(); // Initial calculation
        window.addEventListener('resize', () => {
            // Recalculate and reset to first slide to avoid layout issues
            currentIndex = 0;
            calculateCarouselParameters();
        });
    }

    // --- Generic Project Image Carousel Initializer ---
    const initializeProjectCarousel = (carouselElement) => {
        const imagesContainer = carouselElement.querySelector('.carousel-images');
        if (!imagesContainer) return; // Should not happen with correct HTML

        const images = Array.from(imagesContainer.children).filter(child => child.matches('.carousel-image'));
        const prevButton = carouselElement.querySelector('.carousel-nav.prev');
        const nextButton = carouselElement.querySelector('.carousel-nav.next');
        let currentIndex = 0;

        if (images.length <= 1) { // No need for carousel if 0 or 1 image
            if (prevButton) prevButton.style.display = 'none';
            if (nextButton) nextButton.style.display = 'none';
            if (images.length === 1 && !images[0].classList.contains('active')) {
                images[0].classList.add('active'); // Ensure the single image is active
            }
            return;
        }

        function showImage(index) {
            images.forEach((img, i) => {
                img.classList.remove('active');
                // img.style.opacity = 0; // Handled by CSS transition
                if (i === index) {
                    img.classList.add('active');
                    // img.style.opacity = 1; // Handled by CSS transition
                }
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
                showImage(currentIndex);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
                showImage(currentIndex);
            });
        }

        // Show the first image initially if not already active (though HTML should set it)
        const initiallyActiveImage = images.findIndex(img => img.classList.contains('active'));
        if (initiallyActiveImage !== -1) {
            currentIndex = initiallyActiveImage;
        } else if (images.length > 0) {
            currentIndex = 0;
            images[0].classList.add('active'); // Ensure first is active if none are
        }
        showImage(currentIndex); // Call to ensure correct display
    };

    // Initialize all project carousels (featured and cards)
    selectAll('.image-carousel').forEach(carousel => {
        initializeProjectCarousel(carousel);
    });

    // --- Project Filtering ---
    const initializeProjectFiltering = () => {
    const filterContainer = select('.project-filters');
        if (!filterContainer) return;

        const filterButtons = selectAll('.filter-btn', filterContainer);
        const projectsGrid = select('.projects-grid'); 
        
        if (projectsGrid) {
            const projectItems = Array.from(projectsGrid.children).filter(child => child.matches('.project-card'));

            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');

                    const filterValue = this.getAttribute('data-filter');

                    projectItems.forEach(item => {
                        // Use a class to control visibility for smoother transitions
                        item.classList.add('project-hidden');
                        item.style.display = 'none';

                        if (filterValue === '*' || item.classList.contains(filterValue.substring(1))) {
                            item.style.display = '';
                            // Delay to allow display property to apply before animation
                            setTimeout(() => item.classList.remove('project-hidden'), 10);
                        }
                    });
                });
            });

            const allButton = Array.from(filterButtons).find(btn => btn.getAttribute('data-filter') === '*');
            if (allButton) {
                allButton.click();
            } else if (filterButtons.length > 0) {
                filterButtons[0].click(); 
            }
        }
    };

    // --- Dynamic Project Loading ---
    const renderProjectCard = (project) => {
        const imagesHTML = project.imageSrcs.map((src, index) => 
            `<img src="${escapeHTML(src)}" alt="${escapeHTML(project.title)} Screenshot ${index + 1}" class="carousel-image ${index === 0 ? 'active' : ''}">`
        ).join('');

        const categoriesHTML = project.categories.map(cat => `<span class="category-tag">${escapeHTML(cat)}</span>`).join('');
        const technologiesHTML = project.technologies.map(tech => `<span>${escapeHTML(tech)}</span>`).join('');

        return `
            <div class="project-card ${project.filterClasses} animate-on-scroll fade-up"
                 data-project-title="${escapeHTML(project.title)}"
                 data-project-description="${escapeHTML(project.modalData.description)}"
                 data-project-features="${escapeHTML(project.modalData.features)}">
                <div class="project-image-area">
                    <div class="image-carousel" data-project-carousel="${project.id}">
                        <div class="carousel-images">${imagesHTML}</div>
                        <button class="carousel-nav prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
                        <button class="carousel-nav next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                <div class="project-info">
                    <h3>${escapeHTML(project.title)}</h3>
                    <p class="project-categories">${categoriesHTML}</p>
                    <p>${escapeHTML(project.shortDescription)}</p>
                    <div class="project-technologies">${technologiesHTML}</div>
                    <div class="project-links">
                        <button class="btn btn-secondary btn-small view-project-details">View Details</button>
                        <a href="${escapeHTML(project.githubUrl)}" class="btn btn-outline btn-small" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>
                    </div>
                </div>
            </div>
        `;
    };

    const loadProjects = async () => {
        const projectsGrid = select('.projects-grid');
        const featuredProjectWrapper = select('.featured-project-wrapper');

        if (!projectsGrid || !featuredProjectWrapper) return;

        try {
            const response = await fetch('/.netlify/functions/getData?file=projects.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const projects = await response.json();

            // Find the featured project
            const featuredProject = projects.find(p => p.featured);
            const regularProjects = projects.filter(p => !p.featured);

            // Render the featured project
            if (featuredProject) {
                const featuredImagesHTML = featuredProject.imageSrcs.map((src, index) => 
                    `<img src="${escapeHTML(src)}" alt="${escapeHTML(featuredProject.title)} Screenshot ${index + 1}" class="carousel-image ${index === 0 ? 'active' : ''}">`
                ).join('');
                const featuredCategoriesHTML = featuredProject.categories.map(cat => `<span class="category-tag">${escapeHTML(cat)}</span>`).join('');
                const featuredTechnologiesHTML = featuredProject.technologies.map(tech => `<span>${escapeHTML(tech)}</span>`).join('');

                featuredProjectWrapper.innerHTML = `
                    <h3>Featured Project: <span class="highlight">${escapeHTML(featuredProject.title)}</span></h3>
                    <div class="featured-project-content">
                        <div class="featured-project-image-area">
                            <div class="image-carousel" data-project-carousel="featured">
                                <div class="carousel-images">${featuredImagesHTML}</div>
                                <button class="carousel-nav prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
                                <button class="carousel-nav next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
                            </div>
                        </div>
                        <div class="featured-project-details">
                            <p class="project-categories">${featuredCategoriesHTML}</p>
                            <h4>${escapeHTML(featuredProject.title)}</h4>
                            <p>${escapeHTML(featuredProject.modalData.description)}</p>
                            <div class="project-technologies">${featuredTechnologiesHTML}</div>
                            <div class="project-links">
                                <button class="btn btn-primary view-project-details">View Details</button>
                                <a href="${escapeHTML(featuredProject.githubUrl)}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> Explore on GitHub</a>
                            </div>
                        </div>
                    </div>
                `;
                 // Add data attributes to the wrapper for the modal
                featuredProjectWrapper.setAttribute('data-project-title', escapeHTML(featuredProject.title));
                featuredProjectWrapper.setAttribute('data-project-description', escapeHTML(featuredProject.modalData.description));
                featuredProjectWrapper.setAttribute('data-project-features', escapeHTML(featuredProject.modalData.features));
            }

            // Render the rest of the projects
            projectsGrid.innerHTML = regularProjects.map(renderProjectCard).join('');
            
            // Re-initialize all functionalities that depend on the dynamic content
            selectAll('.image-carousel').forEach(initializeProjectCarousel);
            initializeProjectFiltering();
            initializeProjectModal();

        } catch (error) {
            console.error("Failed to load projects:", error);
            projectsGrid.innerHTML = '<p class="error-message">Could not load projects. Please try again later.</p>';
            featuredProjectWrapper.innerHTML = '';
        }
    };

    // Initial load
    loadProjects();


    // --- Project Details Modal ---
    const initializeProjectModal = () => {
        const projectModal = select('#projectModal');
        if (!projectModal) return;

        const viewProjectDetailsButtons = selectAll('.view-project-details');
        const closeProjectModalBtn = select('#closeProjectModal');

        viewProjectDetailsButtons.forEach(button => {
            button.addEventListener('click', () => {
                const projectCard = button.closest('.project-card, .featured-project-wrapper');
                
                // Get data from the card
                const title = projectCard.dataset.projectTitle;
                const description = projectCard.dataset.projectDescription;
                const features = projectCard.dataset.projectFeatures;

                // Get technologies from the visible elements
                const techSpans = projectCard.querySelectorAll('.project-technologies span');
                const technologies = Array.from(techSpans).map(span => `<span>${span.innerHTML}</span>`).join('');
                
                // Populate modal
                select('#projectModalTitle').textContent = title;
                select('#projectModalDescription').textContent = description;
                
                const featuresList = select('#projectModalFeatures');
                featuresList.innerHTML = ''; // Clear previous features
                if (features) {
                    // The 'features' variable contains an HTML string that was safely escaped
                    // and stored in a data attribute. To render it correctly, we must "un-escape" it.
                    // Using DOMParser is the standard and safe way to decode HTML entities.
                    const unescapedFeatures = new DOMParser().parseFromString(features, "text/html").documentElement.textContent;
                    
                    // Now we can safely set the innerHTML with the decoded content.
                    // This assumes the original data in projects.json is trusted and formatted correctly with <li> tags.
                    featuresList.innerHTML = unescapedFeatures;
                }

                select('#projectModalTechnologies').innerHTML = technologies.replace(/<span>/g, '<span class="skill-tag">');

                // Show modal
                projectModal.style.display = 'flex';
                setTimeout(() => projectModal.classList.add('active'), 10);
                document.body.style.overflow = 'hidden';
            });
        });

        const closeProjectModal = () => {
            projectModal.classList.remove('active');
            setTimeout(() => {
                projectModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        };

        closeProjectModalBtn.addEventListener('click', closeProjectModal);

        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeProjectModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.classList.contains('active')) {
                closeProjectModal();
            }
        });
    };

    // --- Email Obfuscation ---
    const emailHolder = select('.contact-email-address');
    if (emailHolder) {
        const user = 'dmflorencio.main';
        const domain = 'gmail.com';
        // Check if it's the specific placeholder before changing
        if (emailHolder.textContent.includes('[email protected]')) {
             emailHolder.textContent = `${user}@${domain}`;
        }
    }

    // --- Dynamic Year in Footer ---
    const yearSpan = select('#currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Copy Email to Clipboard ---
    const emailLink = select('#emailLink');
    const emailCopyFeedback = select('#emailCopyFeedback');

    if (emailLink && emailCopyFeedback) {
        emailLink.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent mailto link from opening immediately
            const emailAddress = this.textContent;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(emailAddress).then(() => {
                    emailCopyFeedback.classList.add('visible');
                    setTimeout(() => {
                        emailCopyFeedback.classList.remove('visible');
                    }, 2000); // Hide feedback after 2 seconds
                }).catch(err => {
                    console.warn('Could not copy email: ', err);
                    // Fallback or alternative action if copy fails (e.g., open mailto)
                    window.location.href = `mailto:${emailAddress}`;
                });
            } else {
                // Fallback for older browsers or if clipboard API is not available
                console.warn('Clipboard API not available. Opening mailto link.');
                window.location.href = `mailto:${emailAddress}`;
            }
        });
    }

    // --- About Me Section Tabs ---
    const aboutTabsNav = select('.about-tabs-nav');
    if (aboutTabsNav) {
        const tabLinks = selectAll('.tab-link', aboutTabsNav);
        const aboutTabsContent = select('.about-tabs-content');
        const tabPanes = selectAll('.tab-pane', aboutTabsContent);

        tabLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.dataset.target;

                // Only process if this is an about tab (not a skills tab)
                if (!aboutTabsContent || !aboutTabsContent.contains(select('#' + targetId))) {
                    return; // This is not an about tab, let Skills tabs handle it
                }

                // Update button active states
                tabLinks.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');

                // Update content pane visibility
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === targetId) {
                        pane.classList.add('active');
                    }
                });
            });
        });
    }

    // --- Skills Section Tabs ---
    const skillsTabsNav = select('.skills-tabs-nav');
    if (skillsTabsNav) {
        const skillsTabLinks = selectAll('.tab-link', skillsTabsNav);
        const skillsTabsContent = select('.skills-tabs-content');
        const skillsTabPanes = selectAll('.tab-pane', skillsTabsContent);

        // Skills content mapping
        const skillsContentMap = {
            'skills-pane-frontend': 'skills/frontend-skills.html',
            'skills-pane-backend': 'skills/backend-skills.html',
            'skills-pane-sysadmin': 'skills/sysadmin-skills.html',
            'skills-pane-devops': 'skills/data-science-skills.html',
            'skills-pane-ai': 'skills/ai-skills.html'
        };

        // Function to load skills content
        const loadSkillsContent = async (targetId, contentContainer) => {
            const contentFile = skillsContentMap[targetId];
            if (!contentFile) return;

            try {
                const response = await fetch(contentFile);
                if (response.ok) {
                    const content = await response.text();
                    contentContainer.innerHTML = content;

                    // Apply dynamic styles for data science dashboard after content is loaded
                    if (targetId === 'skills-pane-devops') { // data science dashboard
                        const chartBars = contentContainer.querySelectorAll('.chart-bar');
                        chartBars.forEach(bar => {
                            const height = bar.dataset.chartHeight;
                            if (height) {
                                bar.style.setProperty('--dynamic-height', `${height}%`);
                            }
                        });

                        const sparklineBars = contentContainer.querySelectorAll('.sparkline-bar');
                        sparklineBars.forEach(bar => {
                            const height = bar.dataset.sparklineHeight;
                            if (height) {
                                bar.style.setProperty('--dynamic-height', `${height}%`);
                            }
                        });

                        const progressCircles = contentContainer.querySelectorAll('.progress-circle');
                        progressCircles.forEach(circle => {
                            const progress = circle.dataset.progressValue;
                            if (progress) {
                                circle.style.setProperty('--progress', `${progress}%`);
                            }
                        });

                        const lineSegments = contentContainer.querySelectorAll('.line-segment');
                        lineSegments.forEach(segment => {
                            const height = segment.dataset.lineHeight;
                            if (height) {
                                segment.style.setProperty('--dynamic-height', `${height}%`);
                            }
                        });

                        const qualityBars = contentContainer.querySelectorAll('.quality-bar');
                        qualityBars.forEach(bar => {
                            const width = bar.dataset.qualityWidth;
                            if (width) {
                                bar.style.setProperty('--dynamic-width', `${width}%`);
                            }
                        });
                    }

                    // Apply dynamic styles for AI/ML Intelligence Hub after content is loaded
                    if (targetId === 'skills-pane-ai') {
                        const proficiencyBars = contentContainer.querySelectorAll('.tech-proficiency');
                        proficiencyBars.forEach(bar => {
                            const level = bar.dataset.level;
                            if (level) {
                                bar.style.setProperty('--proficiency-level', `${level}%`);
                            }
                        });
                    }

                } else {
                    throw new Error(`Failed to load ${contentFile}`);
                }
            } catch (error) {
                console.error('Error loading skills content:', error);
                contentContainer.innerHTML = `
                    <div class="loading-placeholder">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Failed to load content. Please try again.</p>
                    </div>
                `;
            }
        };

        skillsTabLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.dataset.target;

                // Only process if this is a skills tab
                if (!skillsTabsContent || !skillsTabsContent.contains(select('#' + targetId))) {
                    return; // This is not a skills tab
                }

                // Update button active states
                skillsTabLinks.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');

                // Update content pane visibility
                skillsTabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === targetId) {
                        pane.classList.add('active');
                        
                        // Load content if not already loaded
                        const contentContainer = pane.querySelector('.content-card');
                        if (contentContainer && contentContainer.querySelector('.loading-placeholder')) {
                            loadSkillsContent(targetId, contentContainer);
                        }
                    }
                });
            });
        });

        // Load initial content for the active tab
        const activeTab = skillsTabsNav.querySelector('.tab-link.active');
        if (activeTab) {
            const targetId = activeTab.dataset.target;
            const activePane = select('#' + targetId);
            if (activePane) {
                const contentContainer = activePane.querySelector('.content-card');
                if (contentContainer) {
                    loadSkillsContent(targetId, contentContainer);
                }
            }
        }
    }

    // --- Certification Details Modal Functionality ---
    const certificationModal = select('#certificationModal');
    const closeCertModalBtn = select('#closeCertModal');
    const viewCertDetailsButtons = selectAll('.view-cert-details');

    if (certificationModal && closeCertModalBtn) {
        // Open certification modal
        viewCertDetailsButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const certCard = this.closest('.certification-card');
                
                if (certCard) {
                    // Get certification data from data attributes
                    const certData = {
                        title: certCard.dataset.certTitle || 'N/A',
                        issuer: certCard.dataset.certIssuer || 'N/A',
                        date: certCard.dataset.certDate || 'N/A',
                        expiry: certCard.dataset.certExpiry || 'N/A',
                        id: certCard.dataset.certId || 'N/A',
                        description: certCard.dataset.certDescription || 'No description available.',
                        skills: certCard.dataset.certSkills || ''
                    };

                    // Populate modal with certification data
                    populateCertificationModal(certData);
                    
                    // Show modal
                    certificationModal.style.display = 'flex';
                    setTimeout(() => {
                        certificationModal.classList.add('active');
                    }, 10);
                    
                    // Prevent body scroll
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close modal function
        function closeCertificationModal() {
            certificationModal.classList.remove('active');
            setTimeout(() => {
                certificationModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }

        // Close modal on close button click
        closeCertModalBtn.addEventListener('click', closeCertificationModal);

        // Close modal on overlay click
        certificationModal.addEventListener('click', function(e) {
            if (e.target === certificationModal) {
                closeCertificationModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && certificationModal.classList.contains('active')) {
                closeCertificationModal();
            }
        });

        // Function to populate modal with certification data
        function populateCertificationModal(certData) {
            // Update modal title
            const modalTitle = select('#certModalTitle');
            if (modalTitle) modalTitle.textContent = certData.title;

            // Update certification details
            const certTitle = select('#certModalCertTitle');
            const certIssuer = select('#certModalIssuer');
            const certDate = select('#certModalDate');
            const certExpiry = select('#certModalExpiry');
            const certId = select('#certModalId');
            const certDescription = select('#certModalDescription');
            const certSkills = select('#certModalSkills');

            if (certTitle) certTitle.textContent = certData.title;
            if (certIssuer) certIssuer.textContent = certData.issuer;
            if (certDate) certDate.textContent = certData.date;
            if (certExpiry) certExpiry.textContent = certData.expiry;
            if (certId) certId.textContent = certData.id;

            // Format and display description with course formatting
            if (certDescription && certData.description) {
                const description = certData.description;
                
                // Check if description contains course information
                if (description.includes('|COURSES:|')) {
                    const parts = description.split('|COURSES:|');
                    const intro = parts[0].trim();
                    const remainingParts = parts[1].split('|');
                    
                    // Extract courses (lines that start with •)
                    const courses = [];
                    const otherContent = [];
                    
                    remainingParts.forEach(part => {
                        const trimmed = part.trim();
                        if (trimmed.startsWith('•')) {
                            courses.push(trimmed.substring(1).trim()); // Remove the bullet point
                        } else if (trimmed) {
                            otherContent.push(trimmed);
                        }
                    });
                    
                    // Build formatted HTML
                    let formattedHtml = `<p>${escapeHTML(intro)}</p>`;
                    
                    if (courses.length > 0) {
                        formattedHtml += '<div class="courses-section"><h5><i class="fas fa-list-ol"></i> Courses Completed:</h5><ol class="courses-list">';
                        courses.forEach(course => {
                            formattedHtml += `<li>${escapeHTML(course)}</li>`;
                        });
                        formattedHtml += '</ol></div>';
                    }
                    
                    // Add any remaining content
                    otherContent.forEach(content => {
                        if (content) {
                            formattedHtml += `<p>${escapeHTML(content)}</p>`;
                        }
                    });
                    
                    certDescription.innerHTML = formattedHtml;
                } else {
                    // Standard description without special formatting
                    certDescription.textContent = description;
                }
            }

            // Handle skills
            if (certSkills && certData.skills) {
                const skillsArray = certData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
                if (skillsArray.length > 0) {
                    certSkills.innerHTML = skillsArray.map(skill => 
                        `<span class="skill-tag">${escapeHTML(skill)}</span>`
                    ).join('');
                } else {
                    certSkills.innerHTML = '<span class="skill-tag">Not specified</span>';
                }
            }
        }
    }

    // --- End Certification Details Modal ---

    // --- Blog Modal Functionality ---
    const blogModal = select('#blogModal');
    const openBlogModalBtn = select('#openBlogModalBtn');
    const closeBlogModalBtn = select('#closeBlogModalBtn');
    const blogTopicsList = select('.blog-topics-list');
    const blogMainContentArea = select('.blog-main-content-area');

    let allBlogPosts = []; // Cache for fetched blog data

    /**
     * Fetches blog posts from the JSON file.
     * Returns cached data if available, otherwise fetches and caches.
     * @async
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of blog post objects.
     */
    const fetchBlogPosts = async () => {
        if (allBlogPosts.length > 0) {
            return allBlogPosts; // Return cached data
        }
        try {
            const response = await fetch('/.netlify/functions/getData?file=blogs.json'); // Ensure blogs.json is in the correct path
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allBlogPosts = await response.json();
            return allBlogPosts;
        } catch (error) {
            console.error("Could not fetch blog posts:", error);
            if (blogMainContentArea) {
                blogMainContentArea.innerHTML = `<p class="error-message">Sorry, couldn't load blog posts at the moment. Please try again later.</p>`;
                blogMainContentArea.classList.add('content-visible'); // Make error visible
            }
            return []; // Return empty array on failure
        }
    };

    /**
     * Populates the blog sidebar with topic links from the fetched posts.
     * @param {Array<Object>} posts - Array of blog post objects.
     */
    const populateBlogSidebar = (posts) => {
        if (!blogTopicsList) return;

        blogTopicsList.innerHTML = ''; // Clear existing links before populating

        posts.forEach(post => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#'; // Prevent page jump
            link.textContent = post.title;
            link.setAttribute('data-blog-id', post.id);
            link.classList.add('blog-topic-link');

            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Remove active class from all links
                selectAll('.blog-topic-link', blogTopicsList).forEach(l => l.classList.remove('active'));
                // Add active class to the clicked link
                link.classList.add('active');
                renderFullBlogPost(post.id);
            });

            listItem.appendChild(link);
            blogTopicsList.appendChild(listItem);
        });
    };

    /**
     * Renders the full content of a selected blog post into the main content area.
     * @param {string} blogId - The ID of the blog post to render.
     */
    const renderFullBlogPost = (blogId) => {
        if (!blogMainContentArea) return;

        // Clear previous content with a fade-out effect
        blogMainContentArea.classList.remove('content-visible');

        // Delay rendering new content to allow fade-out transition
        setTimeout(() => {
            const post = allBlogPosts.find(p => p.id === blogId);
            if (!post) {
                blogMainContentArea.innerHTML = `<p class="error-message">Blog post not found.</p>`;
                blogMainContentArea.classList.add('content-visible');
                return;
            }

            // Programmatically create header elements for better security and control
            const article = document.createElement('article');
            article.className = 'full-blog-content';
            article.id = `blog-post-${escapeHTML(post.id)}`; // Escape ID just in case

            const header = document.createElement('header');
            header.className = 'full-blog-header';

            const h2 = document.createElement('h2');
            // ID for h2 can be used for aria-labelledby
            h2.id = `blog-title-${escapeHTML(post.id)}`; // Escape ID
            h2.textContent = post.title; // textContent is inherently XSS-safe
            header.appendChild(h2);
            article.setAttribute('aria-labelledby', h2.id);


            const meta = document.createElement('p');
            meta.className = 'blog-meta-full';
            const dateSpan = document.createElement('span');
            dateSpan.className = 'date';
            dateSpan.textContent = post.date; // XSS-safe
            const authorSpan = document.createElement('span');
            authorSpan.className = 'author';
            authorSpan.textContent = `By ${post.author}`; // XSS-safe
            meta.appendChild(dateSpan);
            meta.appendChild(document.createTextNode(' | '));
            meta.appendChild(authorSpan);
            header.appendChild(meta);
            article.appendChild(header);

            if (post.mainImage && post.mainImage.src) {
                const mainImg = document.createElement('img');
                mainImg.src = post.mainImage.src; // src attribute is generally safe from JS execution in modern browsers
                mainImg.alt = escapeHTML(post.mainImage.alt || `Main image for ${post.title}`); // Escape alt text
                mainImg.className = 'full-blog-image';
                mainImg.loading = 'lazy'; // Add lazy loading
                article.appendChild(mainImg);
            }

            // For the rest of the content, build HTML string with careful escaping
            let htmlContentBody = '';
            post.content.forEach(item => {
                switch (item.type) {
                    case 'paragraph':
                        htmlContentBody += `<p>${escapeHTML(item.text)}</p>`;
                        break;
                    case 'heading':
                        const level = parseInt(item.level, 10);
                        const safeLevel = (level >= 1 && level <= 6) ? level : 4; // Default to h4 if invalid
                        htmlContentBody += `<h${safeLevel}>${escapeHTML(item.text)}</h${safeLevel}>`;
                        break;
                    case 'image':
                        let sanitizedSrc = 'https://via.placeholder.com/300x200?text=Invalid+Image'; // Default placeholder
                        if (typeof item.src === 'string') {
                            const url = item.src.toLowerCase();
                            if (url.startsWith('https://') || url.startsWith('http://') || url.startsWith('/') || url.startsWith('data:image')) {
                                // Escape double quotes to prevent breaking out of the src attribute, but leave other characters for valid URLs.
                                sanitizedSrc = item.src.replace(/"/g, '&quot;');
                            }
                        }
                        htmlContentBody += `<div class="protected-image-container"><img src="${sanitizedSrc}" alt="${escapeHTML(item.alt || '')}" class="${item.isInline ? 'full-blog-image-inline' : 'full-blog-image'}"></div>`;
                        break;
                    case 'code':
                        const lang = item.language ? escapeHTML(item.language) : 'plaintext';
                        htmlContentBody += `<pre><code class="language-${lang}">${escapeHTML(item.codeText)}</code></pre>`;
                        break;
                    case 'list':
                        const listTag = (item.listType === 'ol' || item.listType === 'ul') ? item.listType : 'ul'; // Default to ul
                        htmlContentBody += `<${listTag}>`;
                        if (Array.isArray(item.items)) {
                            item.items.forEach(li => {
                                htmlContentBody += `<li>${escapeHTML(li)}</li>`;
                            });
                        }
                        htmlContentBody += `</${listTag}>`;
                        break;
                    case 'blockquote':
                        htmlContentBody += `<blockquote><p>${escapeHTML(item.text)}</p></blockquote>`;
                        break;
                    default:
                        console.warn('Unknown blog content type:', item.type);
                }
            });

            // Append the dynamically generated body HTML to the article
            // Create a temporary div to parse the htmlContentBody string
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContentBody;
            // Append child nodes from tempDiv to article
            while (tempDiv.firstChild) {
                article.appendChild(tempDiv.firstChild);
            }

            // Clear the main content area and append the new article
            blogMainContentArea.innerHTML = '';
            blogMainContentArea.appendChild(article);

            // Scroll to top of content area
            blogMainContentArea.scrollTop = 0;
            // Fade in new content
            blogMainContentArea.classList.add('content-visible');

            // If you use a syntax highlighter (e.g., Prism.js), re-initialize it here:
            if (typeof Prism !== 'undefined' && blogMainContentArea.querySelector('pre code')) {
                 Prism.highlightAllUnder(blogMainContentArea);
            }
        }, 250); // Match this delay with CSS transition duration for fade-out
    };

    // Initialize Blog Modal if elements exist
    if (blogModal && openBlogModalBtn && closeBlogModalBtn && blogTopicsList && blogMainContentArea) {
        /**
         * Opens the blog modal, fetches posts, and populates the UI.
         * @async
         */
        const openModal = async () => {
            blogModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll

            const posts = await fetchBlogPosts();
            if (posts.length > 0) {
                populateBlogSidebar(posts);
                // Activate and render the first blog post by default
                const firstLink = select('.blog-topic-link', blogTopicsList);
                if (firstLink) {
                    firstLink.classList.add('active');
                    renderFullBlogPost(firstLink.getAttribute('data-blog-id'));
                }
            } else if (allBlogPosts.length === 0) { // If fetch failed and no posts are cached
                // Error message is already handled by fetchBlogPosts if blogMainContentArea exists
                // but ensure content area is visible if it wasn't already.
                if (blogMainContentArea && !blogMainContentArea.classList.contains('content-visible')) {
                    blogMainContentArea.innerHTML = `<p class="error-message">Sorry, couldn't load blog posts at the moment. Please try again later.</p>`;
                    blogMainContentArea.classList.add('content-visible');
                }
            }
        };

        /**
         * Closes the blog modal.
         */
        const closeModal = () => {
            blogModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore background scroll
            if (blogMainContentArea) {
                blogMainContentArea.classList.remove('content-visible'); // Hide content on close
            }
        };

        // Event Listeners for Modal
        openBlogModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });

        closeBlogModalBtn.addEventListener('click', closeModal);

        // Close modal if overlay (the modal itself) is clicked
        blogModal.addEventListener('click', (e) => {
            if (e.target === blogModal) {
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && blogModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // --- Enhanced Hero Section Functionality ---
    const initializeHeroEnhancements = () => {
        // Typing Animation for Code Window
        const codeLines = selectAll('.code-line');
        if (codeLines.length > 0) {
            codeLines.forEach((line, index) => {
                line.style.opacity = '0';
                line.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    line.style.transition = 'all 0.5s ease';
                    line.style.opacity = '1';
                    line.style.transform = 'translateX(0)';
                }, 1000 + (index * 200));
            });
        }

        // Animated Stats Counter
        const statNumbers = selectAll('.stat-number');
        if (statNumbers.length > 0) {
            const animateValue = (element, start, end, duration) => {
                const startTime = performance.now();
                const update = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function (ease-out)
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(start + (end - start) * easeOut);
                    
                    element.textContent = current + '+';
                    
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                };
                requestAnimationFrame(update);
            };

            // Observe stats section for counting animation
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const statNumber = entry.target;
                        const finalValue = parseInt(statNumber.textContent);
                        animateValue(statNumber, 0, finalValue, 2000);
                        statsObserver.unobserve(statNumber);
                    }
                });
            }, { threshold: 0.5 });

            statNumbers.forEach(stat => {
                statsObserver.observe(stat);
            });
        }

        // Interactive Floating Elements
        const floatingElements = selectAll('.floating-element');
        if (floatingElements.length > 0) {
            let mouseX = 0;
            let mouseY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX / window.innerWidth;
                mouseY = e.clientY / window.innerHeight;
            });

            floatingElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const updatePosition = () => {
                    const moveX = (mouseX - 0.5) * 50 * speed;
                    const moveY = (mouseY - 0.5) * 50 * speed;
                    
                    // element.style.transform = `translate(${moveX}px, ${moveY}px)`;
                    element.style.setProperty('--move-x', `${moveX}px`);
                    element.style.setProperty('--move-y', `${moveY}px`);
                    requestAnimationFrame(updatePosition);
                };
                updatePosition();
            });
        }

        // Gradient Orbs Interactive Effect
        const gradientOrbs = selectAll('.gradient-orb');
        if (gradientOrbs.length > 0) {
            document.addEventListener('mousemove', (e) => {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;

                gradientOrbs.forEach((orb, index) => {
                    const speed = 0.3 + (index * 0.1);
                    const moveX = (mouseX - 0.5) * 100 * speed;
                    const moveY = (mouseY - 0.5) * 100 * speed;
                    
                    // orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
                    orb.style.setProperty('--orb-move-x', `${moveX}px`);
                    orb.style.setProperty('--orb-move-y', `${moveY}px`);
                });
            });
        }

        // Enhanced Button Interactions
        const heroButtons = selectAll('.hero-section .btn');
        heroButtons.forEach(button => {
            button.classList.add('btn-hover-transform');
            button.addEventListener('mouseenter', () => {
                // button.style.transform = 'translateY(-3px) scale(1.05)';
                button.classList.add('active');
                
                // Create ripple effect
                const ripple = document.createElement('div');
                ripple.classList.add('ripple-effect'); // Use the class
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
            });

            button.addEventListener('mouseleave', () => {
                // button.style.transform = '';
                button.classList.remove('active');
            });
        });

        // Scroll Progress for Hero Section
        const heroSection = select('.hero-section');
        if (heroSection) {
            const updateScrollProgress = () => {
                const scrolled = window.pageYOffset;
                const heroHeight = heroSection.offsetHeight;
                const progress = Math.min(scrolled / heroHeight, 1);
                
                // Apply parallax effect to background elements
                const bgElements = select('.hero-bg-elements');
                if (bgElements) {
                    bgElements.style.transform = `translateY(${scrolled * 0.5}px)`; // This is a direct transform, CSP should be ok with this.
                }
                
                // Fade out hero content as user scrolls
                const heroContent = select('.hero-content-wrapper');
                if (heroContent) {
                    heroContent.style.opacity = 1 - progress;
                    // heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                    heroContent.style.setProperty('--translate-y', `${scrolled * 0.3}px`);
                }
            };

            window.addEventListener('scroll', updateScrollProgress);
        }

        // Dynamic Theme Based on Time
        const applyTimeBasedTheme = () => {
            const hour = new Date().getHours();
            const heroSection = select('.hero-section');
            
            if (heroSection) {
                if (hour >= 20 || hour <= 6) {
                    // Night theme - deeper blues
                    heroSection.style.setProperty('--dynamic-primary', '#1a2332');
                    heroSection.style.setProperty('--dynamic-secondary', '#0f1419');
                } else if (hour >= 7 && hour <= 11) {
                    // Morning theme - lighter blues
                    heroSection.style.setProperty('--dynamic-primary', '#2c3e50');
                    heroSection.style.setProperty('--dynamic-secondary', '#34495e');
                } else if (hour >= 12 && hour <= 17) {
                    // Afternoon theme - warmer tones
                    heroSection.style.setProperty('--dynamic-primary', '#2c3e50');
                    heroSection.style.setProperty('--dynamic-secondary', '#2c4055');
                } else {
                    // Evening theme - deeper tones
                    heroSection.style.setProperty('--dynamic-primary', '#1e3a4a');
                    heroSection.style.setProperty('--dynamic-secondary', '#1a2530');
                }
            }
        };

        applyTimeBasedTheme();
    };

    // Initialize hero enhancements
    initializeHeroEnhancements();

    // Remove dynamic ripple animation keyframes as they are now in CSS
    // const rippleStyle = document.createElement('style');
    // rippleStyle.textContent = `
    //     @keyframes ripple {
    //         to {
    //             transform: translate(-50%, -50%) scale(4);
    //             opacity: 0;
    //         }
    //     }
    // `;
    // document.head.appendChild(rippleStyle);

    // Initialize skills tabs when DOM is loaded
    // Add a small delay to ensure all elements are properly rendered
    setTimeout(() => {
        // Skills tabs removed - section no longer exists
    }, 200);

    // Modal Logic
    const emailContactMethod = document.getElementById('emailContactMethod');
    const emailModal = document.getElementById('emailModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const contactForm = document.getElementById('contactForm');
    const formSuccessMessage = document.getElementById('formSuccessMessage');

    // Add silent bot protection: disable submit button until user interaction
    if (contactForm) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.setAttribute('disabled', 'true');
            submitButton.style.cursor = 'not-allowed';
            submitButton.style.opacity = '0.7';
        }

        const enableSubmit = () => {
            if (submitButton && submitButton.hasAttribute('disabled')) {
                submitButton.removeAttribute('disabled');
                submitButton.style.cursor = 'pointer';
                submitButton.style.opacity = '1';
                contactForm.removeEventListener('mousemove', enableSubmit);
                contactForm.removeEventListener('keydown', enableSubmit);
            }
        };

        contactForm.addEventListener('mousemove', enableSubmit, { once: true });
        contactForm.addEventListener('keydown', enableSubmit, { once: true });
    }


    const openModal = () => {
        if (emailModal) emailModal.classList.add('active');
    };

    const closeModal = () => {
        if (emailModal) emailModal.classList.remove('active');
    };

    if (emailContactMethod) {
        emailContactMethod.addEventListener('click', openModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (emailModal) {
        emailModal.addEventListener('click', (e) => {
            if (e.target === emailModal) {
                closeModal();
            }
        });
    }

    // Netlify Form AJAX submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString(),
            })
            .then(() => {
                contactForm.style.display = 'none';
                formSuccessMessage.style.display = 'block';
            })
            .catch((error) => alert(error));
        });
    }

    // --- Global Content Protection ---
    // Disable right-click context menu
    document.addEventListener('contextmenu', event => {
        if (!document.body.classList.contains('security-features-disabled')) {
            event.preventDefault();
        }
    });

    // Disable common copy/view-source keyboard shortcuts
    document.addEventListener('keydown', e => {
        if (document.body.classList.contains('security-features-disabled')) {
            return; // Do nothing if security is disabled
        }
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+C, Ctrl+S, Ctrl+U
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && ['I', 'J'].includes(e.key.toUpperCase())) ||
            (e.ctrlKey && ['C', 'S', 'U'].includes(e.key.toUpperCase()))
        ) {
            e.preventDefault();
        }
    });

    // --- Dev Security Toggle ---
    const securityToggleButton = document.getElementById('securityToggleBtn');
    if (securityToggleButton) {
        securityToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('security-features-disabled');
            
            // Update button text and class
            const isSecurityDisabled = document.body.classList.contains('security-features-disabled');
            securityToggleButton.textContent = isSecurityDisabled ? 'Security OFF' : 'Security ON';
            securityToggleButton.classList.toggle('disabled', isSecurityDisabled);
        });
    }

    // Resume Modal Logic - KEEP THIS NEW IMPLEMENTATION
    const resumeModal = document.getElementById('resumeModal');
    const openResumeBtn = document.getElementById('viewResumeBtn');
    const closeResumeBtn = document.getElementById('closeResumeModal');

    if (openResumeBtn && resumeModal && closeResumeBtn) {
        openResumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resumeModal.classList.add('active');
            fetchResumeData();
        });

        closeResumeBtn.addEventListener('click', () => {
            resumeModal.classList.remove('active');
        });

        // Close modal if backdrop is clicked
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                resumeModal.classList.remove('active');
            }
        });
    }
});

/**
 * Escapes HTML characters to prevent XSS when inserting user-generated text.
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string.
 */
const escapeHTML = (str) => {
    if (typeof str !== 'string') return '';
    // Ensure all specified characters are replaced.
    return str.replace(/[&<>"']/g, function (match) {
        const escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;' // Using &#39; for ' is generally preferred over &apos;
        };
        return escape[match];
    });
};

/**
 * Fetches resume data from resume.json and renders it.
 */
async function fetchResumeData() {
    const resumeContainer = document.getElementById('resumeContainer');
    if (!resumeContainer) return;

    // Show loading state only if content isn't already loaded
    if (!resumeContainer.querySelector('.resume-view')) {
        resumeContainer.innerHTML = `
            <div class="loading-placeholder">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading Resume...</p>
            </div>
        `;
    }

    try {
        const response = await fetch('/.netlify/functions/getData?file=resume.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const resumeData = await response.json();
        renderResume(resumeData);
    } catch (error) {
        console.error("Error fetching or parsing resume data:", error);
        if (resumeContainer) {
            resumeContainer.innerHTML = '<p style="text-align: center; color: red;">Error loading resume. Please try again later.</p>';
        }
    }
}

/**
 * Renders the entire resume in the modal.
 * @param {object} data - The resume data from resume.json.
 */
function renderResume(data) {
    const resumeContainer = document.getElementById('resumeContainer');
    if (!resumeContainer) return;

    const headerHTML = `
        <div class="resume-header">
            <h1 class="name">${escapeHTML(data.name)}</h1>
            <p class="title">${escapeHTML(data.title)}</p>
            <div class="contact-info">
                ${data.contact.email ? `<span><i class="fas fa-envelope"></i> <a href="mailto:${escapeHTML(data.contact.email)}">${escapeHTML(data.contact.email)}</a></span>` : ''}
                ${data.contact.phone ? `<span><i class="fas fa-phone"></i> ${escapeHTML(data.contact.phone)}</span>` : ''}
                ${data.contact.linkedin ? `<span><i class="fab fa-linkedin"></i> <a href="${escapeHTML(data.contact.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a></span>` : ''}
                ${data.contact.github ? `<span><i class="fab fa-github"></i> <a href="${escapeHTML(data.contact.github)}" target="_blank" rel="noopener noreferrer">GitHub</a></span>` : ''}
                ${data.contact.location ? `<span><i class="fas fa-map-marker-alt"></i> ${escapeHTML(data.contact.location)}</span>` : ''}
            </div>
        </div>
    `;

    const summaryHTML = data.summary ? `
        <div class="resume-section resume-summary">
            <h2 class="resume-section-title">Professional Summary</h2>
            <p>${escapeHTML(data.summary)}</p>
        </div>
    ` : '';

    const experienceHTML = data.experience && data.experience.length > 0 ? `
        <div class="resume-section resume-experience">
            <h2 class="resume-section-title">Work Experience</h2>
            ${data.experience.map(job => `
                <div class="chrono-item">
                    <div class="chrono-item-header">
                        <h3 class="item-title">${escapeHTML(job.title)}</h3>
                        <span class="item-dates">${escapeHTML(job.dates)}</span>
                    </div>
                    <p class="item-subtitle">${escapeHTML(job.company)} | ${escapeHTML(job.location)}</p>
                    <ul class="item-details">
                        ${(job.description || []).map(desc => `<li>${escapeHTML(desc)}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
    ` : '';

    const projectsHTML = data.projects && data.projects.length > 0 ? `
        <div class="resume-section resume-projects">
            <h2 class="resume-section-title">Projects</h2>
            ${data.projects.map(project => `
                <div class="extra-item">
                    <h3 class="extra-item-header">${escapeHTML(project.name)}</h3>
                    <p class="item-subtitle">${(project.technologies || []).map(t => escapeHTML(t)).join(', ')}</p>
                    <div class="item-details">${escapeHTML(project.description || '')}</div>
                </div>
            `).join('')}
        </div>
    ` : '';

    const educationHTML = data.education && data.education.length > 0 ? `
        <div class="resume-section resume-education">
            <h2 class="resume-section-title">Education</h2>
            ${data.education.map(edu => `
                <div class="chrono-item">
                    <div class="chrono-item-header">
                        <h3 class="item-title">${escapeHTML(edu.degree)}</h3>
                        <span class="item-dates">${escapeHTML(edu.graduationDate)}</span>
                    </div>
                    <p class="item-subtitle">${escapeHTML(edu.institution)}</p>
                     <ul class="item-details">
                        ${(edu.details || []).map(detail => `<li>${escapeHTML(detail)}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
    ` : '';

    const skillsHTML = data.skills && data.skills.length > 0 ? `
        <div class="resume-section resume-skills">
            <h2 class="resume-section-title">Skills</h2>
            <ul class="skills-list">
                ${data.skills.map(skill => `<li>${escapeHTML(skill)}</li>`).join('')}
            </ul>
        </div>
    ` : '';
    
    const certificationsHTML = data.certifications && data.certifications.length > 0 ? `
        <div class="resume-section resume-certifications">
            <h2 class="resume-section-title">Certifications</h2>
            ${data.certifications.map(cert => `
                 <div class="extra-item">
                    <h3 class="extra-item-header">${escapeHTML(cert.title)}</h3>
                    <p class="item-subtitle">${escapeHTML(cert.issuer)} (${escapeHTML(cert.date)})</p>
                </div>
            `).join('')}
        </div>
    ` : '';

    resumeContainer.innerHTML = `
        <div class="resume-view">
            ${headerHTML}
            ${summaryHTML}
            ${experienceHTML}
            ${projectsHTML}
            ${educationHTML}
            ${skillsHTML}
            ${certificationsHTML}
        </div>
    `;
} 