// Component Manager Class
class ComponentManager {
  constructor() {
    this.toastQueue = [];
    this.isProcessingToast = false;
  }

  // Initialize shared components
  init() {
    this.injectNavigation();
    this.injectFooter();
    this.setupDarkMode();
    this.createToastContainer();
  }

  // Inject navigation into the header
  injectNavigation() {
    const header = document.querySelector('header');
    if (!header) return;

    header.innerHTML = `
      <nav class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-8">
          <a href="/ds/ds.html" class="text-xl font-bold text-[#1e6880]">Webropol DS</a>
          <div class="hidden md:flex items-center space-x-6">
            <a href="/ds/components.html" class="text-[#61686a] hover:text-[#272a2b]">Components</a>
            <a href="/ds/colors.html" class="text-[#61686a] hover:text-[#272a2b]">Colors</a>
            <a href="/ds/typography.html" class="text-[#61686a] hover:text-[#272a2b]">Typography</a>
            <a href="/ds/spacing.html" class="text-[#61686a] hover:text-[#272a2b]">Spacing</a>
            <a href="/ds/tokens.html" class="text-[#61686a] hover:text-[#272a2b]">Tokens</a>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button id="darkModeToggle" class="p-2 rounded-full hover:bg-[#f3f4f4]">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          <a href="https://github.com/webropol/design-system" target="_blank" class="p-2 rounded-full hover:bg-[#f3f4f4]">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </nav>
    `;
  }

  // Inject footer
  injectFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    footer.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-sm text-[#61686a]">
            © ${new Date().getFullYear()} Webropol. All rights reserved.
          </div>
          <div class="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-sm text-[#61686a] hover:text-[#272a2b]">Documentation</a>
            <a href="#" class="text-sm text-[#61686a] hover:text-[#272a2b]">GitHub</a>
            <a href="#" class="text-sm text-[#61686a] hover:text-[#272a2b]">Release Notes</a>
          </div>
        </div>
      </div>
    `;
  }

  // Create toast container
  createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed bottom-4 right-4 z-50 space-y-2';
    document.body.appendChild(container);
  }

  // Show toast notification
  showToast({ title, message, duration = 3000, titleColor = 'text-[#272a2b]', messageColor = 'text-[#61686a]', icon = '' }) {
    this.toastQueue.push({ title, message, duration, titleColor, messageColor, icon });
    if (!this.isProcessingToast) {
      this.processToastQueue();
    }
  }

  // Process toast queue
  async processToastQueue() {
    if (this.toastQueue.length === 0) {
      this.isProcessingToast = false;
      return;
    }

    this.isProcessingToast = true;
    const { title, message, duration, titleColor, messageColor, icon } = this.toastQueue.shift();
    const container = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = 'bg-white rounded-lg shadow-lg p-4 animate-slide-in max-w-sm transform transition-all duration-300 ease-in-out';
    toast.innerHTML = `
      <div class="flex items-start">
        ${icon ? `<div class="flex-shrink-0 mr-3">${icon}</div>` : ''}
        <div>
          <h4 class="font-medium ${titleColor}">${title}</h4>
          <p class="text-sm ${messageColor}">${message}</p>
        </div>
      </div>
    `;

    container.appendChild(toast);

    await new Promise(resolve => setTimeout(resolve, duration));

    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';

    await new Promise(resolve => setTimeout(resolve, 300));
    container.removeChild(toast);

    this.processToastQueue();
  }

  // Setup dark mode toggle
  setupDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    }

    toggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark-mode');
      const isDark = document.documentElement.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDark);
    });
  }

  // Copy to clipboard utility
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast({
        title: 'Copied!',
        message: 'Content copied to clipboard',
        titleColor: 'text-[#448237]',
        messageColor: 'text-[#38672e]',
        icon: `<svg class="h-5 w-5 text-[#579f48]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>`
      });
    } catch (err) {
      this.showToast({
        title: 'Error',
        message: 'Failed to copy to clipboard',
        titleColor: 'text-[#be1241]',
        messageColor: 'text-[#9a0f35]',
        icon: `<svg class="h-5 w-5 text-[#f43f63]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>`
      });
    }
  }
}

// Tooltip functionality
function createTooltip(element) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = element.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);

    function updatePosition(e) {
        const offset = 10;
        tooltip.style.left = e.pageX + offset + 'px';
        tooltip.style.top = e.pageY + offset + 'px';
    }

    element.addEventListener('mousemove', updatePosition);
    element.addEventListener('mouseenter', () => tooltip.classList.add('visible'));
    element.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
}

// Code Preview functionality
function initializeCodePreviews() {
    document.querySelectorAll('.preview-container').forEach(container => {
        const codeBlock = container.querySelector('.preview-code');
        const previewContent = container.querySelector('.preview-content');
        const header = container.querySelector('.preview-header');

        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'button button-outline ml-auto text-sm';
        copyButton.textContent = 'Copy Code';
        header.appendChild(copyButton);

        copyButton.addEventListener('click', () => {
            const code = codeBlock.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                showToast('Code copied to clipboard!');
            });
        });

        // Toggle preview/code
        const toggleButton = document.createElement('button');
        toggleButton.className = 'button button-outline ml-2 text-sm';
        toggleButton.textContent = 'View Code';
        header.appendChild(toggleButton);

        toggleButton.addEventListener('click', () => {
            codeBlock.classList.toggle('hidden');
            previewContent.classList.toggle('hidden');
            toggleButton.textContent = codeBlock.classList.contains('hidden') ? 'View Code' : 'View Preview';
        });
    });
}

// Toast notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slide-in`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('animate-fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tooltips
    document.querySelectorAll('[data-tooltip]').forEach(createTooltip);
    
    // Initialize code previews
    initializeCodePreviews();

    // Add copy functionality to code blocks
    document.querySelectorAll('pre code').forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>';
        
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent).then(() => {
                showToast('Code copied to clipboard!');
            });
        });

        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);
        wrapper.appendChild(copyButton);
    });
});

// Export functions for use in other modules
export { showToast, createTooltip };

// Create global component manager instance
window.componentManager = new ComponentManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.componentManager.init();
});