class WebropolButton extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'md';
    const disabled = this.hasAttribute('disabled');
    const fullWidth = this.hasAttribute('full-width');
    const icon = this.getAttribute('icon');
    const iconPosition = this.getAttribute('icon-position') || 'left';
    const href = this.getAttribute('href');
    const target = this.getAttribute('target');
    const text = this.textContent.trim();

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm font-medium',
      md: 'px-6 py-2.5 text-sm font-semibold',
      lg: 'px-8 py-3 text-base font-semibold',
      xl: 'px-10 py-4 text-lg font-semibold'
    };

    // Variant classes
    const variantClasses = {
      primary: `
        bg-gradient-to-r from-webropol-teal-500 to-webropol-blue-600 
        text-white border-2 border-transparent
        hover:from-webropol-teal-600 hover:to-webropol-blue-700 
        focus:ring-4 focus:ring-webropol-teal-200 focus:ring-opacity-50
        active:from-webropol-teal-700 active:to-webropol-blue-800
        disabled:from-webropol-gray-300 disabled:to-webropol-gray-400 
        disabled:cursor-not-allowed disabled:opacity-60
        shadow-medium hover:shadow-lg
      `,
      secondary: `
        bg-white text-webropol-teal-700 
        border-2 border-webropol-teal-500
        hover:bg-webropol-teal-50 hover:border-webropol-teal-600
        focus:ring-4 focus:ring-webropol-teal-200 focus:ring-opacity-50
        active:bg-webropol-teal-100 active:border-webropol-teal-700
        disabled:bg-webropol-gray-100 disabled:text-webropol-gray-400 
        disabled:border-webropol-gray-300 disabled:cursor-not-allowed
        shadow-card hover:shadow-medium
      `,
      tertiary: `
        bg-transparent text-webropol-teal-700 
        border-2 border-transparent
        hover:bg-webropol-teal-50 hover:text-webropol-teal-800
        focus:ring-4 focus:ring-webropol-teal-200 focus:ring-opacity-50
        active:bg-webropol-teal-100
        disabled:text-webropol-gray-400 disabled:cursor-not-allowed
        disabled:hover:bg-transparent
      `,
      danger: `
        bg-gradient-to-r from-red-500 to-red-600 
        text-white border-2 border-transparent
        hover:from-red-600 hover:to-red-700 
        focus:ring-4 focus:ring-red-200 focus:ring-opacity-50
        active:from-red-700 active:to-red-800
        disabled:from-webropol-gray-300 disabled:to-webropol-gray-400 
        disabled:cursor-not-allowed disabled:opacity-60
        shadow-medium hover:shadow-lg
      `,
      success: `
        bg-gradient-to-r from-green-500 to-green-600 
        text-white border-2 border-transparent
        hover:from-green-600 hover:to-green-700 
        focus:ring-4 focus:ring-green-200 focus:ring-opacity-50
        active:from-green-700 active:to-green-800
        disabled:from-webropol-gray-300 disabled:to-webropol-gray-400 
        disabled:cursor-not-allowed disabled:opacity-60
        shadow-medium hover:shadow-lg
      `
    };

    // Base classes
    const baseClasses = `
      inline-flex items-center justify-center
      rounded-full font-sans
      transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-offset-2
      transform hover:scale-105 active:scale-95
      ${disabled ? 'transform-none hover:scale-100' : ''}
      ${fullWidth ? 'w-full' : ''}
    `;

    // Icon rendering
    const renderIcon = () => {
      if (!icon) return '';
      const iconClasses = text ? (iconPosition === 'right' ? 'ml-2' : 'mr-2') : '';
      return `<i class="${icon} ${iconClasses}"></i>`;
    };

    // Create the element
    const element = href ? 'a' : 'button';
    const attributes = href ? 
      `href="${href}" ${target ? `target="${target}"` : ''}` : 
      `type="button" ${disabled ? 'disabled' : ''}`;

    this.innerHTML = `
      <${element} 
        ${attributes}
        class="${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}"
      >
        ${iconPosition === 'left' ? renderIcon() : ''}
        ${text ? `<span>${text}</span>` : ''}
        ${iconPosition === 'right' ? renderIcon() : ''}
      </${element}>
    `;

    // Copy over any click handlers or other attributes
    const createdElement = this.querySelector(element);
    
    // Forward click events
    createdElement.addEventListener('click', (e) => {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      // Dispatch a custom event that bubbles up
      this.dispatchEvent(new CustomEvent('button-click', {
        bubbles: true,
        detail: { originalEvent: e }
      }));
    });

    // Forward any other event listeners
    const events = ['mouseover', 'mouseout', 'focus', 'blur'];
    events.forEach(eventType => {
      createdElement.addEventListener(eventType, (e) => {
        this.dispatchEvent(new CustomEvent(`button-${eventType}`, {
          bubbles: true,
          detail: { originalEvent: e }
        }));
      });
    });
  }
}

customElements.define('webropol-button', WebropolButton);
