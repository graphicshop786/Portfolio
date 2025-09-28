// Simple blog renderer for blog.html
(async function () {
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const listEl = document.getElementById('blog-list');
  const postEl = document.getElementById('blog-post');
  const searchInput = document.getElementById('search');
  const categoryFilter = document.getElementById('category-filter');

  let posts = await fetch('/assets/blog/posts.json').then(r => r.json()).catch(() => []);
  let filteredPosts = [...posts];

  const filterPosts = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    
    filteredPosts = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm) || 
                          post.summary.toLowerCase().includes(searchTerm);
      const matchesCategory = !category || post.category === category;
      return matchesSearch && matchesCategory;
    });
    
    renderList();
  };

  searchInput.addEventListener('input', filterPosts);
  categoryFilter.addEventListener('change', filterPosts);

  const renderList = () => {
    postEl.classList.add('hidden');
    listEl.innerHTML = '';
    filteredPosts.forEach(p => {
      const card = document.createElement('a');
      card.href = `/blog.html?slug=${encodeURIComponent(p.slug)}`;
      card.className = 'block glass-card bg-glass-white backdrop-blur-glass border border-glass-gold rounded-2xl p-6 hover:bg-glass-gold transition-all duration-300';
      card.innerHTML = `
        <div class="flex flex-col sm:flex-row gap-4">
          <img src="${p.cover}" alt="${p.title}" class="w-full sm:w-48 h-32 object-cover rounded-2xl" loading="lazy" width="192" height="128">
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-white mb-2">${p.title}</h2>
            <div class="flex items-center gap-4 text-sm text-light-gold mb-3">
              <time datetime="${p.date}">${new Date(p.date).toLocaleDateString()}</time>
              ${p.category ? `<span class="px-2 py-1 bg-glass-white/10 rounded-full">${p.category}</span>` : ''}
              ${p.readingTime ? `<span>${p.readingTime} min read</span>` : ''}
            </div>
            <p class="text-gray-300 mb-3">${p.summary}</p>
            <div class="flex flex-wrap gap-2">
              ${(p.tags || []).map(tag => `
                <span class="text-sm px-2 py-1 bg-glass-white/5 text-accent-gold rounded-full">#${tag}</span>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    });
  };

  const markdownToHtml = (md) => {
    const escape = (s) => s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    
    // Function to handle code blocks with syntax highlighting
    const formatCodeBlock = (code, lang = '') => {
      const escaped = escape(code.trim());
      return `
        <pre class="relative bg-primary-black/90 rounded-lg p-4 mb-6 overflow-x-auto">
          ${lang ? `<span class="absolute top-2 right-2 text-sm text-gray-500">${lang}</span>` : ''}
          <code class="language-${lang} text-sm font-mono text-gray-300">${escaped}</code>
        </pre>
      `;
    };

    // Split content into blocks while preserving code blocks
    const blocks = [];
    let isInCodeBlock = false;
    let currentBlock = [];
    let codeLanguage = '';

    md.split('\n').forEach(line => {
      if (line.startsWith('```')) {
        if (isInCodeBlock) {
          blocks.push({ type: 'code', content: currentBlock.join('\n'), language: codeLanguage });
          currentBlock = [];
          isInCodeBlock = false;
          codeLanguage = '';
        } else {
          if (currentBlock.length) {
            blocks.push({ type: 'text', content: currentBlock.join('\n') });
            currentBlock = [];
          }
          isInCodeBlock = true;
          codeLanguage = line.slice(3).trim();
        }
      } else {
        currentBlock.push(line);
      }
    });

    if (currentBlock.length) {
      blocks.push({ type: isInCodeBlock ? 'code' : 'text', content: currentBlock.join('\n') });
    }

    return blocks.map(block => {
      if (block.type === 'code') {
        return formatCodeBlock(block.content, block.language);
      }

      return block.content.split('\n\n').map(textBlock => {
        // Headers
        if (textBlock.startsWith('# ')) return `<h1 class="text-3xl font-bold text-accent-gold mb-6">${escape(textBlock.slice(2))}</h1>`;
        if (textBlock.startsWith('## ')) return `<h2 class="text-2xl font-semibold text-accent-gold mb-4">${escape(textBlock.slice(3))}</h2>`;
        if (textBlock.startsWith('### ')) return `<h3 class="text-xl font-semibold text-accent-gold mb-3">${escape(textBlock.slice(4))}</h3>`;
        
        // Blockquotes
        if (textBlock.startsWith('> ')) {
          return `<blockquote class="border-l-4 border-accent-gold pl-4 italic text-gray-300 mb-6">${
            escape(textBlock.slice(2)).split('\n> ').join('<br>')
          }</blockquote>`;
        }

        // Lists
        if (textBlock.startsWith('- ')) {
          const items = textBlock.split('\n').map(li => {
            const content = escape(li.replace(/^\-\s*/, ''))
              .replace(/`([^`]+)`/g, '<code class="bg-primary-black/80 px-1 rounded">$1</code>');
            return `<li class="mb-2">${content}</li>`;
          }).join('');
          return `<ul class="list-disc pl-6 text-gray-300 mb-6">${items}</ul>`;
        }

        // Images with captions
        if (textBlock.startsWith('![')) {
          const match = textBlock.match(/!\[(.*?)\]\((.*?)\)(\{(.*?)\})?/);
          if (match) {
            const [_, alt, src, __, caption] = match;
            return `
              <figure class="mb-6">
                <img src="${src}" alt="${escape(alt)}" class="rounded-lg w-full">
                ${caption ? `<figcaption class="text-center text-sm text-gray-400 mt-2">${escape(caption)}</figcaption>` : ''}
              </figure>
            `;
          }
        }

        // Regular paragraphs with inline code and links
        return `<p class="text-gray-300 leading-relaxed mb-6">${
          escape(textBlock)
            .replace(/`([^`]+)`/g, '<code class="bg-primary-black/80 px-1 rounded">$1</code>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent-gold hover:text-light-gold underline">$1</a>')
        }</p>`;
      }).join('\n');
    }).join('\n');
  };

  const renderPost = async (slug) => {
    const meta = posts.find(p => p.slug === slug);
    const mdUrl = `/assets/blog/posts/${slug}.md`;
    const md = await fetch(mdUrl).then(r => r.text()).catch(() => '# Not found');
    listEl.classList.add('hidden');
    postEl.classList.remove('hidden');
    postEl.innerHTML = `
      <header class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-futuristic font-bold text-accent-gold mb-4">${meta?.title || slug}</h1>
        <div class="flex flex-wrap items-center gap-4 text-sm text-light-gold mb-6">
          <time datetime="${meta?.date}">${meta ? new Date(meta.date).toLocaleDateString() : ''}</time>
          ${meta?.category ? `<span class="px-2 py-1 bg-glass-white/10 rounded-full">${meta.category}</span>` : ''}
          ${meta?.readingTime ? `<span>${meta.readingTime} min read</span>` : ''}
        </div>
        ${meta?.tags?.length ? `
          <div class="flex flex-wrap gap-2 mb-6">
            ${meta.tags.map(tag => `
              <span class="text-sm px-2 py-1 bg-glass-white/5 text-accent-gold rounded-full">#${tag}</span>
            `).join('')}
          </div>
        ` : ''}
        ${meta?.cover ? `<img src="${meta.cover}" alt="${meta.title}" class="w-full h-auto rounded-2xl mb-6" loading="lazy" />` : ''}
      </header>
      <div class="prose">${markdownToHtml(md)}</div>
      <footer class="mt-12 pt-6 border-t border-glass-gold">
        <div class="flex justify-between items-center">
          <a href="/blog.html" class="text-accent-gold hover:text-light-gold">← Back to list</a>
          <div class="flex space-x-4">
            <button onclick="share('twitter')" class="text-white hover:text-accent-gold" aria-label="Share on Twitter">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </button>
            <button onclick="share('linkedin')" class="text-white hover:text-accent-gold" aria-label="Share on LinkedIn">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </button>
          </div>
        </div>
      </footer>
    `;
  };

  // Initialize PrismJS after rendering markdown content
  const initPrism = () => {
    if (window.Prism) {
      window.Prism.highlightAll();
    }
  };

  // Share functionality
  window.share = (platform) => {
    const meta = posts.find(p => p.slug === slug);
    const title = meta?.title || 'Blog post';
    const url = window.location.href;
    
    const platforms = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    window.open(platforms[platform], '_blank', 'noopener,noreferrer');
  };

  if (slug) {
    renderPost(slug);
    // Initialize syntax highlighting after post is rendered
    setTimeout(initPrism, 100);
  } else {
    renderList();
  }
})();
