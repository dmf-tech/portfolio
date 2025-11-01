document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Helper function to select elements
    const select = (selector, scope = document) => scope.querySelector(selector);
    const selectAll = (selector, scope = document) => scope.querySelectorAll(selector);

    // --- Header Scroll Effect ---
    const header = select('#header');
    if (header) {
        let ticking = false;
        const headerScrolled = () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            ticking = false;
        };
        const requestTick = () => {
            if (!ticking) {
                window.requestAnimationFrame(headerScrolled);
                ticking = true;
            }
        };
        window.addEventListener('load', headerScrolled);
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // --- Mobile Navigation Toggle ---
    const hamburger = select('.hamburger');
    const navMenu = select('.nav-menu');
    const backdrop = select('.mobile-nav-backdrop');

    if (hamburger && navMenu) {
        const toggleMobileNav = () => {
            const isActive = navMenu.classList.contains('active');
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('mobile-nav-active');
            if (backdrop) {
                backdrop.classList.toggle('active');
            }
            const isExpanded = !isActive;
            hamburger.setAttribute('aria-expanded', isExpanded);
        };

        // Click handler
        hamburger.addEventListener('click', toggleMobileNav);

        // Keyboard handlers for hamburger button
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileNav();
            }
        });

        // Close mobile nav when a link is clicked
        selectAll('.nav-menu a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    toggleMobileNav();
                }
            });
        });

        // Close mobile nav on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMobileNav();
            }
        });

        // Close mobile nav on window resize if open
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
                    toggleMobileNav();
                }
            }, 250);
        });

        // Close mobile nav when clicking backdrop or outside
        if (backdrop) {
            backdrop.addEventListener('click', toggleMobileNav);
        }
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target) &&
                !backdrop?.contains(e.target)) {
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
    let scrollTicking = false;
    const requestScrollTick = () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                updateActiveNavLink();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    };
    window.addEventListener('scroll', requestScrollTick, { passive: true });
    window.addEventListener('load', updateActiveNavLink);


    // --- Scroll to Top Button ---
    const scrollToTopBtn = select('#scrollToTopBtn');
    if (scrollToTopBtn) {
        let scrollTopTicking = false;
        const toggleScrollToTopBtn = () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('active');
            } else {
                scrollToTopBtn.classList.remove('active');
            }
            scrollTopTicking = false;
        };
        const requestScrollTopTick = () => {
            if (!scrollTopTicking) {
                window.requestAnimationFrame(toggleScrollToTopBtn);
                scrollTopTicking = true;
            }
        };
        window.addEventListener('scroll', requestScrollTopTick, { passive: true });
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
            threshold: 0.1, // Adjust threshold as needed (0.1 means 10% visible)
            rootMargin: '50px' // Start animation slightly before element enters viewport
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
    experienceCards.forEach((card, index) => {
        const header = card.querySelector('.card-header');
        const content = card.querySelector('.card-content');
        const toggle = header?.querySelector('.expand-toggle');
        
        // Skip first card (DICT) if it has no visible content (new position, no description)
        const isFirstCardWithNoContent = index === 0 && 
                                         (content?.style.display === 'none' || 
                                          !content?.textContent?.trim() ||
                                          content?.querySelector('.achievements-list')?.children.length === 0);
        
        if (header && content && toggle && !isFirstCardWithNoContent) {
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
                if (i === index) {
                    img.classList.add('active');
                }
            });
        }

        // Ensure carousel navigation works regardless of security settings
        if (prevButton) {
            prevButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
                showImage(currentIndex);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
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
    // Initialize carousel only for featured projects (not regular project cards)
    selectAll('.featured-project-wrapper .image-carousel').forEach(carousel => {
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
                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    item.classList.remove('project-hidden');
                                });
                            });
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

    // --- JSON File Verification ---
    const verifyJsonAccess = async () => {
        const files = ['projects.json', 'resume.json'];
        const results = {};
        
        for (const file of files) {
            try {
                const response = await fetch(`/${file}`);
                results[file] = {
                    accessible: response.ok,
                    status: response.status,
                    statusText: response.statusText
                };
                if (response.ok) {
                    console.log(`✅ ${file} is accessible`);
                } else {
                    console.error(`❌ ${file} returned ${response.status}: ${response.statusText}`);
                }
            } catch (error) {
                results[file] = {
                    accessible: false,
                    error: error.message
                };
                console.error(`❌ Error accessing ${file}:`, error.message);
            }
        }
        
        return results;
    };

    // --- Simplified Project Rendering ---
    const createProjectCard = (project) => {
        // Create main project card element
        const projectCard = document.createElement('div');
        projectCard.className = `project-card ${project.filterClasses} animate-on-scroll fade-up`;
        
        // Set data attributes for modal
        // Note: features contains HTML, so we don't escape it - we'll parse and sanitize when displaying
        projectCard.setAttribute('data-project-title', escapeHTML(project.title));
        projectCard.setAttribute('data-project-description', escapeHTML(project.modalData?.description || ''));
        projectCard.setAttribute('data-project-features', project.modalData?.features || '');
        projectCard.setAttribute('data-project-technical', escapeHTML(project.modalData?.technicalDetails || ''));
        projectCard.setAttribute('data-project-implementation', escapeHTML(project.modalData?.implementation || ''));
        projectCard.setAttribute('data-gallery', escapeHTML(JSON.stringify(project.modalData?.gallery || [])));
        projectCard.setAttribute('data-live-url', escapeHTML(project.liveUrl || ''));
        projectCard.setAttribute('data-github-url', escapeHTML(project.githubUrl || ''));
        projectCard.setAttribute('data-technologies', JSON.stringify(project.technologies || []));

        // No image area for regular project cards - images are in modal
        // Create project info area (full-width without image)
        const projectInfo = document.createElement('div');
        projectInfo.className = 'project-info';
        
        // Title
        const title = document.createElement('h3');
        title.textContent = project.title;
        projectInfo.appendChild(title);
        
        // Categories
        if (project.categories && project.categories.length > 0) {
            const categoriesP = document.createElement('p');
            categoriesP.className = 'project-categories';
            project.categories.forEach(cat => {
                const span = document.createElement('span');
                span.className = 'category-tag';
                span.textContent = cat;
                categoriesP.appendChild(span);
            });
            projectInfo.appendChild(categoriesP);
        }
        
        // Description
        const description = document.createElement('p');
        description.textContent = project.shortDescription || '';
        projectInfo.appendChild(description);
        
        // Technologies removed from project cards - only shown in modal
        
        // Links
        const linksDiv = document.createElement('div');
        linksDiv.className = 'project-links';
        
        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'btn btn-secondary btn-small view-project-details';
        detailsBtn.textContent = 'View Details';
        linksDiv.appendChild(detailsBtn);
        
        projectInfo.appendChild(linksDiv);

        // Assemble the card (no image area - cleaner design)
        projectCard.appendChild(projectInfo);
        
        return projectCard;
    };

    const loadProjects = async () => {
        const projectsGrid = select('.projects-grid');
        const featuredProjectWrapper = select('.featured-project-wrapper');

        if (!projectsGrid || !featuredProjectWrapper) {
            console.error('Required project containers not found');
            return;
        }

        try {
            // Rate limiting: Check if we're fetching too frequently (no storage - uses closure)
            const now = Date.now();
            const MIN_FETCH_INTERVAL = 2000; // 2 seconds minimum between fetches
            
            // Use closure variable instead of window storage (more secure)
            if (!loadProjects.lastFetch) {
                loadProjects.lastFetch = 0;
            }
            const timeSinceLastFetch = now - loadProjects.lastFetch;
            
            if (timeSinceLastFetch < MIN_FETCH_INTERVAL) {
                console.warn('Rate limit: Projects fetch throttled');
                return;
            }
            loadProjects.lastFetch = now;
            
            // Use fetch with proper error handling and caching
            const response = await fetch('/projects.json', {
                method: 'GET',
                cache: 'default',
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch projects.json: ${response.status} ${response.statusText}`);
            }
            
            const projects = await response.json();
            
            // Validate response is an array before processing
            if (!Array.isArray(projects) || projects.length === 0) {
                throw new Error('Invalid projects data format or empty array');
            }

            console.log(`Found ${projects.length} projects to render`);

            // Clear existing content
            projectsGrid.innerHTML = '';
            featuredProjectWrapper.innerHTML = '';

            // Find the featured project
            const featuredProject = projects.find(p => p.featured);
            const regularProjects = projects.filter(p => !p.featured);
            
            console.log(`Featured project: ${featuredProject ? featuredProject.title : 'None'}`);
            console.log(`Regular projects: ${regularProjects.length}`);

            // Render the featured project
            if (featuredProject) {
                const featuredImagesHTML = featuredProject.imageSrcs.map((src, index) => 
                    `<img src="${escapeHTML(src)}" alt="${escapeHTML(featuredProject.title)} Screenshot ${index + 1}" class="carousel-image ${index === 0 ? 'active' : ''}">`
                ).join('');
                const featuredCategoriesHTML = featuredProject.categories.map(cat => `<span class="category-tag">${escapeHTML(cat)}</span>`).join('');
                // Technologies removed from featured project preview - only shown in modal

                const featuredContent = document.createElement('div');
                featuredContent.className = 'featured-project-content';

                const featuredImageArea = document.createElement('div');
                featuredImageArea.className = 'featured-project-image-area';
                const featuredCarousel = document.createElement('div');
                featuredCarousel.className = 'image-carousel';
                featuredCarousel.setAttribute('data-project-carousel', 'featured');
                const featuredCarouselImages = document.createElement('div');
                featuredCarouselImages.className = 'carousel-images';
                featuredCarouselImages.innerHTML = featuredImagesHTML;
                const featuredPrevButton = document.createElement('button');
                featuredPrevButton.className = 'carousel-nav prev';
                featuredPrevButton.setAttribute('aria-label', 'Previous image');
                featuredPrevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
                const featuredNextButton = document.createElement('button');
                featuredNextButton.className = 'carousel-nav next';
                featuredNextButton.setAttribute('aria-label', 'Next image');
                featuredNextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';

                featuredCarousel.appendChild(featuredCarouselImages);
                featuredCarousel.appendChild(featuredPrevButton);
                featuredCarousel.appendChild(featuredNextButton);
                featuredImageArea.appendChild(featuredCarousel);

                const featuredProjectDetails = document.createElement('div');
                featuredProjectDetails.className = 'featured-project-details';
                const featuredTitle = document.createElement('h4');
                featuredTitle.textContent = featuredProject.title;
                const featuredDescription = document.createElement('p');
                featuredDescription.textContent = featuredProject.modalData.description;
                const featuredLinks = document.createElement('div');
                featuredLinks.className = 'project-links';
                const featuredViewDetailsBtn = document.createElement('button');
                featuredViewDetailsBtn.className = 'btn btn-primary view-project-details';
                featuredViewDetailsBtn.textContent = 'View Details';

                featuredLinks.appendChild(featuredViewDetailsBtn);
                featuredProjectDetails.appendChild(featuredTitle);
                featuredProjectDetails.appendChild(featuredDescription);
                featuredProjectDetails.appendChild(featuredLinks);

                featuredContent.appendChild(featuredImageArea);
                featuredContent.appendChild(featuredProjectDetails);

                while (featuredProjectWrapper.firstChild) {
                    featuredProjectWrapper.removeChild(featuredProjectWrapper.firstChild);
                }
                featuredProjectWrapper.appendChild(featuredContent);
                 // Add data attributes to the wrapper for the modal
                 // Note: features contains HTML, so we don't escape it - we'll parse and sanitize when displaying
                featuredProjectWrapper.setAttribute('data-project-title', escapeHTML(featuredProject.title));
                featuredProjectWrapper.setAttribute('data-project-description', escapeHTML(featuredProject.modalData.description));
                featuredProjectWrapper.setAttribute('data-project-features', featuredProject.modalData.features || '');
                featuredProjectWrapper.setAttribute('data-project-technical', escapeHTML(featuredProject.modalData.technicalDetails || ''));
                featuredProjectWrapper.setAttribute('data-project-implementation', escapeHTML(featuredProject.modalData.implementation || ''));
                featuredProjectWrapper.setAttribute('data-gallery', escapeHTML(JSON.stringify(featuredProject.modalData.gallery || [])));
                featuredProjectWrapper.setAttribute('data-live-url', escapeHTML(featuredProject.liveUrl || ''));
                featuredProjectWrapper.setAttribute('data-github-url', escapeHTML(featuredProject.githubUrl || ''));
                featuredProjectWrapper.setAttribute('data-technologies', JSON.stringify(featuredProject.technologies || []));
            }

            // Render the rest of the projects
            while (projectsGrid.firstChild) {
                projectsGrid.removeChild(projectsGrid.firstChild);
            }
            
            regularProjects.forEach((project, index) => {
                try {
                    console.log(`Rendering project ${index + 1}: ${project.title}`);
                    const projectCard = createProjectCard(project);
                    projectsGrid.appendChild(projectCard);
                } catch (projectError) {
                    console.error(`Error rendering project ${project.title}:`, projectError);
                }
            });
            
            console.log(`✓ Successfully rendered ${regularProjects.length} regular projects`);
            
            // Re-initialize all functionalities that depend on the dynamic content
            // Initialize carousel only for featured projects (not regular project cards)
            selectAll('.featured-project-wrapper .image-carousel').forEach(initializeProjectCarousel);
            initializeProjectFiltering();
            initializeProjectModal();

            console.log('✓ All projects loaded and initialized successfully');

        } catch (error) {
            console.error("Failed to load projects:", error);
            
            // Show error message in projects grid
            // Safely create error message without innerHTML
            projectsGrid.innerHTML = '';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 2rem; color: #e74c3c;';
            const h3 = document.createElement('h3');
            h3.textContent = 'Unable to Load Projects';
            const p1 = document.createElement('p');
            p1.textContent = 'Could not load projects. Please try again later.';
            const p2 = document.createElement('p');
            p2.style.cssText = 'font-size: 0.9em; color: #7f8c8d;';
            p2.textContent = `Error: ${escapeHTML(error.message)}`;
            errorDiv.appendChild(h3);
            errorDiv.appendChild(p1);
            errorDiv.appendChild(p2);
            projectsGrid.appendChild(errorDiv);
            
            // Clear featured project area
            featuredProjectWrapper.innerHTML = '';
        }
    };

    // Load projects immediately without verification delay
    console.log('🚀 Loading projects immediately...');
    loadProjects().catch(error => {
        console.error('❌ Failed to load projects:', error);
        const projectsGrid = document.querySelector('.projects-grid');
        const featuredWrapper = document.querySelector('.featured-project-wrapper');
        
        if (projectsGrid) {
            // Safely create error message without innerHTML
            projectsGrid.innerHTML = '';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 2rem; color: #e74c3c;';
            const h3 = document.createElement('h3');
            h3.textContent = 'Projects Not Available';
            const p1 = document.createElement('p');
            p1.textContent = 'Unable to load projects data. Please try refreshing the page.';
            const p2 = document.createElement('p');
            p2.style.cssText = 'font-size: 0.9em; color: #7f8c8d;';
            p2.textContent = `Error: ${escapeHTML(error.message)}`;
            errorDiv.appendChild(h3);
            errorDiv.appendChild(p1);
            errorDiv.appendChild(p2);
            projectsGrid.appendChild(errorDiv);
        }
        
        if (featuredWrapper) {
            // Safely create error message without innerHTML
            featuredWrapper.innerHTML = '';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = 'text-align: center; padding: 2rem; color: #e74c3c;';
            const h3 = document.createElement('h3');
            h3.textContent = 'Featured Project Unavailable';
            const p = document.createElement('p');
            p.textContent = 'Could not load featured project.';
            errorDiv.appendChild(h3);
            errorDiv.appendChild(p);
            featuredWrapper.appendChild(errorDiv);
        }
    });


    // --- Project Details Modal ---
    const initializeProjectModal = () => {
        const projectModal = select('#projectModal');
        if (!projectModal) return;

        const viewProjectDetailsButtons = selectAll('.view-project-details');
        const closeProjectModalBtn = select('#closeProjectModal');
        const galleryContainer = select('#projectModalGallery');
                  // Gallery caption removed for cleaner display
        const galleryIndicators = select('#galleryIndicators');
        const prevButton = select('.gallery-nav.prev');
        const nextButton = select('.gallery-nav.next');
        let currentImageIndex = 0;
        let currentGalleryImages = [];

        const showGalleryImage = (index) => {
            if (!currentGalleryImages.length) return;
            
            // Update images
            const images = galleryContainer.querySelectorAll('.gallery-image');
            images.forEach(img => img.classList.remove('active'));
            images[index].classList.add('active');

            // Update indicators
            const indicators = galleryIndicators.querySelectorAll('.gallery-indicator');
            indicators.forEach(ind => ind.classList.remove('active'));
            indicators[index].classList.add('active');

                         // Caption removed for cleaner display

            // Update current index
            currentImageIndex = index;
        };

        const navigateGallery = (direction) => {
            const newIndex = direction === 'next'
                ? (currentImageIndex + 1) % currentGalleryImages.length
                : (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
            showGalleryImage(newIndex);
        };

        // Gallery navigation event listeners
        if (prevButton) {
            prevButton.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateGallery('prev');
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateGallery('next');
            });
        }

        viewProjectDetailsButtons.forEach(button => {
            button.addEventListener('click', () => {
                const projectCard = button.closest('.project-card, .featured-project-wrapper');
                
                // Get data from the card
                // Decode HTML entities to ensure proper display (dataset may not always unescape correctly)
                const title = decodeHTML(projectCard.dataset.projectTitle || '');
                const description = decodeHTML(projectCard.dataset.projectDescription || '');
                const features = projectCard.dataset.projectFeatures || '';
                const technicalDetails = decodeHTML(projectCard.dataset.projectTechnical || '');
                const implementation = decodeHTML(projectCard.dataset.projectImplementation || '');
                const liveUrl = decodeHTML(projectCard.dataset.liveUrl || '');
                const githubUrl = decodeHTML(projectCard.dataset.githubUrl || '');

                // Get technologies from project data (keep as array for proper processing)
                let technologiesArray = [];
                try {
                    // Get technologies from the data attribute
                    const techData = projectCard.dataset.technologies;
                    if (techData) {
                        technologiesArray = JSON.parse(techData);
                    }
                } catch (e) {
                    console.warn('Could not parse technologies data:', e);
                    console.warn('Tech data:', projectCard.dataset.technologies);
                    technologiesArray = [];
                }
                
                // Populate modal
                select('#projectModalTitle').textContent = title; // Keep for compatibility
                select('#projectModalTitleBelow').textContent = title; // New title below gallery
                select('#projectModalDescription').textContent = description;
                
                // Update features - properly handle HTML that already contains <li> tags
                const featuresList = select('#projectModalFeatures');
                featuresList.innerHTML = ''; // Clear previous features
                if (features) {
                    // Check if features already contains HTML tags
                    if (features.trim().startsWith('<li>') || features.includes('<li>')) {
                        // Features already contain HTML - parse and sanitize safely
                        const parser = new DOMParser();
                        const parsed = parser.parseFromString(features, "text/html");
                        const liElements = parsed.querySelectorAll('li');
                        
                        if (liElements.length > 0) {
                            // Extract text from each <li> and create safe list items
                            liElements.forEach(li => {
                                const textContent = li.textContent || li.innerText || '';
                                const cleanText = escapeHTML(textContent.trim());
                                if (cleanText) {
                                    const liElement = document.createElement('li');
                                    liElement.textContent = cleanText;
                                    featuresList.appendChild(liElement);
                                }
                            });
                        } else {
                            // Fallback: treat as plain text
                            const cleanText = escapeHTML(features.trim());
                            if (cleanText) {
                                const liElement = document.createElement('li');
                                liElement.textContent = cleanText;
                                featuresList.appendChild(liElement);
                            }
                        }
                    } else {
                        // Features is plain text - create list items
                        const textLines = features.split(/\n|\.|;/).filter(item => item.trim());
                        textLines.forEach(line => {
                            const cleanText = escapeHTML(line.trim());
                            if (cleanText) {
                                const liElement = document.createElement('li');
                                liElement.textContent = cleanText;
                                featuresList.appendChild(liElement);
                            }
                        });
                    }
                }

                // Update technical details
                // Dataset already unescapes HTML entities, so we can use textContent directly
                const technicalElement = select('#projectModalTechnical');
                if (technicalElement) {
                    // Since dataset automatically unescapes, we just need to use the text as-is
                    technicalElement.textContent = technicalDetails || 'Technical details not available';
                }

                // Update implementation
                // Dataset already unescapes HTML entities, so we can use textContent directly
                const implementationElement = select('#projectModalImplementation');
                if (implementationElement) {
                    // Since dataset automatically unescapes, we just need to use the text as-is
                    implementationElement.textContent = implementation || 'Implementation details not available';
                }

                // Update technologies (create spans directly from array, no double-processing)
                const techContainer = select('#projectModalTechnologies');
                if (techContainer) {
                    techContainer.innerHTML = ''; // Clear previous technologies
                    if (technologiesArray && technologiesArray.length > 0) {
                        // Create span elements directly from array
                        technologiesArray.forEach(tech => {
                            const cleanTech = escapeHTML(String(tech).trim());
                            if (cleanTech) {
                                const spanElement = document.createElement('span');
                                spanElement.className = 'skill-tag';
                                spanElement.textContent = cleanTech;
                                techContainer.appendChild(spanElement);
                            }
                        });
                    } else {
                        // Show placeholder
                        const placeholderSpan = document.createElement('span');
                        placeholderSpan.className = 'skill-tag';
                        placeholderSpan.textContent = 'No technologies specified';
                        techContainer.appendChild(placeholderSpan);
                    }
                }

                // Project links section is hidden via CSS - no need to update links

                // Set up gallery
                const projectGallery = select('.project-gallery');
                try {
                    // Safely parse the gallery data with a fallback
                    const galleryData = projectCard.dataset.gallery || '[]';
                    currentGalleryImages = JSON.parse(galleryData.replace(/&quot;/g, '"'));
                } catch (e) {
                    console.warn('Error parsing gallery data:', e);
                    currentGalleryImages = [];
                }
                
                // Hide gallery if no images, show if images exist
                if (currentGalleryImages.length > 0) {
                    // Show gallery
                    if (projectGallery) {
                        projectGallery.style.display = 'block';
                    }
                    
                    // Create gallery HTML
                    galleryContainer.innerHTML = currentGalleryImages.map((img, index) => `
                        <img src="${escapeHTML(img.src)}" 
                             alt="${escapeHTML(img.alt)}" 
                             class="gallery-image${index === 0 ? ' active' : ''}"
                        >
                    `).join('');

                    // Create indicators
                    galleryIndicators.innerHTML = currentGalleryImages.map((_, index) => `
                        <button class="gallery-indicator${index === 0 ? ' active' : ''}" 
                                data-index="${index}"
                                aria-label="View image ${index + 1}">
                        </button>
                    `).join('');

                    // Caption removed for cleaner display

                    // Add click handlers to indicators
                    galleryIndicators.querySelectorAll('.gallery-indicator').forEach((indicator, index) => {
                        indicator.addEventListener('click', () => showGalleryImage(index));
                    });

                    currentImageIndex = 0;
                } else {
                    // Hide gallery when no images
                    if (projectGallery) {
                        projectGallery.style.display = 'none';
                    }
                    // Clear gallery container
                    galleryContainer.innerHTML = '';
                    galleryIndicators.innerHTML = '';
                }

                // Show modal
                projectModal.style.display = 'flex';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        projectModal.classList.add('active');
                    });
                });
                document.body.style.overflow = 'hidden';
            });
        });

        const closeProjectModal = () => {
            projectModal.classList.remove('active');
            setTimeout(() => {
                projectModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                // Reset gallery
                currentImageIndex = 0;
                currentGalleryImages = [];
                galleryContainer.innerHTML = '';
                galleryIndicators.innerHTML = '';
                // Reset gallery visibility
                const projectGallery = select('.project-gallery');
                if (projectGallery) {
                    projectGallery.style.display = '';
                }
                // Caption removed for cleaner display
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
            } else if (projectModal.classList.contains('active')) {
                // Add keyboard navigation for gallery
                if (e.key === 'ArrowLeft') {
                    navigateGallery('prev');
                } else if (e.key === 'ArrowRight') {
                    navigateGallery('next');
                }
            }
        });
    };

    // --- Email Obfuscation ---
    const emailHolder = select('#emailAddress') || select('.contact-email-address');
    if (emailHolder) {
        const user = 'dmflorencio.main';
        const domain = 'gmail.com';
        // Check if it's the specific placeholder before changing
        if (emailHolder.textContent.trim().includes('[email protected]')) {
             emailHolder.textContent = `${user}@${domain}`;
        }
    }

    // --- Dynamic Year in Footer ---
    const yearSpan = select('#currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
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
                    
                    // Create a temporary container in memory
                    const tempContainer = document.createElement('div');
                    // Parse the content safely
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(content, 'text/html');
                    
                    // Clear existing content
                    while (contentContainer.firstChild) {
                        contentContainer.removeChild(contentContainer.firstChild);
                    }
                    
                    // Append the new content safely
                    Array.from(doc.body.children).forEach(child => {
                        contentContainer.appendChild(document.importNode(child, true));
                    });

                    // Apply dynamic styles for data science dashboard
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
                // Create error message element safely
                const errorDiv = document.createElement('div');
                errorDiv.className = 'loading-placeholder';
                
                const icon = document.createElement('i');
                icon.className = 'fas fa-exclamation-triangle';
                
                const message = document.createElement('p');
                message.textContent = 'Failed to load content. Please try again.';
                
                errorDiv.appendChild(icon);
                errorDiv.appendChild(message);
                
                // Clear and append error message
                while (contentContainer.firstChild) {
                    contentContainer.removeChild(contentContainer.firstChild);
                }
                contentContainer.appendChild(errorDiv);
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



    // --- Enhanced Hero Section Functionality ---
    const initializeHeroEnhancements = () => {
        // Typing Animation for Code Window
        const codeLines = selectAll('.code-line');
        if (codeLines.length > 0) {
            codeLines.forEach((line, index) => {
                line.style.opacity = '0';
                line.style.transform = 'translateX(-20px)';
                
                const delay = 1000 + (index * 200);
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        line.style.transition = 'all 0.5s ease';
                        line.style.opacity = '1';
                        line.style.transform = 'translateX(0)';
                    });
                }, delay);
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

    // --- Copy Email to Clipboard (Replaces Modal) ---
    const emailContactMethod = select('#emailContactMethod');
    const emailAddress = select('#emailAddress');
    const emailCopyFeedback = select('#emailCopyFeedback');

    if (emailContactMethod && emailAddress && emailCopyFeedback) {
        emailContactMethod.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the actual email (after obfuscation is resolved)
            const user = 'dmflorencio.main';
            const domain = 'gmail.com';
            const fullEmail = `${user}@${domain}`;
            
            // Copy to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(fullEmail).then(() => {
                        // Show feedback
                        emailCopyFeedback.classList.add('visible');
                        
                        // Hide feedback after 1.5 seconds
                        setTimeout(() => {
                            emailCopyFeedback.classList.remove('visible');
                        }, 1500);
                }).catch(err => {
                    console.warn('Could not copy email: ', err);
                    // Fallback: open mailto link
                    window.location.href = `mailto:${fullEmail}`;
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = fullEmail;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    // Show feedback
                    emailCopyFeedback.classList.add('visible');
                    setTimeout(() => {
                        emailCopyFeedback.classList.remove('visible');
                    }, 2000);
                } catch (err) {
                    console.warn('Could not copy email: ', err);
                    window.location.href = `mailto:${fullEmail}`;
                }
                
                document.body.removeChild(textArea);
            }
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
 * Decodes HTML entities to ensure proper display when using textContent.
 * @param {string} str - The string to decode.
 * @returns {string} The decoded string.
 */
const decodeHTML = (str) => {
    if (typeof str !== 'string') return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
};

/**
 * Fetches resume data from resume.json and renders it.
 */
async function fetchResumeData() {
    const resumeContainer = document.getElementById('resumeContainer');
    if (!resumeContainer) return;

    // Show loading state only if content isn't already loaded
    if (!resumeContainer.querySelector('.resume-view')) {
        // Use safe DOM creation instead of innerHTML
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-placeholder';
        const icon = document.createElement('i');
        icon.className = 'fas fa-spinner fa-spin';
        const p = document.createElement('p');
        p.textContent = 'Loading Resume...';
        loadingDiv.appendChild(icon);
        loadingDiv.appendChild(p);
        resumeContainer.innerHTML = '';
        resumeContainer.appendChild(loadingDiv);
    }

    try {
        // Rate limiting: Prevent rapid successive fetches (no storage - uses closure)
        const now = Date.now();
        const MIN_FETCH_INTERVAL = 2000; // 2 seconds minimum between fetches
        
        // Use closure variable instead of window storage
        if (!fetchResumeData.lastFetch) {
            fetchResumeData.lastFetch = 0;
        }
        const timeSinceLastFetch = now - fetchResumeData.lastFetch;
        
        if (timeSinceLastFetch < MIN_FETCH_INTERVAL) {
            console.warn('Rate limit: Resume fetch throttled');
            return;
        }
        fetchResumeData.lastFetch = now;
        
        // Fetch with proper caching (removed cache busting to allow browser caching)
        const response = await fetch('/resume.json', {
            method: 'GET',
            cache: 'default',
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch resume.json: ${response.status} ${response.statusText}`);
        }
        
        const resumeData = await response.json();
        
        // Validate response structure before rendering
        if (!resumeData || typeof resumeData !== 'object') {
            throw new Error('Invalid resume data format');
        }
        
        renderResume(resumeData);
    } catch (error) {
        console.error("Error fetching or parsing resume data:", error);
        if (resumeContainer) {
            // Use textContent for safe error display
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            const h3 = document.createElement('h3');
            h3.textContent = 'Unable to Load Resume';
            const p = document.createElement('p');
            p.textContent = 'Could not load resume data. Please try again later.';
            errorDiv.appendChild(h3);
            errorDiv.appendChild(p);
            resumeContainer.innerHTML = '';
            resumeContainer.appendChild(errorDiv);
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