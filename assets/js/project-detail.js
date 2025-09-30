// Dynamically render project details based on the HTML filename (project ID)
document.addEventListener('DOMContentLoaded', async () => {
	const projectDetailDiv = document.getElementById('project-detail');
	if (!projectDetailDiv) return;

	// Get project ID from the filename (e.g., 1.html -> 1)
	const match = window.location.pathname.match(/\/projects\/(\d+)\.html$/);
	const projectId = match ? parseInt(match[1], 10) : null;
	if (!projectId) {
		projectDetailDiv.innerHTML = '<div class="text-red-500">Invalid project page.</div>';
		return;
	}

	// Fetch projects.json
	let projects = [];
	try {
		const res = await fetch('/assets/js/projects.json');
		projects = await res.json();
	} catch (e) {
		projectDetailDiv.innerHTML = '<div class="text-red-500">Failed to load project data.</div>';
		return;
	}

	const project = projects.find(p => p.id === projectId);
	if (!project) {
		projectDetailDiv.innerHTML = '<div class="text-red-500">Project not found.</div>';
		return;
	}

	// Render project details
	projectDetailDiv.innerHTML = `
		<div class="bg-glass-white/10 border border-glass-gold rounded-2xl p-8 shadow-lg">
			<div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
				<img src="/${project.image}" alt="${project.title}" class="w-full max-w-xs rounded-2xl border border-glass-gold shadow-md" loading="lazy">
				<div class="flex-1">
					<div class="text-accent-gold text-sm mb-2">${project.category}</div>
					<h1 class="text-3xl font-bold mb-4">${project.title}</h1>
					<p class="text-gray-300 mb-6">${project.description}</p>
					<div class="mb-6">
						<h2 class="text-lg font-semibold text-accent-gold mb-2">Technologies Used</h2>
						<div class="flex flex-wrap gap-2">
							${project.technologies.map(tech => `<span class='bg-glass-gold text-accent-gold px-3 py-1 rounded-full text-xs border border-accent-gold/30'>${tech}</span>`).join(' ')}
						</div>
					</div>
					<div class="flex gap-4 mt-6 flex-wrap">
						<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="bg-accent-gold text-primary-black px-6 py-3 rounded-full font-semibold hover:bg-light-gold transition-colors duration-300 flex items-center">
							<i class="fas fa-external-link-alt mr-2"></i> Live Demo
						</a>
						${project.githubUrl && project.githubUrl !== '#' ? `
							<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="bg-glass-white backdrop-blur-glass border border-white/30 text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-black transition-all duration-300 flex items-center justify-center">
								<i class="fab fa-github mr-2"></i> Source Code
							</a>
						` : ''}
					</div>
				</div>
			</div>
		</div>
	`;
});