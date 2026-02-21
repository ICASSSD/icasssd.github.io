# ICASSSD Website

The official website for the **International Centre for Applied Systems Science for Sustainable Development (ICASSSD)**.

## Overview
ICASSSD is an independent international not-for-profit organization envisioning the advancement of research in Systems Science and Sustainability. This website serves as a hub for its initiatives, events, and community engagement.

## Project Structure

- **root**: Main HTML pages (`index.html`, `about.html`, `partnership.html`, `publications.html`, etc.)
- **styles/**: CSS stylesheets and Tailwind configuration.
- **scripts/**: JavaScript logic for interactivity, layout, and rendering dynamic content (including a custom BibTeX parser in `utils.js`).
- **data/**: Data files storing dynamic content. Includes JSON (`research-schools.json`, `events.json`, etc.) and BibTeX (`publications.bib`).
- **images/**: Static image assets.
- **videos/**: Video assets for backgrounds and content.
- **blogs/**: Individual blog post pages.
- **events/**: Specific event pages (`aisg.html`, `research-school.html`, `school-details.html`).

## Key Features

- **Modern Design**: Responsive layout using Tailwind CSS.
- **Dynamic Content rendering**: Events, Team, Blogs, and Research Schools are dynamically loaded from JSON files.
- **BibTeX Integration**: Publications are driven by a single `publications.bib` file, parsed dynamically on the client side, allowing for easy updates and filtering by school or project.
- **Rich Media**: Dedicated components for sliding photo galleries, project showcases (with PDF links), and participant grids.
- **Componentized Layout**: Shared Navbar and Footer injected via `scripts/layout.js`.

## Setup & Running

This is a static website. You can view it by opening `index.html` directly in a browser, or better yet, by running a local development server for proper fetch API behavior.

### Using Python (if installed)
```bash
python3 -m http.server
```
Then visit `http://localhost:8000`.

### Using Live Server (VS Code Extension)
Open the project in VS Code and click "Go Live".

## Recent Updates
- Added dynamic **Research School Landing Pages** (`events/research-school.html` and `events/school-details.html`).
- Implemented a **Projects Showcase** slider and a **Participants Grid** for detail pages.
- Migrated all publication data to a centralized `data/publications.bib` file with a custom JavaScript parser.
- Added **AI for Social Good** seminar page with details modal.
- Restructured data storage by utilizing the `data/` directory for both JSON and BibTeX sources.
