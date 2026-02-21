document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('publications-container');
    const searchInput = document.getElementById('search-input');
    let allPublications = [];

    // Fetch BibTeX file
    fetch('data/publications.bib')
        .then(response => response.text())
        .then(text => {
            // Use global parseBibTeX from utils.js
            allPublications = parseBibTeX(text);
            renderPublications(allPublications);
        })
        .catch(error => {
            console.error('Error loading BibTeX:', error);
            container.innerHTML = '<div class="text-center text-red-500">Error loading publications.</div>';
        });

    // Search Listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allPublications.filter(pub =>
                pub.title.toLowerCase().includes(query) ||
                pub.author.toLowerCase().includes(query) ||
                pub.year.includes(query) ||
                (pub.abstract && pub.abstract.toLowerCase().includes(query))
            );
            renderPublications(filtered);
        });
    }

    function renderPublications(publications) {
        if (publications.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 py-10">No publications found.</div>';
            return;
        }

        // Group by Year
        const groups = {};
        publications.forEach(pub => {
            const year = pub.year || 'Unknown';
            if (!groups[year]) groups[year] = [];
            groups[year].push(pub);
        });

        const sortedYears = Object.keys(groups).sort((a, b) => b - a);

        container.innerHTML = sortedYears.map(year => `
            <div class="relative">
                <div class="sticky top-24 z-10 bg-gray-50/95 backdrop-blur-sm py-4 mb-6 border-b border-gray-200">
                    <h2 class="text-3xl font-bold text-teal-800">${year}</h2>
                </div>
                <div class="grid gap-6">
                    ${groups[year].map(pub => `
                        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 group">
                            <div class="flex flex-col md:flex-row gap-6">
                                <div class="flex-grow">
                                    <h3 class="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                                        ${pub.title}
                                    </h3>
                                    <p class="text-gray-600 mb-3 font-medium">${pub.author}</p>
                                    
                                    <div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                        ${pub.journal ? `<span class="flex items-center"><i class="fas fa-book-journal-whills mr-2 text-teal-500"></i> ${pub.journal}</span>` : ''}
                                        ${pub.booktitle ? `<span class="flex items-center"><i class="fas fa-users mr-2 text-indigo-500"></i> ${pub.booktitle}</span>` : ''}
                                        ${pub.type ? `<span class="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono uppercase text-gray-500 self-center">${pub.type}</span>` : ''}
                                    </div>

                                    ${pub.abstract ? `
                                        <p class="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                                            ${pub.abstract}
                                        </p>
                                    ` : ''}

                                    <div class="flex gap-3 mt-auto">
                                        ${pub.url ? `
                                            <a href="${pub.url}" target="_blank" class="text-primary hover:text-dark font-bold text-sm flex items-center">
                                                View Paper <i class="fas fa-external-link-alt ml-1 text-xs"></i>
                                            </a>
                                        ` : ''}
                                        ${pub.school_id ? `<span class="text-xs text-gray-400 self-center ml-auto">School: ${pub.school_id}</span>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
});
