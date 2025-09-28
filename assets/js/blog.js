// Simple blog renderer for blog.html
(async function () {
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const listEl = document.getElementById('blog-list');
  const postEl = document.getElementById('blog-post');

  const posts = await fetch('/assets/blog/posts.json').then(r => r.json()).catch(() => []);

  const renderList = () => {
    postEl.classList.add('hidden');
    listEl.innerHTML = '';
    posts.forEach(p => {
      const card = document.createElement('a');
      card.href = `/blog.html?slug=${encodeURIComponent(p.slug)}`;
      card.className = 'block glass-card bg-glass-white backdrop-blur-glass border border-glass-gold rounded-2xl p-6 hover:bg-glass-gold transition-all duration-300';
      card.innerHTML = `
        <div class="flex items-start gap-4">
          <img src="${p.cover}" alt="${p.title}" class="w-32 h-20 object-cover rounded-2xl" loading="lazy" width="128" height="80">
          <div>
            <h2 class="text-xl font-semibold text-white mb-1">${p.title}</h2>
            <div class="text-sm text-light-gold mb-2">${new Date(p.date).toLocaleDateString()}</div>
            <p class="text-gray-300">${p.summary}</p>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    });
  };

  const markdownToHtml = (md) => {
    // Extremely small markdown renderer: headings, paragraphs, lists, code inline
    const escape = (s) => s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    return md.split('\n\n').map(block => {
      if (block.startsWith('# ')) return `<h1 class="text-3xl font-bold text-accent-gold mb-4">${escape(block.slice(2))}</h1>`;
      if (block.startsWith('## ')) return `<h2 class="text-2xl font-semibold text-accent-gold mb-3">${escape(block.slice(3))}</h2>`;
      if (block.startsWith('- ')) {
        const items = block.split('\n').map(li => `<li class="mb-1">${escape(li.replace(/^\-\s*/, ''))}</li>`).join('');
        return `<ul class="list-disc pl-6 text-gray-300 mb-4">${items}</ul>`;
      }
      return `<p class="text-gray-300 leading-relaxed mb-4">${escape(block).replace(/`([^`]+)`/g, '<code class="bg-primary-black/80 px-1 rounded">$1</code>')}</p>`;
    }).join('\n');
  };

  const renderPost = async (slug) => {
    const meta = posts.find(p => p.slug === slug);
    const mdUrl = `/assets/blog/posts/${slug}.md`;
    const md = await fetch(mdUrl).then(r => r.text()).catch(() => '# Not found');
    listEl.classList.add('hidden');
    postEl.classList.remove('hidden');
    postEl.innerHTML = `
      <header class="mb-6">
        <h1 class="text-3xl sm:text-4xl font-futuristic font-bold text-accent-gold mb-2">${meta?.title || slug}</h1>
        <div class="text-sm text-light-gold mb-4">${meta ? new Date(meta.date).toLocaleDateString() : ''}</div>
        ${meta?.cover ? `<img src="${meta.cover}" alt="${meta.title}" class="w-full h-auto rounded-2xl mb-6" loading="lazy" />` : ''}
      </header>
      <div>${markdownToHtml(md)}</div>
      <div class="mt-8"><a href="/blog.html" class="text-accent-gold hover:text-light-gold">← Back to list</a></div>
    `;
  };

  if (slug) {
    renderPost(slug);
  } else {
    renderList();
  }
})();
