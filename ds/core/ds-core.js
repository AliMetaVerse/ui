// ds-core.js - Webropol Design System Core Module
/**
 * Core Design System functionality 
 * Unified implementation that follows Tailwind best practices and uses ds.css color variables
 */
class DesignSystem {  constructor() {    this.pages = [
      { id: 'index', title: 'Overview', path: '/ds/index.html', icon: 'home' },
      { id: 'components', title: 'Components', path: '/ds/components/components.html', icon: 'puzzle' },
      { id: 'colors', title: 'Colors', path: '/ds/foundations/colors.html', icon: 'palette' },
      { id: 'typography', title: 'Typography', path: '/ds/foundations/typography.html', icon: 'text' },
      { id: 'spacing', title: 'Spacing', path: '/ds/foundations/spacing.html', icon: 'ruler' },
      { id: 'tokens', title: 'Design Tokens', path: '/ds/foundations/tokens.html', icon: 'code' },
      { id: 'feedback', title: 'Feedback', path: '/ds/components/feedback.html', icon: 'bell' }
    ];
    this.currentPage = this.getCurrentPage();
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    this.toastQueue = [];
    this.isProcessingToast = false;

    // Theme colors based on ds.css
    this.colors = {
      primary: {
        50: '#eefbfd',
        100: '#d4f3f9',
        200: '#a9e8f4',
        300: '#7ed9eb',
        400: '#54c7df',
        500: '#2aafd0',
        600: '#1e6880',
        700: '#175566',
        800: '#0f424d',
        900: '#082f33'
      },
      neutral: {
        50: '#f9fafa',
        100: '#f3f4f4',
        200: '#d1d5d6',
        300: '#b0b6b7',
        400: '#8f9699',
        500: '#61686a',
        600: '#4a4f50',
        700: '#333637',
        800: '#272a2b',
        900: '#1a1c1d'
      },
      success: {
        50: '#f5faf3',
        100: '#e8f4e4',
        200: '#cce5c5',
        300: '#afd3a5',
        400: '#8cbe7f',
        500: '#579f48',
        600: '#448237',
        700: '#38672e',
        800: '#2b4d23',
        900: '#1d3317'
      },
      warning: {
        50: '#fffae9',
        100: '#fff4cc',
        200: '#ffe999',
        300: '#ffdd66',
        400: '#ffbe33',
        500: '#f5980b',
        600: '#cc7a09',
        700: '#b44e09',
        800: '#993f08',
        900: '#7a2f06'
      },
      error: {
        50: '#ffebed',
        100: '#ffd6db',
        200: '#ffadb7',
        300: '#ff8493',
        400: '#f95b6f',
        500: '#f43f63',
        600: '#d92b57',
        700: '#be1241',
        800: '#9a0f35',
        900: '#7a0c2a'
      }
    };

    // Register Tailwind theme if needed
    this.registerTailwindTheme();

    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', () => this.init());
  }
  /**
   * Initialize design system components
   */
  init() {
    console.log('Initializing Webropol Design System...');
    
    // Initialize core components
    this.injectHeader();
    this.injectFooter();
    this.createToastContainer();

    // Setup interactions
    this.setupDarkMode();
    this.setupMobileMenu();
    this.initCopyButtons();
    this.initCodeHighlighting();
    this.initTabSwitchers();
    this.initTooltips();
    this.initInteractiveComponents();
    
    // Apply dark mode if stored
    if (this.darkMode) {
      document.documentElement.classList.add('dark-mode');
    }
    
    // Initialize component examples for documentation
    if (['components', 'index'].includes(this.currentPage)) {
      this.initComponentExamples();
    }

    // Check for URL hash for navigation
    this.handleURLHash();
    
    console.log('Webropol Design System initialized successfully');
  }
  
  /**
   * Handle URL hash for navigation
   */
  handleURLHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#')) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }

  /**
   * Get current page ID from URL
   */
  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    return filename ? filename.replace('.html', '') : 'index';
  }

  /**
   * Register theme with Tailwind if available
   */
  registerTailwindTheme() {
    if (window.tailwind) {
      window.tailwind.config = {
        theme: {
          extend: {
            colors: this.colors,
            fontFamily: {
              'roboto-condensed': ['Roboto Condensed', 'sans-serif'],
              'roboto': ['Roboto', 'sans-serif']
            },
            spacing: {
              'xs': '0.25rem',
              'sm': '0.5rem', 
              'md': '1rem',
              'lg': '1.5rem',
              'xl': '2rem',
              '2xl': '3rem',
              '3xl': '4rem'
            },
            borderRadius: {
              'sm': '0.25rem',
              'md': '0.375rem',
              'lg': '0.5rem',
              'xl': '0.75rem',
              '2xl': '1rem',
            },
            boxShadow: {
              'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
              'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            },
            animation: {
              'slide-in': 'slideIn 0.3s ease-out',
              'slide-out': 'slideOut 0.3s ease-in',
              'fade-in': 'fadeIn 0.2s ease-out',
              'fade-out': 'fadeOut 0.2s ease-in'
            },
            keyframes: {
              slideIn: {
                '0%': { transform: 'translateX(100%)' },
                '100%': { transform: 'translateX(0)' }
              },
              slideOut: {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(100%)' }
              },
              fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' }
              },
              fadeOut: {
                '0%': { opacity: '1' },
                '100%': { opacity: '0' }
              }
            }
          }
        }
      };
    }
  }
  
  /**
   * Apply the design system's theme to an HTML element
   * @param {HTMLElement} element - The element to apply theme to
   * @param {Object} options - Theming options
   */
  applyTheme(element, options = {}) {
    const {
      backgroundColor = 'neutral-50',
      textColor = 'neutral-800',
      borderColor = 'neutral-200',
      rounded = 'md',
      shadow = '',
      padding = 'md'
    } = options;
    
    if (element) {
      element.classList.add(
        `bg-[var(--${backgroundColor})]`,
        `text-[var(--${textColor})]`,
        rounded ? `rounded-${rounded}` : '',
        shadow ? `shadow-${shadow}` : '',
        padding ? `p-${padding}` : ''
      );
      
      if (borderColor) {
        element.classList.add(`border`, `border-[var(--${borderColor})]`);
      }
    }
  }

  /**
   * Get icon SVG markup
   */
  getIcon(iconName) {
    const icons = {
      home: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>',
      puzzle: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>',
      palette: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>',
      text: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>',
      ruler: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>',
      bell: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>',
      code: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>',
      moon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>',
      sun: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
      github: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>',
      menu: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>',
      close: '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>',
      check: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>',
      info: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
      warning: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>',
      error: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
      success: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
    };
    
    return icons[iconName] || '';
  }

  /**
   * Inject header with navigation
   */
  injectHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    header.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-[var(--primary-600)] rounded-md flex items-center justify-center">
            <span class="text-white font-bold font-roboto-condensed text-xl">W</span>
          </div>
          <h1 class="text-xl font-bold font-roboto-condensed text-[var(--primary-600)]">Webropol Design System</h1>
        </div>
        
        <div class="hidden md:flex items-center space-x-6">
          ${this.pages.map(page => `
            <a href="${page.path}" class="text-[var(--neutral-500)] hover:text-[var(--primary-600)] transition font-medium ${
              this.currentPage === page.id ? 'text-[var(--primary-600)]' : ''
            }">${page.title}</a>
          `).join('')}
        </div>
        
        <div class="flex items-center space-x-4">
          <button id="darkModeToggle" class="p-2 rounded-full hover:bg-[var(--neutral-100)]" aria-label="Toggle dark mode">
            ${this.getIcon(this.darkMode ? 'sun' : 'moon')}
          </button>
          <a href="https://github.com/webropol/design-system" target="_blank" class="p-2 rounded-full hover:bg-[var(--neutral-100)]" aria-label="View on GitHub">
            ${this.getIcon('github')}
          </a>
          <button id="mobileMenuButton" class="md:hidden p-2 rounded-full hover:bg-[var(--neutral-100)]" aria-label="Open menu">
            ${this.getIcon('menu')}
          </button>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div id="mobileMenu" class="hidden md:hidden border-t border-[var(--neutral-200)]">
        <div class="px-4 py-2 space-y-1">
          ${this.pages.map(page => `
            <a href="${page.path}" class="block py-2 px-3 rounded-md text-[var(--neutral-500)] hover:bg-[var(--neutral-100)] hover:text-[var(--primary-600)] ${
              this.currentPage === page.id ? 'bg-[var(--primary-50)] text-[var(--primary-600)]' : ''
            }">
              <div class="flex items-center">
                <span class="mr-3">${this.getIcon(page.icon)}</span>
                <span>${page.title}</span>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Setup mobile menu toggle
   */
  setupMobileMenu() {
    const menuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!menuButton || !mobileMenu) return;
    
    menuButton.addEventListener('click', () => {
      const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !isExpanded);
      
      if (isExpanded) {
        menuButton.innerHTML = this.getIcon('menu');
        mobileMenu.classList.add('hidden');
      } else {
        menuButton.innerHTML = this.getIcon('close');
        mobileMenu.classList.remove('hidden');
      }
    });
  }

  /**
   * Inject footer
   */
  injectFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const year = new Date().getFullYear();
    
    footer.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-sm text-[var(--neutral-500)]">
            © ${year} Webropol. All rights reserved.
          </div>
          <div class="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-sm text-[var(--neutral-500)] hover:text-[var(--neutral-900)]">Documentation</a>
            <a href="https://github.com/webropol/design-system" class="text-sm text-[var(--neutral-500)] hover:text-[var(--neutral-900)]">GitHub</a>
            <a href="#" class="text-sm text-[var(--neutral-500)] hover:text-[var(--neutral-900)]">Release Notes</a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Create toast container for notifications
   */
  createToastContainer() {
    let container = document.getElementById('toastContainer');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'fixed bottom-4 right-4 z-50 space-y-2';
      document.body.appendChild(container);
    }
  }

  /**
   * Show a toast notification
   * @param {Object} options - Toast options
   */
  showToast({ title, message, type = 'info', duration = 3000 }) {
    const iconMap = {
      success: this.getIcon('success'),
      warning: this.getIcon('warning'),
      error: this.getIcon('error'),
      info: this.getIcon('info')
    };
    
    const colorMap = {
      success: {
        title: 'text-[var(--success-600)]',
        message: 'text-[var(--success-700)]',
        bg: 'bg-[var(--success-50)]',
        border: 'border-[var(--success-200)]'
      },
      warning: {
        title: 'text-[var(--warning-600)]',
        message: 'text-[var(--warning-700)]',
        bg: 'bg-[var(--warning-50)]',
        border: 'border-[var(--warning-200)]'
      },
      error: {
        title: 'text-[var(--error-600)]',
        message: 'text-[var(--error-700)]',
        bg: 'bg-[var(--error-50)]',
        border: 'border-[var(--error-200)]'
      },
      info: {
        title: 'text-[var(--primary-600)]',
        message: 'text-[var(--primary-700)]',
        bg: 'bg-[var(--primary-50)]',
        border: 'border-[var(--primary-200)]'
      }
    };
    
    const colors = colorMap[type] || colorMap.info;
    const icon = iconMap[type] || iconMap.info;
    
    const toast = {
      title,
      message,
      duration,
      colors,
      icon
    };
    
    this.toastQueue.push(toast);
    
    if (!this.isProcessingToast) {
      this.processToastQueue();
    }
  }

  /**
   * Process toast notification queue
   */
  async processToastQueue() {
    if (this.toastQueue.length === 0) {
      this.isProcessingToast = false;
      return;
    }

    this.isProcessingToast = true;
    const toast = this.toastQueue.shift();
    const { title, message, duration, colors, icon } = toast;
    
    const container = document.getElementById('toastContainer');
    if (!container) {
      this.createToastContainer();
    }

    const toastElement = document.createElement('div');
    toastElement.className = `${colors.bg} ${colors.border} border rounded-lg shadow-md p-4 animate-slide-in max-w-sm transform transition-all duration-300 ease-in-out`;
    toastElement.innerHTML = `
      <div class="flex items-start">
        ${icon ? `<div class="flex-shrink-0 mr-3">${icon}</div>` : ''}
        <div>
          <h4 class="font-medium ${colors.title}">${title}</h4>
          <p class="text-sm ${colors.message}">${message}</p>
        </div>
      </div>
    `;

    container.appendChild(toastElement);

    await new Promise(resolve => setTimeout(resolve, duration));

    toastElement.style.opacity = '0';
    toastElement.style.transform = 'translateX(100%)';

    await new Promise(resolve => setTimeout(resolve, 300));
    if (container.contains(toastElement)) {
      container.removeChild(toastElement);
    }

    this.processToastQueue();
  }

  /**
   * Setup dark mode toggle functionality
   */
  setupDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    // Update toggle icon based on current mode
    toggle.innerHTML = this.getIcon(this.darkMode ? 'sun' : 'moon');

    toggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark-mode');
      this.darkMode = document.documentElement.classList.contains('dark-mode');
      localStorage.setItem('darkMode', this.darkMode);
      
      // Update icon when toggled
      toggle.innerHTML = this.getIcon(this.darkMode ? 'sun' : 'moon');
      
      this.showToast({
        title: this.darkMode ? 'Dark mode enabled' : 'Light mode enabled',
        message: 'Your preference has been saved',
        type: 'info',
        duration: 2000
      });
    });
  }

  /**
   * Initialize copy buttons for code blocks
   */
  initCopyButtons() {
    document.querySelectorAll('pre code').forEach(block => {
      const wrapper = block.parentNode;
      
      // Don't add multiple copy buttons to the same block
      if (wrapper.querySelector('.copy-button')) return;
      
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button absolute top-2 right-2 bg-[var(--neutral-100)] p-1 rounded';
      copyButton.setAttribute('aria-label', 'Copy code');
      copyButton.innerHTML = this.getIcon('code');
      
      copyButton.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(block.textContent);
          copyButton.innerHTML = this.getIcon('check');
          
          this.showToast({
            title: 'Copied!',
            message: 'Code copied to clipboard',
            type: 'success'
          });
          
          setTimeout(() => {
            copyButton.innerHTML = this.getIcon('code');
          }, 2000);
        } catch (err) {
          this.showToast({
            title: 'Failed to copy',
            message: 'Please try again or copy manually',
            type: 'error'
          });
        }
      });
      
      // If the wrapper isn't already positioned relatively
      if (getComputedStyle(wrapper).position !== 'relative') {
        wrapper.style.position = 'relative';
      }
      
      wrapper.appendChild(copyButton);
    });
  }
  
  /**
   * Initialize code syntax highlighting
   * Uses Prism.js if available, or a simple fallback
   */
  initCodeHighlighting() {
    // Check if Prism is available
    if (window.Prism) {
      window.Prism.highlightAll();
    } else {
      // Simple fallback highlighting
      document.querySelectorAll('pre code').forEach(block => {
        const text = block.textContent;
        
        // Simple replacements for common syntax elements
        const keywords = ['function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'class'];
        let html = text;
        
        // Highlight keywords
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'g');
          html = html.replace(regex, `<span class="keyword">${keyword}</span>`);
        });
        
        // Highlight strings
        html = html.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, 
          '<span class="string">$&</span>');
        
        // Highlight comments
        html = html.replace(/(\/\/.*$)/gm, 
          '<span class="comment">$1</span>');
          
        block.innerHTML = html;
      });
    }
  }
  
  /**
   * Initialize tooltips
   */
  initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      // Skip if tooltip already initialized
      if (element.hasAttribute('data-tooltip-initialized')) return;
      element.setAttribute('data-tooltip-initialized', 'true');
      
      // Create tooltip element
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip bg-[var(--neutral-800)] text-white px-2 py-1 rounded text-xs absolute z-50 pointer-events-none opacity-0 transition-opacity duration-200';
      tooltip.textContent = element.getAttribute('data-tooltip');
      document.body.appendChild(tooltip);
      
      function updatePosition(e) {
        const offset = 10;
        tooltip.style.left = e.pageX + offset + 'px';
        tooltip.style.top = e.pageY + offset + 'px';
      }
      
      element.addEventListener('mousemove', updatePosition);
      element.addEventListener('mouseenter', () => tooltip.classList.add('opacity-100'));
      element.addEventListener('mouseleave', () => tooltip.classList.remove('opacity-100'));
      
      // Clean up tooltip when element is removed
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.removedNodes) {
            mutation.removedNodes.forEach(node => {
              if (node === element && document.body.contains(tooltip)) {
                document.body.removeChild(tooltip);
                observer.disconnect();
              }
            });
          }
        });
      });
      
      observer.observe(element.parentNode, { childList: true });
    });
  }
  
  /**
   * Initialize tab switchers
   */
  initTabSwitchers() {
    document.querySelectorAll('.tab-switcher').forEach(tabContainer => {
      const tabs = tabContainer.querySelectorAll('.tab-button');
      const panels = tabContainer.querySelectorAll('.tab-panel');
      
      // Skip if already initialized
      if (tabContainer.hasAttribute('data-tabs-initialized')) return;
      tabContainer.setAttribute('data-tabs-initialized', 'true');
      
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.getAttribute('data-tab-target');
          
          // Update active state of tabs
          tabs.forEach(t => {
            t.classList.remove('active', 'text-[var(--primary-600)]', 'border-[var(--primary-600)]');
            t.classList.add('text-[var(--neutral-500)]', 'border-transparent');
          });
          
          // Activate clicked tab
          tab.classList.add('active', 'text-[var(--primary-600)]', 'border-[var(--primary-600)]');
          tab.classList.remove('text-[var(--neutral-500)]', 'border-transparent');
          
          // Hide all panels
          panels.forEach(panel => {
            panel.classList.add('hidden');
          });
          
          // Show target panel
          const targetPanel = tabContainer.querySelector(`.tab-panel[data-tab="${target}"]`);
          if (targetPanel) {
            targetPanel.classList.remove('hidden');
          }
        });
      });
      
      // Activate first tab by default if none are active
      if (!tabContainer.querySelector('.tab-button.active')) {
        const firstTab = tabs[0];
        if (firstTab) {
          firstTab.click();
        }
      }
    });
  }
  
  /**
   * Initialize component examples
   */
  initComponentExamples() {
    document.querySelectorAll('.preview-container').forEach(container => {
      // Skip if already initialized
      if (container.hasAttribute('data-preview-initialized')) return;
      container.setAttribute('data-preview-initialized', 'true');
      
      const header = container.querySelector('.preview-header');
      const codeBlock = container.querySelector('.preview-code');
      const previewContent = container.querySelector('.preview-content');
      
      if (!header || !codeBlock || !previewContent) return;
      
      // Create toggle button
      const toggleButton = document.createElement('button');
      toggleButton.className = 'button button-outline text-sm ml-auto';
      toggleButton.textContent = 'View Code';
      header.appendChild(toggleButton);
      
      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'button button-outline text-sm ml-2';
      copyButton.textContent = 'Copy Code';
      header.appendChild(copyButton);
      
      // Hide code by default
      codeBlock.classList.add('hidden');
      
      // Toggle between code and preview
      toggleButton.addEventListener('click', () => {
        codeBlock.classList.toggle('hidden');
        previewContent.classList.toggle('hidden');
        toggleButton.textContent = codeBlock.classList.contains('hidden') ? 'View Code' : 'View Preview';
      });
      
      // Copy code
      copyButton.addEventListener('click', async () => {
        const code = codeBlock.querySelector('code')?.textContent || '';
        try {
          await navigator.clipboard.writeText(code);
          this.showToast({
            title: 'Copied!',
            message: 'Code copied to clipboard',
            type: 'success'
          });
        } catch (err) {
          this.showToast({
            title: 'Failed to copy',
            message: 'Please try again or copy manually',
            type: 'error'
          });
        }
      });
    });
  }
  
  /**
   * Initialize interactive components like dropdowns, modals, etc.
   */
  initInteractiveComponents() {
    this.initDropdowns();
    this.initModals();
    this.initCollapsibles();
  }
  
  /**
   * Initialize dropdown menus
   */
  initDropdowns() {
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
      // Skip if already initialized
      if (trigger.hasAttribute('data-dropdown-initialized')) return;
      trigger.setAttribute('data-dropdown-initialized', 'true');
      
      const dropdown = trigger.nextElementSibling;
      if (!dropdown || !dropdown.classList.contains('dropdown-menu')) return;
      
      // Hide dropdown by default
      dropdown.classList.add('hidden');
      
      // Toggle dropdown
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
          dropdown.classList.add('hidden');
        }
      });
    });
  }
  
  /**
   * Initialize modal dialogs
   */
  initModals() {
    document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
      // Skip if already initialized
      if (trigger.hasAttribute('data-modal-initialized')) return;
      trigger.setAttribute('data-modal-initialized', 'true');
      
      const modalId = trigger.getAttribute('data-modal-trigger');
      const modal = document.getElementById(modalId);
      if (!modal) return;
      
      // Hide modal by default
      modal.classList.add('hidden');
      
      // Open modal
      trigger.addEventListener('click', () => {
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        
        // Focus first focusable element
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length) {
          focusable[0].focus();
        }
      });
      
      // Close modal with close button
      modal.querySelectorAll('[data-modal-close]').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
          modal.classList.add('hidden');
          document.body.classList.remove('modal-open');
          trigger.focus(); // Return focus to trigger
        });
      });
      
      // Close modal with escape key
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
          modal.classList.add('hidden');
          document.body.classList.remove('modal-open');
          trigger.focus(); // Return focus to trigger
        }
      });
      
      // Close modal when clicking overlay
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
          document.body.classList.remove('modal-open');
          trigger.focus(); // Return focus to trigger
        }
      });
    });
  }
  
  /**
   * Initialize collapsible sections
   */
  initCollapsibles() {
    document.querySelectorAll('.collapsible-trigger').forEach(trigger => {
      // Skip if already initialized
      if (trigger.hasAttribute('data-collapsible-initialized')) return;
      trigger.setAttribute('data-collapsible-initialized', 'true');
      
      const content = trigger.nextElementSibling;
      if (!content || !content.classList.contains('collapsible-content')) return;
      
      // Hide content by default unless marked as open
      const isOpen = trigger.hasAttribute('data-open');
      if (!isOpen) {
        content.classList.add('hidden');
      }
      
      // Update attributes
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      
      // Toggle collapsible
      trigger.addEventListener('click', () => {
        content.classList.toggle('hidden');
        
        // Update aria attribute
        const expanded = !content.classList.contains('hidden');
        trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      });
    });
  }
  
  /**
   * Copy to clipboard utility
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} - Success state
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast({
        title: 'Copied!',
        message: 'Content copied to clipboard',
        type: 'success'
      });
      return true;
    } catch (err) {
      this.showToast({
        title: 'Error',
        message: 'Failed to copy to clipboard',
        type: 'error'
      });
      return false;
    }
  }
}

// Create global DS instance
const ds = new DesignSystem();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ds;
}
