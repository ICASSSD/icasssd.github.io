# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-21

### Added
- **Research School Hub**: Added dynamic Research School landing pages (`events/research-school.html`) and detailed individual school pages (`events/school-details.html`).
- **Student Projects Showcase**: Replaced the static photo gallery on the school details page with a rich, interactive "Projects Slider" featuring project images, descriptions, team names, and direct links to PDF reports.
- **Participants Grid**: Added a dedicated section on the school details page to list students, their affiliations, and their project groups.
- **BibTeX Parsing Utility**: Created `scripts/utils.js` with a robust, custom `parseBibTeX()` function to parse raw BibTeX citations directly into structured Javascript objects in the browser.
- **BibTeX Publications Source**: Migrated publication data from JSON to a centralized `data/publications.bib` file. This acts as the single source of truth for all publications across the site.
- **AI for Social Good (AISG)**: Added seminar pages with scheduling, details modals, and updated speaker data structures.
- **Publications Page**: Added a dedicated `publications.html` page to list all ICASSSD research outputs.
- **Membership Page**: Added a new page for membership details.
- **Documentation**: Generated `CHANGELOG.md` to track project history.
- **Assets**: Added new video asset `videos/V2.mp4` for background use.
- **Mentors Section**: Added a new horizontally scrolling two-row slider to the `events/research-school.html` landing page to display research school mentors, fetching data from a newly created `data/school-mentors.json`.
- **Resources Section**: Added a new "Resources" grid to `events/school-details.html` to dynamically link supplementary PDFs (like Agendas, Abstracts, and Closing Ceremonies) defined in the new `resources` array in `data/research-schools.json`.
- **Flyer Linking**: Integrated "Download Flyer" logic directly onto the individual school details page (`events/school-details.html`), positioned alongside the "Apply Now" CTA.

### Changed
- **Dynamic Content Fetching**: Scripts for publications and schools (`scripts/publications.js`, `scripts/school-details.js`, `scripts/research-school.js`) now natively fetch and parse `data/publications.bib`.
- **School Data Structure**: Updated `data/research-schools.json` to include `projects`, `participants`, and `news` arrays, replacing the old `images` array.
- **Team Data Structure**: Restructured and updated team data (`data/team.json`) for better rendering and easier maintenance.
- **Global Layout Scripts**: Modified HTML files (`index.html`, `publications.html`, `events/research-school.html`, etc.) to correctly import `<script src="../scripts/utils.js"></script>` before page-specific logic.
- **Removed Caching**: Implemented a no-caching policy to ensure dynamic JSON and BibTeX data updates are immediately visible to users.
- **Navigation Menu**: Updated the global navigation bar (`scripts/layout.js`) based on organizational feedback.
- **Conference Date & Styling**: Updated presentation dates, AISG talk schedules, and made minor adjustments to `styles/style.css`.
- **Resource Directory Architecture**: Standardized the storage mechanism for supplementary research school PDFs (`resources/research_school/YYYY/파일명.pdf`) for dynamic loading.

### Removed
- **`data/publications.json`**: Completely deleted in favor of the new `publications.bib` source.
- Static, hardcoded photo galleries on the school details pages have been replaced by the dynamic Projects Showcase.

### Fixed
- Fixed layout and visibility issues in the Project Showcase cards (removed watermarks and adjusted z-indexing so titles and descriptions are visible).
- Completed various suggested UI/UX modifications and overall website revamp improvements.
