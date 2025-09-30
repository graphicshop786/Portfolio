// Simple blog renderer for blog.html
(async function () {
  // Initialize mobile menu functionality
  const mobileMenu = document.getElementById('mobile-menu');
  const openMenuBtn = document.getElementById('open-menu');
  const closeMenuBtn = document.getElementById('close-menu');
  
  openMenuBtn?.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });
  
  closeMenuBtn?.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = '';
  });

  // Header scroll behavior
  const header = document.getElementById('main-header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      header.classList.remove('scroll-up');
      return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
      header.classList.remove('scroll-up');
      header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
      header.classList.remove('scroll-down');
      header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
  });

  // Blog functionality
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const postsSection = document.getElementById('posts-section');
  const gridEl = document.getElementById('blog-grid');
  const loadingEl = document.getElementById('loading-state');
  const emptyEl = document.getElementById('empty-state');
  const searchInput = document.getElementById('search');
  const categoryFilter = document.getElementById('category-filter');
  const postEl = document.getElementById('blog-post');

  let posts = [];

  const fetchPosts = async () => {
    try {
      const response = await fetch('/assets/blog/posts.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      posts = await response.json();
    } catch (error) {
      console.error('Error loading blog posts:', error);
      if (loadingEl) loadingEl.classList.add('hidden');
      if (postsSection) {
        postsSection.innerHTML = `<div class="text-center py-16">
          <i class="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
          <h3 class="text-xl text-white mb-2">Failed to load posts</h3>
          <p class="text-gray-400">Please check your connection or try again later.</p>
        </div>`;
      }
    }
  };

  const filterPosts = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    
    const filteredPosts = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm) || 
                          post.summary.toLowerCase().includes(searchTerm);
      const matchesCategory = !category || post.category === category;
      return matchesSearch && matchesCategory;
    });
    
    renderList(filteredPosts);
  };

  const renderList = (postsToRender) => {
    if (!gridEl) return;
    
    gridEl.innerHTML = '';
    
    if (postsToRender.length === 0) {
      emptyEl?.classList.remove('hidden');
    } else {
      emptyEl?.classList.add('hidden');
    }
    
    postsToRender.forEach((post, index) => {
      const template = document.getElementById('blog-post-template');
      const card = template.content.cloneNode(true).querySelector('article');
      const link = card.querySelector('a');
      const img = card.querySelector('img');
      const dateEl = card.querySelector('.date');
      const readingTimeEl = card.querySelector('.reading-time');
      const titleEl = card.querySelector('h2');
      const summaryEl = card.querySelector('p');
      const categoryEl = card.querySelector('.category');
      const tagsContainer = card.querySelector('.flex.flex-wrap.gap-2:last-child');
      
      link.href = `/blog.html?slug=${encodeURIComponent(post.slug)}`;
      img.src = post.cover;
      img.alt = post.title;
      card.querySelector('time').dateTime = post.date;
      dateEl.textContent = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      readingTimeEl.textContent = `${post.readingTime} min read`;
      titleEl.textContent = post.title;
      summaryEl.textContent = post.summary;
      categoryEl.textContent = post.category;
      
      tagsContainer.innerHTML = ''; // Clear existing tags
      post.tags?.forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.className = 'tag text-sm px-3 py-1 bg-glass-white/5 text-gray-300 rounded-full hover:text-accent-gold';
        tagEl.textContent = `#${tag}`;
        tagsContainer.appendChild(tagEl);
      });
      
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', `${index * 100}`);
      
      gridEl.appendChild(card);
    });

    AOS.refresh();
  };

  const renderPost = async (slug) => {
    if (posts.length === 0) await fetchPosts();

    const meta = posts.find(p => p.slug === slug);
    
    if (!meta) {
      document.title = 'Post Not Found – Bilal Hussain';
      if (postsSection) postsSection.classList.add('hidden');
      if (postEl) {
        postEl.classList.remove('hidden');
        postEl.innerHTML = `
          <div class="text-center py-16 max-w-4xl mx-auto">
            <i class="ri-file-search-line text-6xl text-gray-600 mb-4"></i>
            <h1 class="text-4xl font-bold text-accent-gold mb-4">Post Not Found</h1>
            <p class="text-gray-400 mb-8">The post you are looking for does not exist.</p>
            <a href="/blog.html" class="inline-flex items-center text-accent-gold hover:text-light-gold group">
              <svg class="w-5 h-5 mr-2 transform group-hover:-translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to Articles
            </a>
          </div>`;
      }
      return;
    }

    document.title = `${meta.title} – Bilal Hussain`;
    const mdUrl = `/assets/blog/posts/${slug}.md`;

    try {
      const response = await fetch(mdUrl);
      if (!response.ok) throw new Error('Markdown file not found');
      const md = await response.text();

      if (postsSection) postsSection.classList.add('hidden');
      if (postEl) {
        postEl.classList.remove('hidden');
        postEl.innerHTML = `
          <div class="max-w-4xl mx-auto" data-aos="fade-up">
            <a href="/blog.html" class="inline-flex items-center text-accent-gold hover:text-light-gold mb-8 group">
              <i class="ri-arrow-left-line mr-2 transform group-hover:-translate-x-1 transition-transform"></i>
              Back to Articles
            </a>

            <header class="mb-12">
              <h1 class="text-4xl sm:text-5xl font-futuristic font-bold text-accent-gold mb-6 leading-tight">${meta.title}</h1>
              <div class="flex flex-wrap items-center gap-x-6 gap-y-4 text-light-gold mb-8">
                <div class="flex items-center gap-2">
                  <i class="ri-calendar-event-line"></i>
                  <time datetime="${meta.date}">${new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                </div>
                <div class="flex items-center gap-2">
                  <i class="ri-time-line"></i>
                  <span>${meta.readingTime} min read</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="ri-folder-2-line"></i>
                  <span>${meta.category}</span>
                </div>
              </div>
              ${meta.tags?.length ? `
                <div class="flex flex-wrap gap-2 mb-8">
                  ${meta.tags.map(tag => `<span class="tag text-sm px-3 py-1 bg-glass-white/5 text-gray-300 rounded-full">#${tag}</span>`).join('')}
                </div>
              ` : ''}
              ${meta.cover ? `
                <div class="relative rounded-2xl overflow-hidden mb-12 shadow-lg">
                  <img src="${meta.cover}" alt="${meta.title}" class="w-full h-auto" loading="lazy" />
                </div>
              ` : ''}
            </header>

            <div class="prose prose-invert max-w-none">
              ${marked.parse(md)}
            </div>

            <footer class="mt-16 pt-8 border-t border-glass-gold" data-aos="fade-up">
              <div class="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div class="flex items-center gap-4">
                  <img src="/assets/images/Bilal-Hussain_result.webp" alt="Author" class="w-12 h-12 rounded-full">
                  <div>
                    <h3 class="font-medium text-white">Bilal Hussain</h3>
                    <p class="text-sm text-gray-400">Web Developer & Designer</p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <button onclick="share('twitter')" class="social-share-btn" aria-label="Share on Twitter">
                    <i class="ri-twitter-x-line"></i>
                    <span>Share on Twitter</span>
                  </button>
                  <button onclick="share('linkedin')" class="social-share-btn" aria-label="Share on LinkedIn">
                    <i class="ri-linkedin-line"></i>
                    <span>Share on LinkedIn</span>
                  </button>
                </div>
              </div>
            </footer>
          </div>
        `;
      }
      AOS.refresh();
      initPrism();
    } catch (error) {
      console.error('Error rendering post:', error);
      // Show a generic error message if post rendering fails
    }
  };

  const initPrism = () => {
    if (window.Prism) {
      window.Prism.highlightAll();
      // Add copy to clipboard buttons
      const pres = document.querySelectorAll('pre');
      pres.forEach(pre => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-to-clipboard';
        copyButton.innerHTML = '<i class="ri-file-copy-line"></i>';
        copyButton.addEventListener('click', () => {
          const code = pre.querySelector('code').innerText;
          navigator.clipboard.writeText(code).then(() => {
            copyButton.innerHTML = '<i class="ri-check-line"></i>';
            setTimeout(() => {
              copyButton.innerHTML = '<i class="ri-file-copy-line"></i>';
            }, 2000);
          });
        });
        pre.appendChild(copyButton);
      });
    }
  };

  window.share = (platform) => {
    const meta = posts.find(p => p.slug === slug);
    const title = meta?.title || 'Check out this blog post';
    const url = window.location.href;
    
    const platforms = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    window.open(platforms[platform], '_blank', 'noopener,noreferrer');
  };

  const init = async () => {
    // Defer AOS initialization until window 'load' so stylesheets and fonts are applied
    // This avoids forcing a synchronous layout during script execution which can
    // cause the console warning "Layout was forced before the page was fully loaded".
    window.addEventListener('load', () => {
      if (window.AOS && typeof window.AOS.init === 'function') {
        window.AOS.init({ duration: 800, once: true, disable: 'mobile' });
      }
    });

    if (slug) {
      await fetchPosts();
      renderPost(slug);
    } else {
      postsSection?.classList.remove('hidden');
      loadingEl?.classList.remove('hidden');
      await fetchPosts();
      loadingEl?.classList.add('hidden');
      renderList(posts);
      searchInput?.addEventListener('input', filterPosts);
      categoryFilter?.addEventListener('change', filterPosts);
    }
  };

  init();
})();
