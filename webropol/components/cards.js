// Standard Card Component
class WebropolCard extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute('variant') || 'standard';
    const gradient = this.getAttribute('gradient') || '';
    const hoverable = this.hasAttribute('hoverable');
    const elevated = this.hasAttribute('elevated');
    
    // Base card classes
    const baseClasses = `
      rounded-2xl border transition-all duration-200 
      ${hoverable ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''}
      ${elevated ? 'shadow-medium' : 'shadow-card'}
    `;

    // Variant classes
    const variantClasses = {
      standard: 'bg-white border-webropol-gray-200',
      light: 'bg-white/80 border-webropol-teal-100',
      gradient: gradient ? 
        `bg-gradient-to-br ${gradient} border-webropol-teal-100` : 
        'bg-gradient-to-br from-webropol-blue-50 to-webropol-teal-50/80 border-webropol-teal-100',
      glass: 'bg-white/70 backdrop-blur-xl border-webropol-gray-200/50'
    };

    this.innerHTML = `
      <div class="${baseClasses} ${variantClasses[variant]}">
        <slot></slot>
      </div>
    `;

    // Add click handler for hoverable cards
    if (hoverable) {
      this.addEventListener('click', (e) => {
        this.dispatchEvent(new CustomEvent('card-click', {
          bubbles: true,
          detail: { originalEvent: e }
        }));
      });
    }
  }
}

// Card Header Component
class WebropolCardHeader extends HTMLElement {
  connectedCallback() {
    const icon = this.getAttribute('icon');
    const title = this.getAttribute('title');
    const subtitle = this.getAttribute('subtitle');
    const badge = this.getAttribute('badge');
    const badgeVariant = this.getAttribute('badge-variant') || 'default';
    
    const badgeClasses = {
      default: 'bg-webropol-gray-700 text-white',
      primary: 'bg-webropol-teal-600 text-white',
      success: 'bg-green-600 text-white',
      warning: 'bg-yellow-600 text-white',
      danger: 'bg-red-600 text-white'
    };

    this.innerHTML = `
      <div class="flex items-start justify-between p-6 ${subtitle ? 'pb-4' : ''}">
        <div class="flex items-center space-x-4 flex-1">
          ${icon ? `<div class="flex-shrink-0">
            <i class="${icon} text-3xl text-webropol-teal-600"></i>
          </div>` : ''}
          <div class="flex-1 min-w-0">
            ${title ? `<h3 class="text-lg font-semibold text-webropol-gray-900 truncate">${title}</h3>` : ''}
            ${subtitle ? `<p class="text-sm text-webropol-gray-600 mt-1">${subtitle}</p>` : ''}
            <slot></slot>
          </div>
        </div>
        ${badge ? `<span class="text-xs px-3 py-1 rounded-full font-medium ${badgeClasses[badgeVariant]} flex-shrink-0">${badge}</span>` : ''}
      </div>
    `;
  }
}

// Card Content Component
class WebropolCardContent extends HTMLElement {
  connectedCallback() {
    const padding = this.getAttribute('padding') || 'normal';
    
    const paddingClasses = {
      none: '',
      sm: 'px-4 pb-4',
      normal: 'px-6 pb-6',
      lg: 'px-8 pb-8'
    };

    this.innerHTML = `
      <div class="${paddingClasses[padding]}">
        <slot></slot>
      </div>
    `;
  }
}

// Card List Component
class WebropolCardList extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title');
    const collapsible = this.hasAttribute('collapsible');
    const defaultOpen = this.hasAttribute('default-open') || !collapsible;
    
    this.innerHTML = `
      <div class="p-6" ${collapsible ? `x-data="{ open: ${defaultOpen} }"` : ''}>
        ${title ? `
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-webropol-gray-900">${title}</h3>
            ${collapsible ? `
              <button @click="open = !open" class="text-webropol-teal-600 hover:text-webropol-teal-700 transition-colors">
                <i class="fas fa-chevron-down transition-transform duration-200" :class="{ 'rotate-180': open }"></i>
              </button>
            ` : ''}
          </div>
        ` : ''}
        <div class="space-y-3" ${collapsible ? 'x-show="open" x-transition' : ''}>
          <slot></slot>
        </div>
      </div>
    `;
  }
}

// Card List Item Component
class WebropolCardListItem extends HTMLElement {
  connectedCallback() {
    const icon = this.getAttribute('icon');
    const title = this.getAttribute('title');
    const subtitle = this.getAttribute('subtitle');
    const action = this.getAttribute('action');
    const actionIcon = this.getAttribute('action-icon');
    const status = this.getAttribute('status');
    const clickable = this.hasAttribute('clickable');
    
    const statusClasses = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      pending: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700'
    };

    this.innerHTML = `
      <div class="flex items-center justify-between p-4 rounded-xl bg-webropol-gray-50/50 hover:bg-webropol-gray-50 transition-colors ${clickable ? 'cursor-pointer hover:shadow-card' : ''}">
        <div class="flex items-center space-x-3 flex-1 min-w-0">
          ${icon ? `<i class="${icon} text-webropol-teal-600 text-lg flex-shrink-0"></i>` : ''}
          <div class="flex-1 min-w-0">
            ${title ? `<div class="font-medium text-webropol-gray-900 truncate">${title}</div>` : ''}
            ${subtitle ? `<div class="text-sm text-webropol-gray-600 truncate">${subtitle}</div>` : ''}
            <slot></slot>
          </div>
        </div>
        <div class="flex items-center space-x-3 flex-shrink-0">
          ${status ? `<span class="text-xs px-2 py-1 rounded-full font-medium ${statusClasses[status]}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>` : ''}
          ${action ? `<button class="text-webropol-teal-600 hover:text-webropol-teal-700 font-medium text-sm transition-colors">
            ${actionIcon ? `<i class="${actionIcon} mr-1"></i>` : ''}${action}
          </button>` : ''}
          <slot name="actions"></slot>
        </div>
      </div>
    `;

    if (clickable) {
      this.addEventListener('click', (e) => {
        this.dispatchEvent(new CustomEvent('list-item-click', {
          bubbles: true,
          detail: { originalEvent: e }
        }));
      });
    }
  }
}

// Card Actions/Footer Component
class WebropolCardActions extends HTMLElement {
  connectedCallback() {
    const alignment = this.getAttribute('alignment') || 'right';
    const padding = this.getAttribute('padding') || 'normal';
    
    const alignmentClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between'
    };
    
    const paddingClasses = {
      none: '',
      sm: 'px-4 pb-4 pt-2',
      normal: 'px-6 pb-6 pt-4',
      lg: 'px-8 pb-8 pt-6'
    };

    this.innerHTML = `
      <div class="flex items-center space-x-3 border-t border-webropol-gray-100 ${paddingClasses[padding]} ${alignmentClasses[alignment]}">
        <slot></slot>
      </div>
    `;
  }
}

// Gradient Card Component (Homepage style)
class WebropolGradientCard extends HTMLElement {
  connectedCallback() {
    const icon = this.getAttribute('icon');
    const title = this.getAttribute('title');
    const subtitle = this.getAttribute('subtitle');
    const buttonText = this.getAttribute('button-text');
    const buttonHref = this.getAttribute('button-href');
    const linkText = this.getAttribute('link-text');
    const linkHref = this.getAttribute('link-href');
    const badge = this.getAttribute('badge');
    const gradient = this.getAttribute('gradient') || 'from-webropol-blue-100 to-webropol-teal-100/80';
    
    this.innerHTML = `
      <div class="relative rounded-2xl bg-gradient-to-br ${gradient} p-6 flex flex-col items-center shadow-card border border-webropol-teal-100 transition-shadow duration-200 hover:shadow-2xl">
        ${badge ? `
          <span class="absolute top-4 right-4 bg-webropol-gray-700 text-white text-xs px-3 py-1 rounded-full">
            ${badge}
          </span>
        ` : ''}
        ${icon ? `<i class="${icon} text-4xl text-webropol-teal-600 mb-4"></i>` : ''}
        ${title ? `<div class="font-semibold text-lg text-webropol-gray-900 mb-2 text-center">${title}</div>` : ''}
        ${subtitle ? `<div class="text-sm text-webropol-gray-600 text-center mb-4">${subtitle}</div>` : ''}
        <slot></slot>
        ${buttonText ? `
          <webropol-button variant="primary" class="mt-2" ${buttonHref ? `href="${buttonHref}"` : ''}>
            ${buttonText}
          </webropol-button>
        ` : ''}
        ${linkText ? `
          <a href="${linkHref || '#'}" class="mt-2 text-webropol-teal-700 font-semibold hover:underline">${linkText}</a>
        ` : ''}
      </div>
    `;
  }
}

// Add global design tokens for Webropol components
if (!document.getElementById('webropol-design-tokens')) {
  const style = document.createElement('style');
  style.id = 'webropol-design-tokens';
  style.innerHTML = `
    :root {
      --wr-radius-card: 1rem;
      --wr-radius-button: 9999px;
      --wr-shadow-card: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06);
      --wr-shadow-medium: 0 4px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
      --wr-shadow-soft: 0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04);
      --wr-color-primary: #06b6d4;
      --wr-color-primary-dark: #0891b2;
      --wr-color-secondary: #64748b;
      --wr-color-bg: #fff;
      --wr-color-bg-gradient: linear-gradient(135deg, #f0fdff 0%, #ccf7fe 100%);
      --wr-color-border: #e2e8f0;
      --wr-color-shadow: rgba(0,0,0,0.07);
      --wr-color-success: #22c55e;
      --wr-color-danger: #ef4444;
      --wr-color-warning: #f59e42;
      --wr-color-info: #3b82f6;
      --wr-font-family: 'Inter', system-ui, sans-serif;
      --wr-spacing: 1.5rem;
      --wr-spacing-sm: 1rem;
      --wr-spacing-lg: 2rem;
    }
    .wr-card {
      border-radius: var(--wr-radius-card);
      box-shadow: var(--wr-shadow-card);
      background: var(--wr-color-bg);
      font-family: var(--wr-font-family);
      border: 1px solid var(--wr-color-border);
      padding: var(--wr-spacing);
    }
    .wr-card-gradient {
      background: var(--wr-color-bg-gradient);
    }
    .wr-card-header {
      font-weight: 600;
      font-size: 1.125rem;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .wr-card-badge {
      border-radius: var(--wr-radius-button);
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      font-weight: 500;
      background: var(--wr-color-primary);
      color: #fff;
    }
    .wr-card-content {
      font-size: 1rem;
      color: #475569;
      margin-top: 0.5rem;
    }
    .wr-card-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      justify-content: flex-end;
    }
    .wr-list-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--wr-color-border);
    }
    .wr-list-item:last-child {
      border-bottom: none;
    }
    .wr-list-item-icon {
      color: var(--wr-color-primary);
      font-size: 1.25rem;
    }
    .wr-list-item-title {
      font-weight: 500;
      color: #0f172a;
    }
    .wr-list-item-subtitle {
      font-size: 0.875rem;
      color: #64748b;
    }
    .wr-list-item-status {
      border-radius: var(--wr-radius-button);
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      font-weight: 500;
      background: var(--wr-color-success);
      color: #fff;
    }
  `;
  document.head.appendChild(style);
}

// Register all components
customElements.define('webropol-card', WebropolCard);
customElements.define('webropol-card-header', WebropolCardHeader);
customElements.define('webropol-card-content', WebropolCardContent);
customElements.define('webropol-card-list', WebropolCardList);
customElements.define('webropol-card-list-item', WebropolCardListItem);
customElements.define('webropol-card-actions', WebropolCardActions);
customElements.define('webropol-gradient-card', WebropolGradientCard);
