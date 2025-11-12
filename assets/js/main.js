// Main JavaScript for Portfolio Interactions
class PortfolioApp {
    constructor() {
        this.init().catch(error => {
            console.error("Initialization failed:", error);
            try {
                // Remove preloader if present so error overlay is visible
                const pre = document.getElementById('preloader');
                if (pre && pre.parentNode) {
                    pre.remove();
                }
            } catch (e) {}
            // Dispatch a custom event to surface the error in the page overlay
            window.dispatchEvent(new CustomEvent('app-init-error', { detail: error && (error.message || error.toString()) }));
        });
        this.observer = null; // To be shared between methods
    }

    async init() {
        // Import the testimonials module
        const { updateTestimonials } = await import('./testimonials.js');
        this.updateTestimonials = updateTestimonials;

        // Fetch all data in parallel for performance
        const [timelineData, skillsData, projectsData, testimonialsData] = await Promise.all([
            this.fetchData('timeline.json'),
            this.fetchData('skills.json'),
            this.fetchData('projects.json'),
            this.fetchData('testimonials.json')
        ]);

        this.setupPreloader();
        this.setupNavigation();
        this.setupScrollAnimations(); // Initialize the observer first

        // Now call the setup methods with the fetched data (critical/near-critical)
        this.setupTimeline(timelineData);
        this.setupSkillsFilter(skillsData);
        this.setupProjects(projectsData);
        this.setupBackToTop();
        this.setupThemeToggle();
        this.setupMobileMenu();

        // Defer non-critical work to idle time to reduce TBT
        const runIdle = (cb) => ('requestIdleCallback' in window ? requestIdleCallback(cb) : setTimeout(cb, 1));
        runIdle(() => {
            this.setupTypingAnimation();
            this.setupCustomCursor();
            this.setupTestimonials(testimonialsData);
            this.setupContactForm();
            this.setupInteractiveEffects();
        });
    }

    async fetchData(fileName) {
        try {
            // Use absolute path so module-relative resolution doesn't cause double paths
            const response = await fetch(`/assets/js/${fileName}`);
            if (!response.ok) throw new Error(`Failed to fetch ${fileName}`);
            return response.json();
        } catch (error) {
            console.warn(`Failed to fetch ${fileName}, using fallback data:`, error);
            return this.getFallbackData(fileName);
        }
    }

    getFallbackData(fileName) {
        const fallbackData = {
            'timeline.json': [
                {
                    "year": "2020",
                    "title": "Started Web Development",
                    "description": "Began learning HTML, CSS, and JavaScript fundamentals"
                },
                {
                    "year": "2021",
                    "title": "First Freelance Projects",
                    "description": "Started taking on small web development projects"
                },
                {
                    "year": "2022",
                    "title": "Full Stack Development",
                    "description": "Expanded skills to include backend technologies and databases"
                },
                {
                    "year": "2023",
                    "title": "Professional Certification",
                    "description": "Completed comprehensive web development bootcamp"
                },
                {
                    "year": "2024",
                    "title": "Established Business",
                    "description": "Founded Graphic Shop and expanded client base"
                }
            ],
            'skills.json': [
                { "name": "HTML5", "category": "frontend", "level": 95, "icon": "fab fa-html5" },
                { "name": "CSS3", "category": "frontend", "level": 90, "icon": "fab fa-css3-alt" },
                { "name": "JavaScript", "category": "frontend", "level": 85, "icon": "fab fa-js-square" },
                { "name": "React", "category": "frontend", "level": 80, "icon": "fab fa-react" },
                { "name": "Vue.js", "category": "frontend", "level": 75, "icon": "fab fa-vuejs" },
                { "name": "TailwindCSS", "category": "frontend", "level": 90, "icon": "fas fa-wind" },
                { "name": "Node.js", "category": "backend", "level": 80, "icon": "fab fa-node-js" },
                { "name": "PHP", "category": "backend", "level": 85, "icon": "fab fa-php" },
                { "name": "Python", "category": "backend", "level": 75, "icon": "fab fa-python" },
                { "name": "MySQL", "category": "backend", "level": 80, "icon": "fas fa-database" },
                { "name": "MongoDB", "category": "backend", "level": 70, "icon": "fas fa-leaf" },
                { "name": "WordPress", "category": "backend", "level": 95, "icon": "fab fa-wordpress" },
                { "name": "Photoshop", "category": "design", "level": 90, "icon": "fas fa-image" },
                { "name": "Illustrator", "category": "design", "level": 85, "icon": "fas fa-vector-square" },
                { "name": "Figma", "category": "design", "level": 80, "icon": "fab fa-figma" },
                { "name": "Adobe XD", "category": "design", "level": 75, "icon": "fab fa-adobe" },
                { "name": "Git", "category": "tools", "level": 85, "icon": "fab fa-git-alt" },
                { "name": "VS Code", "category": "tools", "level": 95, "icon": "fas fa-code" },
                { "name": "Docker", "category": "tools", "level": 70, "icon": "fab fa-docker" },
                { "name": "AWS", "category": "tools", "level": 65, "icon": "fab fa-aws" }
            ],
            'projects.json': [
                {
                    "id": 1,
                    "title": "E-commerce Platform",
                    "category": "Web Development",
                    "image": "assets/images/exactus-mb_result.webp",
                    "description": "A modern e-commerce platform built with React and Node.js",
                    "technologies": ["React", "Node.js", "MongoDB", "Stripe"],
                    "liveUrl": "#",
                    "githubUrl": "#"
                },
                {
                    "id": 2,
                    "title": "Corporate Website",
                    "category": "Web Design",
                    "image": "assets/images/getech_result.webp",
                    "description": "Professional corporate website with custom CMS",
                    "technologies": ["WordPress", "PHP", "MySQL", "CSS3"],
                    "liveUrl": "#",
                    "githubUrl": "#"
                },
                {
                    "id": 3,
                    "title": "Brand Identity Design",
                    "category": "Graphic Design",
                    "image": "assets/images/Grumium_result.webp",
                    "description": "Complete brand identity package for tech startup",
                    "technologies": ["Photoshop", "Illustrator", "Figma"],
                    "liveUrl": "#",
                    "githubUrl": "#"
                }
            ],
            'testimonials.json': [
                {
                    "quote": "Bilal delivered our e‑commerce revamp flawlessly. Sales improved and the site feels incredibly fast.",
                    "name": "Ahsan Khan",
                    "company": "Karachi Tech",
                    "location": "Karachi, Pakistan",
                    "rating": 5
                },
                {
                    "quote": "Fantastic design sense and attention to detail. The new brand system is consistent across all touchpoints.",
                    "name": "Fatima Zahra",
                    "company": "Lahore Design Studio",
                    "location": "Lahore, Pakistan",
                    "rating": 5
                },
                {
                    "quote": "Professional, responsive, and technically solid. Our corporate site is now easy to manage and SEO‑friendly.",
                    "name": "Ali Raza",
                    "company": "Islamabad Solutions",
                    "location": "Islamabad, Pakistan",
                    "rating": 4
                },
                {
                    "quote": "The WordPress migration was smooth and the performance optimizations made a big difference.",
                    "name": "Ayesha Siddiqui",
                    "company": "Peshawar Media",
                    "location": "Peshawar, Pakistan",
                    "rating": 5
                },
                {
                    "quote": "Great communication and timely delivery. Highly recommended for full‑stack projects.",
                    "name": "Hassan Ahmed",
                    "company": "Quetta Traders",
                    "location": "Quetta, Pakistan",
                    "rating": 4
                }
            ]
        };
        return fallbackData[fileName] || [];
    }

    // Preloader
    setupPreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        document.body.classList.add('loading');

        // Safety fallback: remove preloader even if window 'load' doesn't fire
        const safetyTimeout = setTimeout(() => {
            if (!preloader.classList.contains('loaded')) {
                preloader.classList.add('loaded');
                document.body.classList.remove('loading');
                setTimeout(() => preloader.remove(), 500);
            }
        }, 5000);

        window.addEventListener('load', () => {
            clearTimeout(safetyTimeout);
            preloader.classList.add('loaded');
            document.body.classList.remove('loading');

            // Remove the preloader from the DOM after the transition
            setTimeout(() => {
                preloader.remove();
            }, 500);
        });
    }

    // Custom Cursor
    setupCustomCursor() {
        const cursorDot = document.getElementById('cursor-dot');
        const cursorCircle = document.getElementById('cursor-circle');

        if (!cursorDot || !cursorCircle) {
            return;
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            cursorDot.style.display = 'none';
            cursorCircle.style.display = 'none';
            return;
        }

        let dotX = 0, dotY = 0;
        let circleX = 0, circleY = 0;

        window.addEventListener('mousemove', (e) => {
            dotX = e.clientX;
            dotY = e.clientY;
            cursorDot.style.transform = `translate(-50%, -50%) translate(${dotX}px, ${dotY}px)`;
        });

        const animateCircle = () => {
            circleX += (dotX - circleX) * 0.2;
            circleY += (dotY - circleY) * 0.2;
            cursorCircle.style.transform = `translate(-50%, -50%) translate(${circleX}px, ${circleY}px)`;
            requestAnimationFrame(animateCircle);
        };
        animateCircle();

        document.querySelectorAll('a, button, .cursor-pointer').forEach(el => {
            el.addEventListener('mouseenter', () => cursorCircle.classList.add('grow'));
            el.addEventListener('mouseleave', () => cursorCircle.classList.remove('grow'));
        });
    }

    // Navigation and Scroll Effects
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add scrolled class for styling
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        }, { passive: true });

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Typing Animation for Hero
    setupTypingAnimation() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;

        const text = 'Bilal Hussain';
        const speed = 150;
        let i = 0;

        typingElement.textContent = '';
        
        const typeWriter = () => {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                // Add blinking cursor class once typing is done
                typingElement.classList.add('animate-blink');
            }
        };

        // Start typing animation after a delay
        setTimeout(typeWriter, 1000);
    }

    // Horizontal Timeline
    setupTimeline(timelineData) {
        const timelineContainer = document.querySelector('#timeline-container .flex');
        if (!timelineContainer || !timelineData) return;

        timelineData.forEach((item, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item glass-card bg-glass-white backdrop-blur-glass border border-glass-gold rounded-2xl p-6 hover:bg-glass-gold transition-all duration-300 w-64 md:w-auto';
            
            timelineItem.innerHTML = `
                <div class="text-center">
                    <div class="text-2xl font-futuristic font-bold text-accent-gold mb-2">${item.year}</div>
                    <h4 class="text-lg font-semibold text-white mb-3">${item.title}</h4>
                    <p class="text-gray-300 text-sm">${item.description}</p>
                </div>
            `;
            
            timelineContainer.appendChild(timelineItem);
        });

        // Add scroll snap for better UX
        timelineContainer.style.scrollSnapType = 'x mandatory';
        timelineContainer.querySelectorAll('.timeline-item').forEach(item => {
            item.style.scrollSnapAlign = 'start';
        });
    }

    // Skills Filter System
    setupSkillsFilter(skillsData) {
        const skillsGrid = document.getElementById('skills-grid');
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        if (!skillsGrid || !skillsData) return;

        // Render skills
        const renderSkills = (skills) => {
            skillsGrid.innerHTML = '';
            const fragment = document.createDocumentFragment();
            skills.forEach((skill, index) => {
                const skillCard = document.createElement('div');
                skillCard.className = `skill-item glass-card bg-glass-white backdrop-blur-glass border border-glass-gold rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 cursor-pointer`;
                skillCard.dataset.category = skill.category;
                
                skillCard.innerHTML = `
                    <i class="${skill.icon} text-3xl sm:text-4xl text-accent-gold mb-3"></i>
                    <h4 class="text-base sm:text-lg font-semibold text-white mb-2">${skill.name}</h4>
                    <div class="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div class="progress-bar bg-accent-gold h-2 rounded-full" style="width: 0%; transition: width 1s ease-out;"></div>
                    </div>
                `;
                skillCard.dataset.level = skill.level; // Store level for animation
                fragment.appendChild(skillCard);
            });
            skillsGrid.appendChild(fragment);
        };

        // Initial render
        renderSkills(skillsData);
        document.querySelectorAll('.skill-item').forEach(el => {
            // Prepare for scroll-in animation and progress fill
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            if (this.observer) {
                this.observer.observe(el);
            } else {
                // Fallback if IntersectionObserver is unavailable
                const progressBar = el.querySelector('.progress-bar');
                const level = el.dataset.level;
                if (progressBar && level) {
                    requestAnimationFrame(() => {
                        progressBar.style.width = `${level}%`;
                    });
                }
            }
        });

        // Filter functionality
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter skills
                const filteredSkills = filter === 'all' 
                    ? skillsData 
                    : skillsData.filter(skill => skill.category === filter);
                
                // Animate filtering
                skillsGrid.style.opacity = '0';
                skillsGrid.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    renderSkills(filteredSkills);
                    skillsGrid.style.opacity = '1';
                    skillsGrid.style.transform = 'translateY(0px)';
                    document.querySelectorAll('.skill-item').forEach(el => {
                        // Reset animation state and observe again
                        el.style.opacity = '0';
                        el.style.transform = 'translateY(50px)';
                        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        if (this.observer) {
                            this.observer.observe(el);
                        } else {
                            const progressBar = el.querySelector('.progress-bar');
                            const level = el.dataset.level;
                            if (progressBar && level) {
                                requestAnimationFrame(() => {
                                    progressBar.style.width = `${level}%`;
                                });
                            }
                        }
                    });
                }, 300);
            });
        });
    }

    // Projects Section with Modal
    setupProjects(projectsData) {
        const projectsGrid = document.querySelector('#projects .grid');
        const modal = document.getElementById('project-modal');
        const modalContent = document.getElementById('modal-content');
        const modalBackdrop = document.getElementById('modal-backdrop');
        let lastFocusedElement = null;
        let focusTrapHandler = null;
        
        if (!projectsGrid || !projectsData) return;

        // Render projects
        projectsData.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card glass-card bg-glass-white backdrop-blur-glass border border-glass-gold rounded-2xl overflow-hidden hover:bg-glass-gold transition-all duration-300 group cursor-pointer';
            
            projectCard.innerHTML = `
                <div class="relative h-48 overflow-hidden">
                    <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" width="400" height="192" sizes="(min-width: 1024px) 360px, (min-width: 768px) 320px, 100vw">
                    <div class="project-overlay absolute inset-0 bg-primary-black/90 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <h4 class="text-xl font-bold text-accent-gold mb-2">${project.title}</h4>
                        <p class="text-gray-300 text-center px-4 mb-4">${project.description}</p>
                        <a class=\"bg-accent-gold text-primary-black px-6 py-2 rounded-full font-semibold hover:bg-light-gold transition-colors duration-300\" href=\"/projects/template.html?id=${project.id}\" aria-label=\"Open details for ${project.title}\">
                            View Details
                        </a>
                    </div>
                </div>
                <div class="p-6">
                    <div class="text-sm text-accent-gold mb-2">${project.category}</div>
                    <h4 class="text-lg font-semibold text-white mb-3">${project.title}</h4>
                    <div class="flex flex-wrap gap-2">
                        ${project.technologies.map(tech => `
                            <span class="text-xs bg-glass-gold backdrop-blur-glass border border-accent-gold/30 text-accent-gold px-2 py-1 rounded-full">${tech}</span>
                        `).join('')}
                    </div>
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });

        // Modal functionality (only for button elements; anchors navigate)
        document.addEventListener('click', (e) => {
            if (e.target.matches('button.view-project-btn')) {
                const projectId = parseInt(e.target.dataset.projectId);
                const project = projectsData.find(p => p.id === projectId);
                if (project) {
                    showProjectModal(project);
                }
            }
        });

        const showProjectModal = (project) => {
            lastFocusedElement = document.activeElement;
            modalContent.innerHTML = `
                <button class="absolute top-4 right-4 w-10 h-10 bg-glass-white backdrop-blur-glass border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-accent-gold hover:text-primary-black transition-all duration-300 z-10" id="close-modal" aria-label="Close project details">
                    <i class="fas fa-times"></i>
                </button>
                <div class="p-4 sm:p-8">
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <img src="${project.image}" alt="${project.title}" class="w-full h-auto max-h-64 object-cover rounded-2xl mb-4 md:mb-0" loading="lazy" width="400" height="225" sizes="(min-width: 1024px) 480px, (min-width: 768px) 400px, 90vw">
                        </div>
                        <div>
                            <div class="text-sm text-accent-gold mb-2">${project.category}</div>
                            <h3 class="text-3xl font-bold text-white mb-4" id="project-modal-title">${project.title}</h3>
                            <p class="text-gray-300 mb-6">${project.description}</p>
                            <div class="mb-6">
                                <h4 class="text-lg font-semibold text-accent-gold mb-3">Technologies Used</h4>
                                <div class="flex flex-wrap gap-2">
                                    ${project.technologies.map(tech => `
                                        <span class="bg-glass-gold backdrop-blur-glass border border-accent-gold/30 text-accent-gold px-3 py-1 rounded-full">${tech}</span>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
                                <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="bg-accent-gold text-primary-black px-6 py-3 rounded-full font-semibold hover:bg-light-gold transition-colors duration-300 flex items-center">
                                    <i class="fas fa-external-link-alt mr-2"></i>
                                    Live Demo
                                </a>
                                ${project.githubUrl && project.githubUrl !== '#' ? `
                                    <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="bg-glass-white backdrop-blur-glass border border-white/30 text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-black transition-all duration-300 flex items-center justify-center">
                                        <i class="fab fa-github mr-2"></i>
                                        Source Code
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
            modal.setAttribute('aria-hidden', 'false');
            const focusableSelectors = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
            const focusable = modalContent.querySelectorAll(focusableSelectors);
            const firstFocusable = focusable[0] || modalContent;
            const lastFocusable = focusable[focusable.length - 1] || modalContent;
            // Ensure content is focusable
            modalContent.setAttribute('tabindex', '-1');
            firstFocusable.focus();

            focusTrapHandler = (e) => {
                if (e.key !== 'Tab') return;
                if (focusable.length === 0) {
                    e.preventDefault();
                    return;
                }
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            };
            document.addEventListener('keydown', focusTrapHandler);
        };

        const closeModal = () => {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.removeEventListener('keydown', focusTrapHandler);
            // Restore focus
            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            }
            // Only unlock body scroll if mobile menu is not open
            const mobileMenu = document.getElementById('mobile-menu');
            if (!mobileMenu || !mobileMenu.classList.contains('open')) {
                document.body.style.overflow = '';
            }
        };

        // Close modal events
        modalBackdrop.addEventListener('click', closeModal);
        document.addEventListener('click', (e) => {
            if (e.target.id === 'close-modal') {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });
    }

    // Testimonials Scroller
    setupTestimonials(testimonials) {
        if (!testimonials || !testimonials.length) return;
        this.updateTestimonials(testimonials);
    }
    // Chat-style Contact Form
    setupContactForm() {
        const chatContainer = document.getElementById('chat-container');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        
        if (!chatContainer || !chatInput || !sendBtn) return;

        // Helper to detect a real-looking sitekey (avoid template placeholders like {{...}})
        const getHcaptchaSitekey = () => {
            const el = document.querySelector('.h-captcha');
            const sk = el ? (el.getAttribute('data-sitekey') || '').trim() : '';
            return sk || null;
        };

        const hasValidHcaptchaSitekey = () => {
            const sk = getHcaptchaSitekey();
            if (!sk) return false;
            // Reject obvious template tokens
            if (sk.includes('{{') || sk.includes('}}') || sk.includes(' ')) return false;
            // Accept alphanumeric-ish keys of reasonable length
            return /^[A-Za-z0-9\-\_]{20,}$/.test(sk);
        };

        const loadHcaptchaIfNeeded = () => {
            if (!hasValidHcaptchaSitekey()) return Promise.resolve(false);
            // If script already loaded, resolve true
            if (window.hcaptcha) return Promise.resolve(true);

            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://hcaptcha.com/1/api.js?onload=hcaptchaOnLoad&render=explicit';
                script.async = true;
                script.defer = true;
                // Provide a global onload to be safe
                window.hcaptchaOnLoad = () => {
                    resolve(true);
                };
                script.addEventListener('error', () => resolve(false));
                document.head.appendChild(script);
                // Safety timeout
                setTimeout(() => resolve(!!window.hcaptcha), 3000);
            });
        };

        let currentStep = -1; // Start at -1, will be incremented to 0
        const formData = {};
        
        const chatSteps = [
            {
                question: "Hi! I'd love to hear from you. What's your name?",
                field: 'name',
                type: 'text'
            },
            {
                question: "Nice to meet you, {name}! What's your email address?",
                field: 'email',
                type: 'email'
            },
            {
                question: "What type of project are you interested in?",
                field: 'project',
                type: 'select',
                options: ['Web Development', 'Graphic Design', 'WordPress', 'UI/UX Design', 'Other']
            },
            {
                question: "Tell me more about your project. What are your goals?",
                field: 'message',
                type: 'textarea'
            }
        ];

        const addMessage = (message, isUser = false) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `flex items-start space-x-3 chat-message ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`;
            
            messageDiv.innerHTML = `
                <div class="w-8 h-8 ${isUser ? 'bg-accent-gold' : 'bg-glass-gold backdrop-blur-glass border border-accent-gold/30'} rounded-full flex items-center justify-center">
                    <i class="fas ${isUser ? 'fa-user' : 'fa-robot'} text-${isUser ? 'primary-black' : 'accent-gold'} text-sm"></i>
                </div>
                <div class="${isUser ? 'user-message bg-accent-gold/20 border-accent-gold/30' : 'bot-message bg-glass-gold backdrop-blur-glass border-accent-gold/30'} rounded-2xl ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'} px-4 py-3 max-w-xs">
                    <p class="text-white text-sm">${message}</p>
                </div>
            `;
            
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        };

        const askNextQuestion = () => {
            currentStep++;
            if (currentStep < chatSteps.length) {
                const step = chatSteps[currentStep];
                const question = step.question.replace('{name}', formData.name || '');
                addMessage(question);

                // If the step is a select, also show the options
                if (step.type === 'select' && step.options) {
                    setTimeout(() => {
                        const optionsMessage = step.options.map((opt, i) => `${i + 1}. ${opt}`).join('<br>');
                        addMessage(`Please reply with a number:<br>${optionsMessage}`);
                    }, 800);
                }
            } else if (currentStep === chatSteps.length) {
                // This is the step after the last question
                // Ensure hCaptcha is loaded only if needed, then submit
                loadHcaptchaIfNeeded().then(() => this.submitFormData(formData));
            } else {
                // This case should not be reached, but as a fallback:
                chatInput.disabled = true;
                sendBtn.disabled = true;
            }
        };

        this.submitFormData = (data) => {
            const netlifyData = new URLSearchParams();
            netlifyData.append('form-name', 'contact');
            Object.keys(data).forEach(key => netlifyData.append(key, data[key]));

            // If a valid hCaptcha sitekey exists, require token; otherwise proceed without captcha
            if (hasValidHcaptchaSitekey()) {
                const token = window.hcaptcha ? window.hcaptcha.getResponse() : '';
                if (!token) {
                    addMessage("Please complete the captcha to continue.");
                    return;
                }
                netlifyData.append('h-captcha-response', token);
            } else {
                // No captcha configured for this environment — proceed without token
            }

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: netlifyData.toString()
            })
            .then(() => {
                addMessage("Thank you! I'll get back to you soon. Your message has been received.");
            })
            .catch((error) => {
                addMessage("Sorry, there was an error sending your message. Please try again later.");
                console.error('Form submission error:', error);
            })
            .finally(() => {
                chatInput.disabled = true;
                sendBtn.disabled = true;
            });
        };

        const processUserInput = (input) => {
            const step = chatSteps[currentStep];
            if (!step) return;

            formData[step.field] = input;
            addMessage(input, true);

            setTimeout(askNextQuestion, 1000);
        };

        const handleSend = () => {
            const input = chatInput.value.trim();
            if (!input) return;

            const currentStepConfig = chatSteps[currentStep];
            if (!currentStepConfig) return;
            
            // Handle validation and processing
            switch (currentStepConfig.type) {
                case 'email':
                    // Simple email validation
                    if (!/^\S+@\S+\.\S+$/.test(input)) {
                        addMessage("That doesn't look like a valid email. Please try again.");
                        return; // Don't clear input, let user correct it
                    }
                    processUserInput(input);
                    break;

                case 'select':
                    const { options } = currentStepConfig;
                    const optionIndex = parseInt(input) - 1;
                    if (optionIndex >= 0 && optionIndex < options.length) {
                        processUserInput(options[optionIndex]);
                    } else {
                        addMessage("Invalid choice. Please enter one of the numbers from the list above.");
                        // Do not proceed, wait for valid input.
                        chatInput.value = '';
                        return;
                    }
                    break;

                default:
                    processUserInput(input);
                    break;
            }
            
            chatInput.value = '';
        };

        sendBtn.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                handleSend();
            }
        });

        // Start the conversation
        askNextQuestion();
    }

    // Back to Top Button with Progress
    setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        const progressCircle = document.getElementById('progress-circle');
        
        if (!backToTopBtn) return;

        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;
            const circumference = 2 * Math.PI * 26; // radius = 26
            const offset = circumference - (scrollPercent * circumference);

            if (!progressCircle) return;

            progressCircle.style.strokeDashoffset = offset;
            
            if (scrollTop > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Theme Toggle
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        
        if (!themeToggle) return;

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'dark';
        body.setAttribute('data-theme', savedTheme);
        
        const updateThemeIcon = (theme) => {
            const icon = themeToggle?.querySelector('i');
            if (theme === 'dark') {
                icon.className = 'fas fa-sun text-accent-gold group-hover:rotate-180 transition-transform duration-300';
            } else {
                icon.className = 'fas fa-moon text-accent-gold group-hover:rotate-180 transition-transform duration-300';
            }
        };

        updateThemeIcon(savedTheme);
        themeToggle.setAttribute('aria-pressed', savedTheme === 'dark' ? 'true' : 'false');

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            themeToggle.setAttribute('aria-pressed', newTheme === 'dark' ? 'true' : 'false');
        });
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';

                    // Animate skill progress bar if it's a skill item
                    if (entry.target.classList.contains('skill-item')) {
                        const progressBar = entry.target.querySelector('.progress-bar');
                        const level = entry.target.dataset.level;
                        if (progressBar && level) {
                            progressBar.style.width = `${level}%`;
                        }
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('[data-scroll-anim], .skill-item, .project-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }

    // Mobile Menu
    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (!mobileMenuToggle || !mobileMenu) return;

        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            const icon = mobileMenuToggle.querySelector('i.fas');
            const isOpen = mobileMenu.classList.contains('open');
            mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            
            if (isOpen) {
                icon.className = 'fas fa-times text-accent-gold';
                document.body.style.overflow = 'hidden';
            } else {
                icon.className = 'fas fa-bars text-accent-gold';
                // Only unlock body scroll if modal is not open
                const modal = document.getElementById('project-modal');
                if (!modal || !modal.classList.contains('open')) {
                    document.body.style.overflow = '';
                }
            }
        });

        // Close mobile menu when clicking on links
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.querySelector('i.fas').className = 'fas fa-bars text-accent-gold';
                // Only unlock body scroll if modal is not open
                const modal = document.getElementById('project-modal');
                if (!modal || !modal.classList.contains('open')) {
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // Interactive hover/scroll effects (tilt, ripple, magnetic, parallax)
    setupInteractiveEffects() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        // Ripple on glass buttons
        document.querySelectorAll('.glass-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rect = btn.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height) * 2;
                ripple.className = 'ripple';
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size/2}px`;
                ripple.style.top = `${e.clientY - rect.top - size/2}px`;
                btn.appendChild(ripple);
                ripple.addEventListener('animationend', () => ripple.remove());
            });
        });

        if (!isFinePointer || prefersReducedMotion) return;

        // Tilt effect for project cards and service cards
        const tiltify = (el, max = 6) => {
            el.classList.add('tilt-animated');
            const onMove = (e) => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;  // 0..1
                const y = (e.clientY - rect.top) / rect.height; // 0..1
                const rx = (0.5 - y) * (max * 2);
                const ry = (x - 0.5) * (max * 2);
                el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
            };
            const reset = () => { el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)'; };
            el.addEventListener('mouseenter', reset);
            el.addEventListener('mousemove', onMove);
            el.addEventListener('mouseleave', reset);
        };

        document.querySelectorAll('.project-card, .glass-card.cursor-pointer').forEach(tiltify);

        // Magnetic effect for prominent buttons
        const magnetize = (el, strength = 12) => {
            const onMove = (e) => {
                const rect = el.getBoundingClientRect();
                const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width; // -0.5..0.5
                const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
                el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
            };
            const reset = () => { el.style.transform = 'translate(0, 0)'; };
            el.addEventListener('mousemove', onMove);
            el.addEventListener('mouseleave', reset);
        };
        document.querySelectorAll('.glass-btn').forEach(magnetize);

        // Parallax particles in hero
        const particles = document.querySelectorAll('#hero .particle');
        if (particles.length) {
            let ticking = false;
            const onScroll = () => {
                if (ticking) return; ticking = true;
                requestAnimationFrame(() => {
                    const y = window.scrollY;
                    particles.forEach((p, i) => {
                        const depth = (i % 5 + 1) * 0.02; // 0.02..0.1
                        p.style.transform = `translateY(${y * depth}px)`;
                    });
                    ticking = false;
                });
            };
            window.addEventListener('scroll', onScroll, { passive: true });
        }
    }
}

// Initialize the portfolio app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();

    // Register Service Worker (deferred)
    const registerSW = () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }
    };
    if ('requestIdleCallback' in window) {
        requestIdleCallback(registerSW);
    } else {
        setTimeout(registerSW, 1);
    }
});
