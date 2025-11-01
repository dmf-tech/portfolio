# Daniel Florencio - Portfolio Website

![Portfolio Preview](https://img.shields.io/badge/Portfolio-Live-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

A modern, responsive portfolio website showcasing my work as an AI Engineer and Full-Stack Software Developer from the Philippines. Built with pure HTML, CSS, and JavaScript for optimal performance and SEO.

**🌐 Live Demo:** [https://danielflorencio.netlify.app/](https://danielflorencio.netlify.app/)

## 📋 Table of Contents

- [About This Project](#about-this-project)
- [Features](#features)
- [Built With](#built-with)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [SEO & Performance](#seo--performance)
- [Contributing](#contributing)
- [License](#license)

## About This Project

This portfolio is a comprehensive showcase of my professional journey as an AI Engineer and Software Developer. The website features a modern, clean design with smooth animations and fully responsive layouts optimized for all devices.

### Key Highlights

- ✨ **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- 🚀 **Performance Optimized**: Fast loading times and efficient resource management
- 🎨 **Modern UI/UX**: Beautiful animations and interactive elements
- 🔍 **SEO Optimized**: Comprehensive meta tags and structured data for search engines
- ♿ **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation
- 📱 **Mobile-First**: Designed with mobile users in mind

## Features

### Core Sections

- **Hero Section**: Interactive code window animation with typing effect
- **About Me**: Tabs for About, Education, and Interests with core technologies showcase
- **Experience**: Timeline view of professional experience with expandable details
- **Skills**: Categorized skills in Frontend, Backend, AI/ML, DevOps, and System Administration
- **Projects**: Featured project showcase with modal views for detailed information
- **Certifications**: Professional certifications with expandable details
- **Contact**: Multiple contact methods with copy-to-clipboard functionality

### Interactive Features

- ✅ Smooth scrolling navigation with active link highlighting
- ✅ Animated sections on scroll with fade-up effects
- ✅ Expandable experience cards with detailed achievements
- ✅ Project modals with technology tags and descriptions
- ✅ Dynamic skills loading with tabbed interface
- ✅ Responsive mobile navigation with backdrop overlay
- ✅ Email copy-to-clipboard functionality
- ✅ Loading states and error handling

### Responsive Design

- Mobile-first approach with breakpoints at 992px, 768px, 480px, and 360px
- Flexible grid layouts that adapt to screen sizes
- Optimized typography with `clamp()` for fluid scaling
- Touch-friendly interactive elements on mobile devices

## Built With

### Core Technologies

- **HTML5**: Semantic markup with proper structure
- **CSS3**: 
  - Flexbox and Grid for layouts
  - Custom properties (CSS variables)
  - Animations and transitions
  - Media queries for responsiveness
- **JavaScript (ES6+)**: 
  - DOM manipulation
  - Event handling
  - Fetch API for dynamic content loading
  - Local storage for preferences

### External Libraries & Resources

- **Font Awesome**: Icon library for visual elements
- **Google Fonts**: Typography (Primary font family)
- **Netlify**: Hosting and deployment platform

### Development Tools

- **Netlify CLI**: Local development and deployment
- **Git**: Version control

## Project Structure

```
portfolio/
├── index.html              # Main HTML file
├── resume.json            # Resume data (JSON format)
├── projects.json          # Projects data (JSON format)
├── robots.txt             # SEO robots configuration
├── css/
│   ├── style.css          # Main stylesheet
│   ├── responsive-overrides.css  # Mobile responsive styles
│   ├── section-spacing.css      # Section spacing utilities
│   ├── header-enhancements.css   # Header navigation styles
│   ├── about-enhancements.css    # About section enhancements
│   ├── contact-modern.css        # Contact section styles
│   ├── projects-enhancements.css # Projects section styles
│   └── experience-override.css   # Experience section styles
├── js/
│   └── script.js          # Main JavaScript file
├── skills/
│   ├── README.md          # Skills documentation
│   ├── frontend-skills.html
│   ├── backend-skills.html
│   ├── ai-skills.html
│   ├── devops-skills.html
│   └── sysadmin-skills.html
├── img/
│   └── profile.jpg        # Profile image
└── README.md              # This file
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js and npm (for Netlify CLI - optional)
- Git (for cloning the repository)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Open the project:
   - Option 1: Open `index.html` directly in your browser
   - Option 2: Use a local server (see below)

### Running Locally

#### Option 1: Using Python (Simple Server)

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open `http://localhost:8000` in your browser.

#### Option 2: Using Netlify CLI

```bash
# Install/Update Netlify CLI globally (updating fixes deprecation warnings)
npm install -g netlify-cli@latest

# Navigate to project directory
cd portfolio

# Run local development server
netlify dev
```

The site will be available at `http://localhost:8888`

**Note:** If you see `util._extend` deprecation warnings, update Netlify CLI with `npm install -g netlify-cli@latest`

#### Option 3: Using Node.js http-server

```bash
# Install/Update http-server globally (updating fixes deprecation warnings)
npm install -g http-server@latest

# Run server
http-server -p 8000
```

**Note:** If you see `util._extend` deprecation warnings, update your Node.js tools with `npm install -g <tool-name>@latest`

## Deployment

### Deploying to Netlify

1. **Via Netlify CLI:**
```bash
# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

2. **Via Netlify Dashboard:**
   - Connect your GitHub repository
   - Build settings: Leave blank (static site)
   - Publish directory: `/` (root)
   - Deploy!

3. **Via Drag & Drop:**
   - Go to Netlify dashboard
   - Drag and drop the project folder
   - Site will be deployed automatically

### Environment Variables

No environment variables required for this static site.

### Custom Domain

1. Go to Site settings → Domain management
2. Add your custom domain
3. Follow Netlify's DNS configuration instructions

## SEO & Performance

### SEO Optimizations

- ✅ Comprehensive meta tags (title, description, keywords)
- ✅ Open Graph tags for social media sharing
- ✅ Twitter Card metadata
- ✅ Structured data (JSON-LD) for rich snippets
- ✅ Semantic HTML5 elements
- ✅ Proper heading hierarchy
- ✅ Alt text for all images
- ✅ `robots.txt` configuration
- ✅ Sitemap support

### Performance Optimizations

- ✅ Minified CSS and JavaScript (recommended for production)
- ✅ Optimized images
- ✅ Lazy loading for images
- ✅ Efficient CSS (removed duplicates)
- ✅ Debounced scroll and resize handlers
- ✅ Conditional content loading

### Accessibility

- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Semantic HTML
- ✅ Screen reader friendly
- ✅ Color contrast compliance

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ IE11 (limited support)

## Contributing

Contributions, issues, and feature requests are welcome! 

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and formatting
- Ensure responsive design works on all breakpoints
- Test in multiple browsers
- Maintain accessibility standards
- Update documentation as needed

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

**Daniel Florencio**

- 🌐 Portfolio: [https://danielflorencio.netlify.app/](https://danielflorencio.netlify.app/)
- 💼 LinkedIn: [linkedin.com/in/dmflorencio](https://www.linkedin.com/in/dmflorencio/)
- 💻 GitHub: [github.com/DMcloud022](https://github.com/DMcloud022)
- 📧 Email: dmflorencio.main@gmail.com

## Acknowledgments

- Font Awesome for the icon library
- Google Fonts for typography
- Netlify for hosting platform
- All open-source contributors and libraries used

---

⭐ If you found this portfolio helpful or interesting, please consider giving it a star!

**Last Updated:** November 2025
