/**
 * inject-components.js
 * 
 * Loads the unified design system core and initializes it across all pages
 * This is the main entry point for the design system on each page
 */
document.addEventListener('DOMContentLoaded', function() {
  // Check if the core script is already loaded
  if (!window.ds) {
    // Add loading indicator
    const loadingBar = document.createElement('div');
    loadingBar.className = 'fixed top-0 left-0 w-full h-1 bg-[#f3f4f4] z-50';
    loadingBar.innerHTML = '<div class="h-full w-1/3 bg-[#2aafd0] loading-animation"></div>';
    document.body.appendChild(loadingBar);
    
    // Add loading animation style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes loading-animation {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(300%); }
      }
      .loading-animation {
        animation: loading-animation 1.5s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    // Load the design system core script
    const script = document.createElement('script');
    script.src = 'ds-core.js';
    script.onload = function() {
      console.log('Webropol Design System initialized');
      
      // Remove loading indicator
      if (loadingBar.parentNode) {
        loadingBar.parentNode.removeChild(loadingBar);
      }
      
      // Initialize the design system
      if (typeof DesignSystem === 'function') {
        window.ds = new DesignSystem();
      }
      
      // When design system is loaded, check URL for any hash parameters
      const hash = window.location.hash;
      if (hash && hash.startsWith('#')) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };
    document.head.appendChild(script);
  }
});

// Utility functions that can be used even before DS is fully loaded
(function() {
  window.dsUtils = {
    // Show toast notification
    showToast: function(message, type) {
      if (window.ds) {
        window.ds.showToast({
          title: type === 'error' ? 'Error' : 'Notification',
          message: message,
          type: type || 'info'
        });
      } else {
        // Fallback toast if DS not loaded
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50';
        toast.innerHTML = `
          <div class="font-medium">${type === 'error' ? 'Error' : 'Notification'}</div>
          <div class="text-sm text-gray-600">${message}</div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translateX(100%)';
          toast.style.transition = 'all 0.3s ease';
          
          setTimeout(() => {
            if (toast.parentNode) {
              toast.parentNode.removeChild(toast);
            }
          }, 300);
        }, 3000);
      }
    },
    
    // Copy to clipboard utility
    copyToClipboard: async function(text) {
      try {
        await navigator.clipboard.writeText(text);
        this.showToast('Copied to clipboard', 'success');
        return true;
      } catch (err) {
        this.showToast('Failed to copy to clipboard', 'error');
        return false;
      }
    }
  };
})();