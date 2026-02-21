document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const schoolContent = document.getElementById('school-content');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');

    // Get School ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const schoolId = urlParams.get('id');

    if (!schoolId) {
        showError();
        return;
    }

    // Fetch Data
    Promise.all([
        fetch('../data/research-schools.json').then(res => res.json()),
        fetch('../data/publications.bib').then(res => res.text())
    ])
        .then(([schoolsData, publicationsBib]) => {
            const school = schoolsData.find(s => s.id === schoolId);
            if (school) {
                // Parse BibTeX and filter by school ID
                const allPublications = parseBibTeX(publicationsBib);
                const schoolPublications = allPublications.filter(pub => pub.school_id === school.id);

                renderSchoolDetails(school, schoolPublications);
                loadingIndicator.classList.add('hidden');
                schoolContent.classList.remove('hidden');
            } else {
                showError();
            }
        })
        .catch(err => {
            console.error('Error fetching data:', err);
            showError();
        });

    function showError() {
        loadingIndicator.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }

    function renderSchoolDetails(school, publications) {
        // Hero Section
        document.getElementById('school-year-badge').textContent = school.year;
        document.getElementById('school-title').textContent = school.title;
        document.getElementById('school-date').textContent = school.date;

        // About
        document.getElementById('school-description').textContent = school.description;

        // Objectives
        const objectivesList = document.getElementById('school-objectives');
        objectivesList.innerHTML = school.objectives.map(obj => `
            <li class="flex items-start text-gray-600">
                <i class="fas fa-check text-teal-400 mt-1 mr-3 text-sm"></i>
                ${obj}
            </li>
        `).join('');

        // Topics
        const topicsList = document.getElementById('school-topics');
        topicsList.innerHTML = school.topics.map(topic => `
            <span class="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm transition-all cursor-default">
                ${topic}
            </span>
        `).join('');

        // Schedule
        const scheduleList = document.getElementById('school-schedule');
        scheduleList.innerHTML = school.schedule.map(item => `
            <div class="relative pl-8 md:pl-0 md:flex md:gap-8 hover:bg-gray-100/50 p-4 rounded-xl transition-colors">
                <div class="md:w-32 md:text-right flex-shrink-0">
                    <div class="text-sm font-bold text-teal-600 uppercase tracking-wide">${item.date}</div>
                    <div class="hidden md:block absolute right-0 top-6 w-3 h-3 rounded-full bg-white border-4 border-teal-200 translate-x-1.5 z-10"></div>
                </div>
                <div>
                     <div class="absolute -left-[9px] top-6 w-3 h-3 rounded-full bg-white border-4 border-teal-200 md:hidden"></div>
                    <div class="text-gray-800 font-medium text-lg">${item.event}</div>
                </div>
            </div>
        `).join('');

        // Apply Section
        renderApplyButton(school);

        // Projects Slider
        if (school.projects && school.projects.length > 0) {
            renderProjectSlider(school.projects);
            document.getElementById('projects-section').classList.remove('hidden');
        }

        // Participants
        if (school.participants && school.participants.length > 0) {
            renderParticipants(school.participants);
            document.getElementById('participants-section').classList.remove('hidden');
        }

        // Publications
        if (publications && publications.length > 0) {
            renderPublications(publications);
        }

        // News & Competitions
        if (school.news && school.news.length > 0) {
            renderNews(school.news);
        }
    }

    function renderPublications(publications) {
        const section = document.getElementById('publications-section');
        const grid = document.getElementById('publications-grid');

        section.classList.remove('hidden');
        grid.innerHTML = publications.map(pub => `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                <!-- Using placeholder for image as BibTeX usually doesn't have images easily unless specified in a custom field -->
                <div class="h-48 overflow-hidden bg-gray-100 relative">
                     <img src="${pub.image || 'https://via.placeholder.com/400x300?text=Publication'}" alt="${pub.title}" class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500">
                </div>
                <div class="p-6 flex-grow flex flex-col">
                    <h3 class="font-bold text-lg text-gray-800 mb-2 leading-tight line-clamp-2">${pub.title}</h3>
                    <p class="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-3 line-clamp-1">${pub.author}</p>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">${pub.abstract || 'No abstract available.'}</p>
                    <div class="mt-auto pt-4 border-t border-gray-50">
                        ${pub.url ? `
                        <a href="${pub.url}" target="_blank" class="text-sm font-bold text-teal-700 hover:text-teal-900 flex items-center">
                            Read Paper <i class="fas fa-arrow-right ml-2 text-xs"></i>
                        </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderNews(newsItems) {
        const section = document.getElementById('news-section');
        const grid = document.getElementById('news-grid');

        section.classList.remove('hidden');
        grid.innerHTML = newsItems.map(item => {
            const isWinner = item.type.toLowerCase().includes('winner') || item.type.toLowerCase().includes('result');
            const badgeColor = isWinner ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200';
            const icon = isWinner ? 'fa-trophy' : 'fa-calendar-alt';

            return `
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div class="flex flex-col md:flex-row gap-6">
                    ${item.image ? `
                    <div class="md:w-1/4 flex-shrink-0">
                        <img src="${item.image}" alt="${item.title}" class="w-full h-48 md:h-full object-cover rounded-lg">
                    </div>
                    ` : ''}
                    <div class="flex-grow">
                        <div class="flex flex-wrap items-center gap-3 mb-3">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColor}">
                                <i class="fas ${icon} mr-1.5"></i> ${item.type}
                            </span>
                            <span class="text-sm text-gray-500 font-medium">
                                <i class="far fa-clock mr-1"></i> ${item.date}
                            </span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">${item.title}</h3>
                        <p class="text-gray-600 mb-4 leading-relaxed">${item.description}</p>
                        ${item.link ? `
                        <a href="${item.link}" class="inline-flex items-center text-teal-600 font-semibold hover:text-teal-800 transition-colors">
                            Learn More <i class="fas fa-chevron-right ml-1 text-xs"></i>
                        </a>
                        ` : ''}
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }

    function renderApplyButton(school) {
        const container = document.getElementById('apply-section');
        const isOpen = isRegistrationOpen(school.registrationDeadline);

        if (school.applyLink && isOpen) {
            container.innerHTML = `
                <a href="${school.applyLink}" target="_blank" class="inline-block bg-teal-600 text-white text-xl font-bold px-10 py-4 rounded-full hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Apply Now
                </a>
                <p class="mt-4 text-gray-500">Registration closes on ${school.registrationDeadline}</p>
            `;
        } else {
            container.innerHTML = `
                <button disabled class="inline-block bg-gray-200 text-gray-400 text-xl font-bold px-10 py-4 rounded-full cursor-not-allowed">
                    Registration Closed
                </button>
                 <p class="mt-4 text-gray-400">Registration closed on ${school.registrationDeadline}</p>
            `;
        }
    }

    function isRegistrationOpen(deadlineStr) {
        if (!deadlineStr) return false;
        const cleanDateStr = deadlineStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
        const deadline = new Date(cleanDateStr);
        const now = new Date();
        deadline.setHours(23, 59, 59, 999);
        return !isNaN(deadline) && now <= deadline;
    }

    function renderProjectSlider(projects) {
        const track = document.getElementById('slider-track');
        const dotsContainer = document.getElementById('slider-dots');
        let currentSlide = 0;

        // Clear existing
        track.innerHTML = '';
        dotsContainer.innerHTML = '';

        // Generate Slides
        track.innerHTML = projects.map((project, index) => `
            <div class="absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out flex flex-col md:flex-row bg-white ${index === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}" data-slide="${index}">
                <!-- Left: Image -->
                <div class="md:w-1/2 h-64 md:h-full relative overflow-hidden bg-gray-100 group-hover:scale-[1.02] transition-transform duration-700">
                    <img src="${project.image || 'https://via.placeholder.com/800x600'}" alt="${project.projectName}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                <!-- Right: Content -->
                <div class="md:w-1/2 p-8 md:p-12 flex flex-col bg-white relative z-20 overflow-y-auto">
                    <div class="mb-6 mt-4">
                        <span class="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3 border border-teal-100">
                            <i class="fas fa-users mr-2"></i> ${project.groupName}
                        </span>
                        <h3 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">${project.projectName}</h3>
                    </div>
                    
                    <p class="text-gray-600 text-lg leading-relaxed mb-8 font-light">
                        ${project.description}
                    </p>

                    ${project.pdf ? `
                    <div class="mt-auto mb-4">
                        <a href="${project.pdf}" target="_blank" class="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                            <i class="fas fa-file-pdf mr-2"></i> View Project Report
                        </a>
                    </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Generate Dots
        projects.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `w-3 h-3 rounded-full transition-all border border-gray-300 ${index === 0 ? 'bg-teal-500 scale-125 border-teal-500' : 'bg-white hover:bg-gray-100'}`;
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        // Navigation Logic
        function goToSlide(index) {
            const slides = track.children;
            const dots = dotsContainer.children;

            // Hide all
            for (let i = 0; i < slides.length; i++) {
                slides[i].classList.remove('opacity-100', 'z-10');
                slides[i].classList.add('opacity-0', 'z-0');

                dots[i].classList.remove('bg-teal-500', 'scale-125', 'border-teal-500');
                dots[i].classList.add('bg-white', 'border-gray-300');
            }

            // Show active
            slides[index].classList.remove('opacity-0', 'z-0');
            slides[index].classList.add('opacity-100', 'z-10');

            dots[index].classList.remove('bg-white', 'border-gray-300');
            dots[index].classList.add('bg-teal-500', 'scale-125', 'border-teal-500');

            currentSlide = index;
        }

        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');

        // Clone to remove previous listeners safely
        const newPrevBtn = prevBtn.cloneNode(true);
        const newNextBtn = nextBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

        newPrevBtn.addEventListener('click', () => {
            let next = currentSlide - 1;
            if (next < 0) next = projects.length - 1;
            goToSlide(next);
        });

        newNextBtn.addEventListener('click', () => {
            let next = currentSlide + 1;
            if (next >= projects.length) next = 0;
            goToSlide(next);
        });
    }

    function renderParticipants(participants) {
        const grid = document.getElementById('participants-grid');
        grid.innerHTML = participants.map(participant => `
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-all group">
                <div class="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    ${participant.name.charAt(0)}
                </div>
                <div>
                    <h4 class="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">${participant.name}</h4>
                    <div class="text-sm text-gray-500 mb-1">${participant.affiliation}</div>
                    <div class="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500 font-medium uppercase tracking-wide">
                        ${participant.groupName}
                    </div>
                </div>
            </div>
        `).join('');
    }
});
