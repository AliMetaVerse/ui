// Navigation state management
const navState = {
  currentPage: window.location.pathname.split('/').pop().replace('.html', ''),
  pages: [
    { id: 'index', title: 'Overview', icon: 'home' },
    { id: 'components', title: 'Components', icon: 'puzzle' },
    { id: 'colors', title: 'Colors', icon: 'palette' },
    { id: 'typography', title: 'Typography', icon: 'text' },
    { id: 'spacing', title: 'Spacing', icon: 'ruler' },
    { id: 'feedback', title: 'Feedback', icon: 'bell' }
  ]
};

// Inject navigation into header
function injectNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  nav.innerHTML = navState.pages
    .map(page => `
      <a href="${page.id}.html" 
         class="nav-link flex items-center space-x-2 text-[#61686a] hover:text-[#1e6880] transition font-medium ${
           navState.currentPage === page.id ? 'text-[#1e6880]' : ''
         }">
        ${getIcon(page.icon)}
        <span>${page.title}</span>
      </a>
    `)
    .join('');
}

// Icon mapping
function getIcon(name) {
  const icons = {
    home: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>`,
    puzzle: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>`,
    palette: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>`,
    text: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>`,
    ruler: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>`,
    bell: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>`
  };
  return icons[name] || '';
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
  // Handle mobile menu
  const createMobileMenu = () => {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Add mobile menu button
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'md:hidden p-2 rounded-lg hover:bg-[#f3f4f4]';
    mobileMenuButton.innerHTML = `
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    `;

    // Create mobile menu container
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'md:hidden fixed inset-0 z-50 bg-white transform transition-transform duration-300 translate-x-full';
    mobileMenu.innerHTML = `
      <div class="flex justify-between items-center p-4 border-b border-[#d1d5d6]">
        <span class="text-xl font-bold text-[#1e6880]">Webropol DS</span>
        <button class="mobile-close p-2 rounded-lg hover:bg-[#f3f4f4]">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="p-4">
        <div class="space-y-4">
          <a href="/ds/components.html" class="block py-2 text-[#61686a] hover:text-[#272a2b]">Components</a>
          <a href="/ds/colors.html" class="block py-2 text-[#61686a] hover:text-[#272a2b]">Colors</a>
          <a href="/ds/typography.html" class="block py-2 text-[#61686a] hover:text-[#272a2b]">Typography</a>
          <a href="/ds/spacing.html" class="block py-2 text-[#61686a] hover:text-[#272a2b]">Spacing</a>
          <a href="/ds/tokens.html" class="block py-2 text-[#61686a] hover:text-[#272a2b]">Tokens</a>
        </div>
      </div>
    `;

    // Insert mobile menu button before the navigation links
    const navLinks = nav.querySelector('.hidden.md\\:flex').parentElement;
    navLinks.parentElement.insertBefore(mobileMenuButton, navLinks);

    // Add mobile menu to body
    document.body.appendChild(mobileMenu);

    // Handle mobile menu toggle
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.remove('translate-x-full');
      document.body.style.overflow = 'hidden';
    });

    // Handle mobile menu close
    const closeButton = mobileMenu.querySelector('.mobile-close');
    closeButton.addEventListener('click', () => {
      mobileMenu.classList.add('translate-x-full');
      document.body.style.overflow = '';
    });

    // Close mobile menu on navigation
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
        document.body.style.overflow = '';
      });
    });
  };

  // Handle active page highlighting
  const highlightActivePage = () => {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('nav a:not(:first-child)');
    
    links.forEach(link => {
      if (link.getAttribute('href') === currentPath || 
          (currentPath.includes(link.getAttribute('href').split('.')[0]) && 
           !link.getAttribute('href').includes('#'))) {
        link.classList.add('text-[#1e6880]', 'font-medium');
        link.classList.remove('text-[#61686a]');
      }
    });
  };

  // Initialize navigation functionality
  createMobileMenu();
  highlightActivePage();

  // Handle smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Handle scroll-based header shadow
  let lastScroll = 0;
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 0) {
      header.classList.add('shadow-md');
    } else {
      header.classList.remove('shadow-md');
    }

    lastScroll = currentScroll;
  });
});