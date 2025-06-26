class WebropolSidebar extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute('active') || 'home';
    const base = this.getAttribute('base') || '';
    // Helper to prefix base to links - ensure proper path concatenation
    const link = (path) => {
      if (!base) return path;
      // Ensure base ends with / and path doesn't start with /
      const normalizedBase = base.endsWith('/') ? base : base + '/';
      const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
      return normalizedBase + normalizedPath;
    };
    this.innerHTML = `
      <aside class="h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-webropol-gray-200/50 flex flex-col flex-shrink-0 shadow-soft">
        <div class="h-20 flex items-center px-8 border-b border-webropol-gray-200/50">
          <div class="w-10 h-10 bg-gradient-to-br from-webropol-teal-500 to-webropol-blue-600 rounded-xl flex items-center justify-center">
            <i class="fas fa-chart-bar text-white text-lg"></i>
          </div>
          <div class="ml-3">
            <h1 class="font-bold text-webropol-gray-900 text-lg">Webropol</h1>
            <p class="text-xs text-webropol-gray-500 -mt-1">Survey Platform</p>
          </div>
        </div>
        <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <a href="${link('index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='home' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-blue-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
            <i class="fas fa-home w-5 mr-4 group-hover:scale-110 transition-transform"></i>
            <span class="font-medium">Home</span>
          </a>
          <a href="${link('surveys/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='surveys' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-blue-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
            <i class="fas fa-poll-h w-5 mr-4"></i>
            <span>Surveys</span>
          </a>
          <a href="${link('events/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='events' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-blue-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
            <i class="fas fa-calendar-alt w-5 mr-4 group-hover:scale-110 transition-transform"></i>
            <span class="font-medium">Events</span>
          </a>
          <a href="${link('sms/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='sms' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-blue-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
            <i class="fas fa-sms w-5 mr-4 group-hover:scale-110 transition-transform"></i>
            <span class="font-medium">2-Way SMS</span>
          </a>
          <a href="${link('dashboards/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='dashboards' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-blue-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
            <i class="fas fa-chart-line w-5 mr-4 group-hover:scale-110 transition-transform"></i>
            <span class="font-medium">Dashboards</span>
          </a>
          <div class="pt-4 border-t border-webropol-gray-200/50 mt-4">
            <a href="${link('mywebropol/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='mywebropol' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-blue-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
              <i class="fas fa-book-open w-5 mr-4 group-hover:scale-110 transition-transform"></i>
              <span class="font-medium">MyWebropol</span>
            </a>
            <a href="${link('admin-tools/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='admin-tools' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-blue-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
              <i class="fas fa-tools w-5 mr-4 group-hover:scale-110 transition-transform"></i>
              <span class="font-medium">Admin Tools</span>
            </a>
            <a href="${link('training-videos/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='training-videos' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-blue-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
              <i class="fas fa-video w-5 mr-4 group-hover:scale-110 transition-transform"></i>
              <span class="font-medium">Training Videos</span>
            </a>
            <a href="${link('shop/index.html')}" class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${active==='shop' ? 'bg-gradient-to-r from-webropol-teal-500 to-webropol-blue-600 text-white shadow-medium' : 'text-webropol-gray-600 hover:bg-webropol-teal-50 hover:text-webropol-teal-700'}">
              <i class="fas fa-shopping-cart w-5 mr-4 group-hover:scale-110 transition-transform"></i>
              <span class="font-medium">Shop</span>
            </a>
          </div>
        </nav>
        <div class="mt-auto px-4 pb-6">
          <a href="#" class="flex items-center px-4 py-3 rounded-xl font-semibold text-webropol-teal-700 hover:bg-webropol-teal-50 transition-all duration-200">
            <i class="fas fa-envelope w-5 mr-4"></i>
            <span>Contact Us</span>
          </a>
        </div>
      </aside>
    `;
  }
}
customElements.define('webropol-sidebar', WebropolSidebar);

class WebropolHeader extends HTMLElement {
  connectedCallback() {
    const username = this.getAttribute('username') || 'Ali Al-Zuhairi';
    this.innerHTML = `
      <header class="h-20 min-h-20 glass-effect border-b border-webropol-gray-200/50 flex items-center justify-between px-8 shadow-soft">
        <div class="flex items-center space-x-4"></div>
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-3">
            <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-teal-600 hover:bg-webropol-teal-50 rounded-xl transition-all">
              <i class="fas fa-bell"></i>
            </button>
            <button class="w-10 h-10 flex items-center justify-center text-webropol-gray-500 hover:text-webropol-teal-600 hover:bg-webropol-teal-50 rounded-xl transition-all">
              <i class="fas fa-question-circle"></i>
            </button>
            <div class="relative">
              <button class="flex items-center text-webropol-gray-700 hover:text-webropol-teal-600 transition-colors">
                <span class="mr-2 font-medium">${username}</span>
                <i class="fas fa-chevron-down text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }
}
customElements.define('webropol-header', WebropolHeader);
