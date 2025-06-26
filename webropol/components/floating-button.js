// Webropol Floating Create Button Component - Fixed version
class WebropolFloatingButton extends HTMLElement {
  constructor() {
    super();
    this.showMenu = false;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = `
      <!-- Floating Create Menu -->
      <div class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <!-- Menu Items Grid -->
        <div class="floating-menu absolute bottom-16 left-1/2 transform -translate-x-1/2 transition-all duration-300 opacity-0 translate-y-4 pointer-events-none">
          <div class="bg-white rounded-2xl shadow-2xl p-6 border border-webropol-gray-200 min-w-64">
            <h3 class="text-lg font-bold text-webropol-gray-900 mb-4 text-center">Create New</h3>
            <div class="space-y-2">
              <!-- Surveys -->
              <button data-type="surveys"
                class="create-item-btn w-full flex items-center p-3 rounded-lg border border-webropol-gray-200 hover:border-webropol-teal-300 hover:bg-webropol-teal-50 transition-all duration-200 text-left">
                <i class="fas fa-poll-h text-webropol-teal-600 mr-3 w-5"></i>
                <div class="flex-1">
                  <span class="font-semibold text-webropol-gray-900 block">Surveys</span>
                  <span class="text-xs text-webropol-gray-500">Custom surveys</span>
                </div>
              </button>

              <!-- Events -->
              <button data-type="events"
                class="create-item-btn w-full flex items-center p-3 rounded-lg border border-webropol-gray-200 hover:border-webropol-teal-300 hover:bg-webropol-teal-50 transition-all duration-200 text-left">
                <i class="fas fa-calendar-alt text-webropol-teal-600 mr-3 w-5"></i>
                <div class="flex-1">
                  <span class="font-semibold text-webropol-gray-900 block">Events</span>
                  <span class="text-xs text-webropol-gray-500">Event management</span>
                </div>
              </button>

              <!-- EXW Surveys -->
              <button data-type="exw-surveys"
                class="create-item-btn w-full flex items-center p-3 rounded-lg border border-webropol-gray-200 hover:border-webropol-teal-300 hover:bg-webropol-teal-50 transition-all duration-200 text-left">
                <i class="fas fa-chart-line text-webropol-teal-600 mr-3 w-5"></i>
                <div class="flex-1">
                  <span class="font-semibold text-webropol-gray-900 block">EXW Surveys</span>
                  <span class="text-xs text-webropol-gray-500">Employee experience</span>
                </div>
              </button>

              <!-- Case Management -->
              <button data-type="case-management"
                class="create-item-btn w-full flex items-center p-3 rounded-lg border border-webropol-gray-200 hover:border-webropol-teal-300 hover:bg-webropol-teal-50 transition-all duration-200 text-left">
                <i class="fas fa-briefcase text-webropol-teal-600 mr-3 w-5"></i>
                <div class="flex-1">
                  <span class="font-semibold text-webropol-gray-900 block">Case Management</span>
                  <span class="text-xs text-webropol-gray-500">Manage cases</span>
                </div>
              </button>

              <!-- eTests -->
              <button data-type="etests"
                class="create-item-btn w-full flex items-center p-3 rounded-lg border border-webropol-gray-200 hover:border-webropol-teal-300 hover:bg-webropol-teal-50 transition-all duration-200 text-left">
                <i class="fas fa-clipboard-check text-webropol-teal-600 mr-3 w-5"></i>
                <div class="flex-1">
                  <span class="font-semibold text-webropol-gray-900 block">eTests</span>
                  <span class="text-xs text-webropol-gray-500">Online testing</span>
                </div>
              </button>

              <!-- Assessments -->
              <button data-type="assessments"
                class="create-item-btn w-full flex items-center p-3 rounded-lg border border-webropol-gray-200 hover:border-webropol-teal-300 hover:bg-webropol-teal-50 transition-all duration-200 text-left">
                <i class="fas fa-tasks text-webropol-teal-600 mr-3 w-5"></i>
                <div class="flex-1">
                  <span class="font-semibold text-webropol-gray-900 block">Assessments</span>
                  <span class="text-xs text-webropol-gray-500">Performance review</span>
                </div>
              </button>

              <!-- Touch Tablets -->
              <button data-type="touch-tablets"
                class="create-item-btn w-full flex items-center p-3 rounded-lg border border-webropol-gray-200 hover:border-webropol-teal-300 hover:bg-webropol-teal-50 transition-all duration-200 text-left">
                <i class="fas fa-tablet-alt text-webropol-teal-600 mr-3 w-5"></i>
                <div class="flex-1">
                  <span class="font-semibold text-webropol-gray-900 block">Touch Tablets</span>
                  <span class="text-xs text-webropol-gray-500">Tablet surveys</span>
                </div>
              </button>

              <!-- Direct Mobile Surveys -->
              <button data-type="mobile-surveys"
                class="create-item-btn w-full flex items-center p-3 rounded-lg border border-webropol-gray-200 hover:border-webropol-teal-300 hover:bg-webropol-teal-50 transition-all duration-200 text-left">
                <i class="fas fa-mobile-alt text-webropol-teal-600 mr-3 w-5"></i>
                <div class="flex-1">
                  <span class="font-semibold text-webropol-gray-900 block">Direct Mobile</span>
                  <span class="text-xs text-webropol-gray-500">Mobile optimized</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Main Floating Button -->
        <button class="main-toggle-btn w-14 h-14 bg-gradient-to-br from-webropol-teal-500 to-webropol-blue-600 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-white hover:scale-105 group">
          <i class="fas fa-plus text-xl transition-transform duration-300"></i>
        </button>
      </div>

      <!-- Backdrop -->
      <div class="floating-backdrop fixed inset-0 bg-black/20 z-30 transition-opacity duration-300 opacity-0 pointer-events-none">
      </div>
    `;
  }
  createItem(type) {
    // Handle different survey types with navigation
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('/') && !currentPath.endsWith('/index.html');
    const basePath = isInSubfolder ? '../' : '';
    
    const routes = {
      'surveys': `${basePath}create-new/survey-creator.html`,
      'events': `${basePath}events/`,
      'exw-surveys': `${basePath}create-new/survey-creator.html?type=exw`,
      'case-management': `${basePath}create-new/survey-creator.html?type=case`,
      'etests': `${basePath}create-new/survey-creator.html?type=test`,
      'assessments': `${basePath}create-new/survey-creator.html?type=assessment`,
      'touch-tablets': `${basePath}create-new/survey-creator.html?type=tablet`,
      'mobile-surveys': `${basePath}create-new/survey-creator.html?type=mobile`
    };

    const url = routes[type] || `${basePath}create-new/survey-creator.html`;
    window.location.href = url;
    this.closeMenu();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.updateMenuVisibility();
  }

  closeMenu() {
    this.showMenu = false;
    this.updateMenuVisibility();
  }

  updateMenuVisibility() {
    const menu = this.querySelector('.floating-menu');
    const backdrop = this.querySelector('.floating-backdrop');
    const icon = this.querySelector('.main-toggle-btn i');

    if (this.showMenu) {
      menu.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
      menu.classList.add('opacity-100', 'translate-y-0');
      backdrop.classList.remove('opacity-0', 'pointer-events-none');
      backdrop.classList.add('opacity-100');
      icon.classList.add('rotate-45');
    } else {
      menu.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
      menu.classList.remove('opacity-100', 'translate-y-0');
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      backdrop.classList.remove('opacity-100');
      icon.classList.remove('rotate-45');
    }
  }

  setupEventListeners() {
    // Main toggle button
    const toggleBtn = this.querySelector('.main-toggle-btn');
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    // Create item buttons
    const createBtns = this.querySelectorAll('.create-item-btn');
    createBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = btn.getAttribute('data-type');
        this.createItem(type);
      });
    });

    // Backdrop click
    const backdrop = this.querySelector('.floating-backdrop');
    backdrop.addEventListener('click', () => {
      this.closeMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target) && this.showMenu) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.showMenu) {
        this.closeMenu();
      }
    });
  }
}

// Register the custom element
customElements.define('webropol-floating-button', WebropolFloatingButton);

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebropolFloatingButton;
}
