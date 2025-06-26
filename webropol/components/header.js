class WebropolHeader extends HTMLElement {
  connectedCallback() {
    const username = this.getAttribute('username') || 'Ali Al-Zuhairi';
    this.innerHTML = `
      <header class="min-h-[5rem] h-40 glass-effect border-b border-webropol-gray-200/50 flex items-center justify-between px-8 shadow-soft">
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
