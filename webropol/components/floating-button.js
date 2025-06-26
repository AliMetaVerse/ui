// Webropol Floating Create Button Component
class WebropolfloatingButton extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = this.render();
        this.setupEventListeners();
    }

    static get observedAttributes() {
        return ['items', 'position', 'theme'];
    }

    connectedCallback() {
        // Initialize Alpine.js data if not already present
        if (!window.Alpine) {
            console.warn('Alpine.js is required for the floating button component');
            return;
        }
    }

    get items() {
        const itemsAttr = this.getAttribute('items');
        if (itemsAttr) {
            try {
                return JSON.parse(itemsAttr);
            } catch (e) {
                console.error('Invalid items JSON:', e);
                return this.getDefaultItems();
            }
        }
        return this.getDefaultItems();
    }

    get position() {
        return this.getAttribute('position') || 'bottom-center';
    }

    get theme() {
        return this.getAttribute('theme') || 'teal-blue';
    }

    getDefaultItems() {
        return [
            {
                id: 'surveys',
                label: 'Survey',
                description: 'Create custom surveys',
                icon: 'fas fa-poll-h',
                url: '../surveys/create.html'
            },
            {
                id: 'sms',
                label: 'SMS Campaign',
                description: 'SMS messaging',
                icon: 'fas fa-sms',
                url: '../sms/create.html'
            },
            {
                id: 'events',
                label: 'Event',
                description: 'Event management',
                icon: 'fas fa-calendar-alt',
                url: '../events/create.html'
            },
            {
                id: 'dashboards',
                label: 'Dashboard',
                description: 'Data visualization',
                icon: 'fas fa-chart-line',
                url: '../dashboards/create.html'
            }
        ];
    }

    getPositionClasses() {
        const positions = {
            'bottom-center': 'fixed bottom-8 left-1/2 transform -translate-x-1/2',
            'bottom-right': 'fixed bottom-8 right-8',
            'bottom-left': 'fixed bottom-8 left-8'
        };
        return positions[this.position] || positions['bottom-center'];
    }

    getThemeClasses() {
        const themes = {
            'teal-blue': {
                button: 'bg-gradient-to-r from-webropol-teal-500 to-webropol-blue-600 hover:from-webropol-teal-600 hover:to-webropol-blue-700',
                menuItem: 'hover:bg-webropol-teal-50 group-hover:text-webropol-teal-600'
            },
            'blue': {
                button: 'bg-webropol-blue-500 hover:bg-webropol-blue-600',
                menuItem: 'hover:bg-webropol-blue-50 group-hover:text-webropol-blue-600'
            }
        };
        return themes[this.theme] || themes['teal-blue'];
    }

    setupEventListeners() {
        // Add click event delegation for menu items
        this.addEventListener('click', (e) => {
            const menuItem = e.target.closest('[data-create-item]');
            if (menuItem) {
                const itemId = menuItem.getAttribute('data-create-item');
                const url = menuItem.getAttribute('data-url');
                this.handleCreateItem(itemId, url);
            }
        });
    }

    handleCreateItem(itemId, url) {
        // Close the menu first
        const event = new CustomEvent('webropol:close-floating-menu');
        this.dispatchEvent(event);
        
        // Navigate to the URL or emit a custom event
        if (url && url !== '#') {
            window.location.href = url;
        } else {
            // Emit custom event for handling in parent component
            const createEvent = new CustomEvent('webropol:create-item', {
                detail: { itemId, type: itemId }
            });
            this.dispatchEvent(createEvent);
        }
    }

    render() {
        const items = this.items;
        const positionClasses = this.getPositionClasses();
        const themeClasses = this.getThemeClasses();

        return `
            <div class="${positionClasses} z-40" x-data="{ showFloatingMenu: false }" @click.away="showFloatingMenu = false">
                <!-- Create Menu (appears above button) -->
                <div x-show="showFloatingMenu" x-cloak
                    x-transition:enter="ease-out duration-200" 
                    x-transition:enter-start="opacity-0 translate-y-4 scale-95"
                    x-transition:enter-end="opacity-100 translate-y-0 scale-100" 
                    x-transition:leave="ease-in duration-150"
                    x-transition:leave-start="opacity-100 translate-y-0 scale-100" 
                    x-transition:leave-end="opacity-0 translate-y-4 scale-95"
                    class="absolute bottom-20 left-1/2 transform -translate-x-1/2 mb-4">
                    
                    <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-webropol-gray-200/50 py-3 min-w-[280px]" @click.stop>
                        <div class="space-y-1">
                            ${items.map(item => `
                                <button data-create-item="${item.id}" data-url="${item.url || '#'}"
                                    class="group w-full flex items-center px-4 py-3 ${themeClasses.menuItem} transition-all duration-200 text-left">
                                    <i class="${item.icon} text-webropol-gray-700 text-lg mr-4 transition-colors"></i>
                                    <div class="flex-1">
                                        <div class="font-medium text-webropol-gray-900">${item.label}</div>
                                        <div class="text-xs text-webropol-gray-500">${item.description}</div>
                                    </div>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Main Floating Button -->
                <button @click.stop="showFloatingMenu = !showFloatingMenu"
                    class="group relative w-16 h-16 ${themeClasses.button} rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95">
                    
                    <!-- Plus Icon -->
                    <div class="absolute inset-0 flex items-center justify-center transition-transform duration-200"
                        :class="showFloatingMenu ? 'rotate-45' : 'rotate-0'">
                        <i class="fas fa-plus text-white text-xl font-bold"></i>
                    </div>
                    
                    <!-- Ripple Effect -->
                    <div class="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 group-hover:opacity-75 transition-all duration-300"></div>
                    
                    <!-- Tooltip -->
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Create New
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
                    </div>
                </button>

                <!-- Backdrop for floating menu -->
                <div x-show="showFloatingMenu" x-cloak @click="showFloatingMenu = false"
                    class="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
                    x-transition:enter="ease-out duration-200" 
                    x-transition:enter-start="opacity-0"
                    x-transition:enter-end="opacity-100" 
                    x-transition:leave="ease-in duration-150"
                    x-transition:leave-start="opacity-100" 
                    x-transition:leave-end="opacity-0">
                </div>
            </div>
        `;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.innerHTML = this.render();
            this.setupEventListeners();
        }
    }
}

// Register the custom element
customElements.define('webropol-floating-button', WebropolfloatingButton);

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebropolfloatingButton;
}
