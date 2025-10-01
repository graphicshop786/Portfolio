function createTestimonialCard(testimonial) {
    return `
        <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-image">
                    <img src="${testimonial.image}" alt="${testimonial.name}" 
                        onerror="this.src='/assets/images/placeholder-avatar.svg'">
                </div>
                <div class="testimonial-info">
                    <div class="testimonial-name">${testimonial.name}</div>
                    <div class="testimonial-role">${testimonial.role}</div>
                    <div class="testimonial-company">${testimonial.company}</div>
                </div>
            </div>
            <div class="testimonial-quote">${testimonial.quote}</div>
            <div class="testimonial-project">
                <div class="testimonial-project-title">${testimonial.project}</div>
                <div class="testimonial-location">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="location-icon">
                        <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
                    </svg>
                    ${testimonial.location}
                </div>
            </div>
        </div>
    `;
}

function updateTestimonials(testimonials) {
    const track = document.getElementById('testimonials-track');
    const container = document.getElementById('testimonials-container');
    if (!track || !container) return;

    // Add testimonial cards
    track.innerHTML = testimonials.map(createTestimonialCard).join('');

    // If nothing rendered, show a helpful message
    if (!track.innerHTML.trim()) {
        track.innerHTML = `<div class="empty-message">No testimonials available right now.</div>`;
        return;
    }

    // Defer layout reads and heavy measurements to the next animation frame
    // so stylesheets and fonts have a chance to apply and we don't force layout.
    const setupLayout = () => {
        // Remove any previously injected navigation or indicators to avoid duplicates
        const prevNav = container.parentNode && container.parentNode.querySelector('.testimonial-nav');
        if (prevNav) prevNav.remove();
        const prevIndicators = container.parentNode && container.parentNode.querySelector('.testimonial-indicators');
        if (prevIndicators) prevIndicators.remove();
        const prevBadge = container.querySelector('.testimonials-debug-badge');
        if (prevBadge) prevBadge.remove();

        // Calculate cards per view based on container width
        const cardWidth = 320; // Card width + gap
        const containerWidth = (container.offsetWidth || (container.getBoundingClientRect && container.getBoundingClientRect().width) || 800);
        let cardsPerView = Math.floor(containerWidth / cardWidth);
        if (cardsPerView < 1) cardsPerView = 1;

        let currentIndex = 0;
        const totalSlides = Math.max(1, testimonials.length - cardsPerView + 1);

        // Debug badge so we know the testimonials renderer ran
        const badge = document.createElement('div');
        badge.className = 'testimonials-debug-badge';
        badge.style.cssText = 'position:absolute;top:0.75rem;right:0.75rem;background:rgba(0,0,0,0.6);color:#FFD700;padding:6px 8px;border-radius:6px;font-size:12px;z-index:20';
        badge.textContent = `${testimonials.length} testimonials · view ${cardsPerView}`;
        container.style.position = container.style.position || 'relative';
        container.appendChild(badge);

        // Add navigation
        const nav = document.createElement('div');
        nav.className = 'testimonial-nav';
        nav.innerHTML = `
            <button id="prev-testimonial" aria-label="Previous testimonial" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button id="next-testimonial" aria-label="Next testimonial">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;
        container.after(nav);

        // Add indicators
        const indicators = document.createElement('div');
        indicators.className = 'testimonial-indicators';
        indicators.innerHTML = Array(totalSlides).fill('')
            .map((_, i) => `<div class="testimonial-indicator${i === 0 ? ' active' : ''}"></div>`)
            .join('');
        nav.after(indicators);

        const updateControls = () => {
            const prevBtn = document.getElementById('prev-testimonial');
            const nextBtn = document.getElementById('next-testimonial');
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex === totalSlides - 1;
            
            // Update indicators
            container.parentNode.querySelectorAll('.testimonial-indicator').forEach((indicator, i) => {
                indicator.classList.toggle('active', i === currentIndex);
            });

            // Transform the track
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        };

        // Event listeners
        const prevBtn = document.getElementById('prev-testimonial');
        const nextBtn = document.getElementById('next-testimonial');
        prevBtn && prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateControls();
            }
        });
        nextBtn && nextBtn.addEventListener('click', () => {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateControls();
            }
        });

        // Auto-advance every 5 seconds
        let autoplayInterval = setInterval(() => {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateControls();
            } else {
                currentIndex = 0;
                updateControls();
            }
        }, 5000);

        // Pause autoplay on hover
        container.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        container.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(() => {
                if (currentIndex < totalSlides - 1) {
                    currentIndex++;
                    updateControls();
                } else {
                    currentIndex = 0;
                    updateControls();
                }
            }, 5000);
        });

        // Run initial control update
        updateControls();
    };

    // Defer to next animation frame so CSS can apply first; double rAF for safety
    requestAnimationFrame(() => requestAnimationFrame(setupLayout));
}

// Initialize with your testimonials data
export { updateTestimonials };