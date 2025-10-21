# itsharsh - AI/ML Researcher Portfolio

A modern, minimalist portfolio website built with Jekyll, showcasing research experience, projects, and papers in the field of Artificial Intelligence and Machine Learning.

hosted at --> itsharshh.netlify.app

## 🌟 Features

### Core Functionality
- **Data-Driven Architecture**: Content managed through YAML files for easy updates
- **Responsive Design**: Mobile-first approach with elegant desktop experience
- **Dark/Light Theme**: System-aware theme with manual toggle and localStorage persistence
- **External Blog Integration**: Links to Notion-hosted blog posts
- **SEO Optimized**: Comprehensive meta tags, sitemap, robots.txt, and structured data

### Security & Performance
- **Content Security Policy**: Strict CSP headers preventing XSS and injection attacks
- **RFC 9116 Security.txt**: Responsible disclosure mechanism for security researchers
- **Progressive Web App**: Installable app experience with manifest and theme colors
- **Performance Monitoring**: Real-time Core Web Vitals tracking (LCP, FID, CLS)
- **Optimized Loading**: Async scripts, preconnect hints, aggressive caching
- **HTTPS Ready**: HSTS prepared for production deployment

### Accessibility
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Semantic HTML**: Proper heading hierarchy and ARIA labels
- **Screen Reader Friendly**: Descriptive link text and alt attributes
- **High Contrast**: WCAG AA compliant color contrasts

## 📁 Project Structure

```
itsharsh/
├── netlify.toml                 # Deployment config with security headers
├── itsharsh_site/               # Jekyll site root
│   ├── _config.yml              # Site configuration and SEO settings
│   ├── _data/                   # Content stored as YAML data files
│   │   ├── experiences.yml      # Professional experience entries
│   │   ├── projects.yml         # Project portfolio entries
│   │   ├── papers.yml           # Research publications
│   │   └── blogs.yml            # External blog links (Notion-hosted)
│   ├── _layouts/
│   │   └── default.html         # Main layout template with PWA support
│   ├── _sass/
│   │   └── main.scss            # Core stylesheet (830+ lines)
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.scss      # Sass entry point
│   │   └── js/
│   │       ├── theme-toggle.js  # Dark/light mode switcher
│   │       ├── performance.js   # Performance monitoring
│   │       └── duration-calculator.js  # Experience duration display
│   ├── .well-known/
│   │   └── security.txt         # RFC 9116 security disclosure
│   ├── index.markdown           # Home page
│   ├── experience.html          # Experience listing page
│   ├── projects.html            # Projects showcase page
│   ├── papers.html              # Publications page
│   ├── blogs.html               # External blog links page
│   ├── 404.html                 # Custom error page
│   ├── robots.txt               # Search engine directives
│   ├── security.txt             # Security disclosure (root location)
│   └── manifest.json            # PWA manifest
```

## 🚀 Quick Start

### Prerequisites
- **Ruby**: Version 3.4.7 or higher
- **Jekyll**: Version 4.4.1 or higher
- **Bundler**: For dependency management

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tooharshh/itsharsh.git
   cd itsharsh/itsharsh_site
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Run development server**
   ```bash
   bundle exec jekyll serve
   ```

4. **Open in browser**
   ```
   http://localhost:4000
   ```

### Development Workflow

- **Watch for changes**: Jekyll automatically rebuilds on file changes
- **Live reload**: Refresh browser to see updates
- **Check console**: Performance metrics logged in DevTools Console
- **Test themes**: Click theme toggle icon in header

## 📝 Content Management

### Adding Experience

Edit `_data/experiences.yml`:

```yaml
- company: "Company Name"
  role: "Your Role"
  duration: "Month Year - Month Year"  # Or "Month Year - Present"
  location: "City, Country"
  description: "What you did and achieved"
  technologies: "Tech stack used"
  link: "https://company-website.com"  # Optional
```

**Important**: 
- Duration format must be "MMM YYYY - MMM YYYY" for automatic calculation
- Use "Present" for current positions
- Technologies should be comma-separated

### Adding Projects

Edit `_data/projects.yml`:

```yaml
- title: "Project Name"
  description: "Brief description of the project"
  technologies: "Tech stack"
  github: "https://github.com/username/repo"  # Optional
  demo: "https://demo-url.com"  # Optional
  highlight: true  # Optional: featured projects shown first
```

### Adding Papers

Edit `_data/papers.yml`:

```yaml
- title: "Paper Title"
  authors: "Author1, Author2, Author3"
  venue: "Conference/Journal Name"
  year: 2025
  link: "https://arxiv.org/paper-link"  # Optional
  pdf: "/path/to/pdf"  # Optional
```

### Adding Blog Links

Edit `_data/blogs.yml`:

```yaml
- title: "Blog Post Title"
  url: "https://notion.site/your-blog-post"
  date: "2025-01-20"
  description: "Brief summary"
  tags: "AI, Machine Learning, Research"
```

**Note**: Blogs are externally hosted on Notion and linked from the site.

## 🎨 Customization

### Colors & Theme

Edit `_sass/main.scss`:

```scss
:root {
  --bg-color: #FFFAFA;        /* Light mode background */
  --text-color: #212427;      /* Light mode text */
  --border-color: #e0e0e0;    /* Borders and dividers */
  --link-color: #212427;      /* Link color */
  --link-hover: #555;         /* Link hover state */
}

.dark-mode {
  --bg-color: #212427;        /* Dark mode background */
  --text-color: #FFFAFA;      /* Dark mode text */
  --border-color: #3a3a3a;    /* Dark mode borders */
}
```

### Typography

Main font: **Space Mono** (monospace)
- Loaded from Google Fonts with `display=swap` for performance
- Fallback: system monospace fonts

### Layout

- **Outer border**: 10px responsive border around entire site
- **Max width**: 1200px for optimal readability
- **Spacing**: Consistent rem-based spacing system
- **Mobile breakpoint**: 768px

## 🔒 Security

### Content Security Policy

The site implements strict CSP headers via `netlify.toml`:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

**Why these directives?**
- `default-src 'self'`: Only load resources from same origin
- `frame-ancestors 'none'`: Prevent clickjacking attacks
- `base-uri 'self'`: Prevent base tag injection
- `form-action 'self'`: Restrict form submissions
- `upgrade-insecure-requests`: Automatically use HTTPS

### Security.txt

Located at `/.well-known/security.txt` and `/security.txt`:
- **Contact**: Email for security reports
- **Expires**: 2026-10-20 (update annually)
- **Preferred-Languages**: en

**Action Required**: Update contact email before production deployment!

### HSTS (Production)

Uncomment in `netlify.toml` after HTTPS verification:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## ⚡ Performance

### Metrics Monitored

Open DevTools Console to see:
- **LCP** (Largest Contentful Paint): < 2.5s is good
- **FID** (First Input Delay): < 100ms is good
- **CLS** (Cumulative Layout Shift): < 0.1 is good
- **Resource timing**: Identifies slow-loading assets
- **Navigation timing**: Page load breakdown
- **Long tasks**: JavaScript blocking main thread (>50ms)

### Optimization Techniques

1. **Async Script Loading**: Non-blocking JavaScript
2. **Font Display Swap**: Prevent FOIT (Flash of Invisible Text)
3. **Preconnect Hints**: DNS/TLS pre-resolution for Google Fonts
4. **Aggressive Caching**: Immutable assets cached for 1 year
5. **Minimal Dependencies**: No heavy frameworks or libraries

### Caching Strategy (Netlify)

```
Cache-Control: public, max-age=31536000, immutable  # CSS/JS/Images
Cache-Control: public, max-age=0, must-revalidate   # HTML pages
```

## 📱 Progressive Web App

### Installation

On mobile devices:
1. Visit the site
2. Tap browser menu
3. Select "Add to Home Screen"
4. App launches in standalone mode

### Manifest Configuration

Edit `manifest.json`:
- **name**: Full app name
- **short_name**: Home screen label
- **theme_color**: Browser UI color (#212427)
- **background_color**: Splash screen color (#FFFAFA)
- **display**: "standalone" for app-like experience

### Future Enhancement: Service Worker

Consider adding `sw.js` for:
- Offline support
- Background sync
- Push notifications
- Advanced caching strategies

## 🧪 Testing

### Local Testing

```bash
# Build site
bundle exec jekyll build

# Serve with production settings
bundle exec jekyll serve --config _config.yml,_config_prod.yml

# Check for errors
bundle exec jekyll doctor
```

### Security Testing

```bash
# Test security.txt accessibility
curl https://yoursite.com/.well-known/security.txt
curl https://yoursite.com/security.txt

# Verify security headers (after deployment)
curl -I https://yoursite.com | grep -i security
```

### Performance Testing

1. **Lighthouse**: Run in Chrome DevTools
   - Target scores: 90+ for all categories
2. **WebPageTest**: Test from different locations
3. **Console Metrics**: Check Core Web Vitals in DevTools

### Cross-Browser Testing

- Chrome/Edge (Chromium)
- Firefox
- Safari (WebKit)
- Mobile browsers (iOS Safari, Chrome Android)

## 🚢 Deployment

### Netlify (Recommended)

1. **Connect repository**
   - Link GitHub repo to Netlify
   - Auto-deploys on git push

2. **Build settings**
   ```
   Build command: jekyll build
   Publish directory: _site
   ```

3. **Environment variables**
   ```
   JEKYLL_ENV=production
   ```

4. **Custom domain** (optional)
   - Add domain in Netlify settings
   - Update DNS records
   - Enable HTTPS
   - Uncomment HSTS in `netlify.toml`

### GitHub Pages (Alternative)

1. **Enable in settings**
   - Settings → Pages
   - Source: Deploy from branch
   - Branch: main, folder: /itsharsh_site

2. **Update _config.yml**
   ```yaml
   url: "https://username.github.io"
   baseurl: "/itsharsh"
   ```

**Note**: Security headers require Netlify or custom server configuration.

## 🛠️ Troubleshooting

### Common Issues

**Issue**: Theme toggle not working
- **Fix**: Check browser console for errors
- **Fix**: Verify localStorage is enabled
- **Fix**: Clear browser cache

**Issue**: Styles not loading
- **Fix**: Run `bundle exec jekyll clean`
- **Fix**: Check `_sass/main.scss` for syntax errors
- **Fix**: Verify `assets/css/styles.scss` imports main.scss

**Issue**: Data not displaying
- **Fix**: Validate YAML syntax in `_data/*.yml`
- **Fix**: Check for proper indentation (2 spaces)
- **Fix**: Ensure field names match template expectations

**Issue**: Performance metrics not showing
- **Fix**: Open DevTools Console (F12)
- **Fix**: Check if PerformanceObserver is supported
- **Fix**: Verify `performance.js` is loading

**Issue**: 404 on deployed site
- **Fix**: Check `netlify.toml` redirects
- **Fix**: Verify build output in `_site` directory
- **Fix**: Ensure Jekyll includes all necessary files

### Getting Help

1. **Check Jekyll docs**: https://jekyllrb.com/docs/
2. **Review commit history**: See what changed recently
3. **Enable verbose logging**: `bundle exec jekyll serve --verbose`
4. **Check build logs**: Review Netlify deploy logs

## 🔄 Maintenance

### Regular Updates

**Monthly**:
- Review and update dependency versions
- Check for security vulnerabilities: `bundle audit`
- Update content (experience, projects, papers)

**Quarterly**:
- Review performance metrics
- Update security.txt if contact changes
- Test site on new browser versions

**Annually**:
- Update security.txt expiration date
- Review and update CSP directives
- Audit and remove unused dependencies

### Dependency Updates

```bash
# Check for outdated gems
bundle outdated

# Update specific gem
bundle update jekyll

# Update all dependencies
bundle update

# Install new dependencies
bundle install
```

### Backup Strategy

- **Git repository**: Primary backup
- **Regular commits**: Commit changes frequently
- **Branch protection**: Use pull requests for major changes
- **Local copy**: Keep local clone updated

## 📊 Analytics (Optional)

To add analytics while respecting privacy:

1. **Privacy-focused options**:
   - Plausible Analytics
   - Fathom Analytics
   - Simple Analytics

2. **Update CSP** in `netlify.toml`:
   ```
   script-src 'self' https://plausible.io;
   connect-src 'self' https://plausible.io;
   ```

3. **Add tracking code** to `_layouts/default.html`

## 🤝 Contributing

Contributions welcome! Please follow:

1. **Fork repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: Use descriptive commit messages
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**: Describe changes and why they're needed

### Coding Standards

- **HTML**: Semantic, accessible markup
- **CSS**: BEM methodology for class names
- **JavaScript**: ES6+, use strict mode, comprehensive error handling
- **YAML**: 2-space indentation, validate syntax
- **Comments**: Explain why, not what

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Jekyll**: Static site generator
- **Google Fonts**: Space Mono typeface
- **Netlify**: Hosting and deployment platform
- **GitHub**: Version control and collaboration

---

**Built with ❤️ by Harsh Dudhatra**

*Last updated: October 20, 2025*
