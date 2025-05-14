async function includeHTML() {
  const includeElements = document.querySelectorAll('[include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    const file = element.getAttribute("include-html");
    if (file) {
      try {
        const response = await fetch(file);
        if (response.ok) {
          let content = await response.text();
          
          // Fix image paths in content
          content = content.replace(/src="\.\.\/common\/Survey publish_files\//g, 'src="https://webropol.com/wp-content/themes/webropol/images/');
          
          element.innerHTML = content;
          element.classList.remove('hidden'); // Remove hidden class after content is loaded
          
          // Process any stylesheets in the included content
          const linkElements = element.querySelectorAll('link[rel="stylesheet"]');
          linkElements.forEach(link => {
            if (!document.querySelector(`link[href="${link.getAttribute('href')}"]`)) {
              document.head.appendChild(link.cloneNode(true));
            }
          });
          
          // Apply special handling for sidebar
          if (file.includes('sidebar.html')) {
            const sidebar = element.querySelector('.sidebar');
            if (sidebar) {
              sidebar.classList.remove('scrollbar'); // Remove scrollbar class
              
              // Ensure Contact Us is visible at bottom
              const contactUs = sidebar.querySelector('.sidebar-contact');
              if (contactUs) {
                contactUs.style.position = 'sticky';
                contactUs.style.bottom = '0';
                contactUs.style.zIndex = '5';
              }
              
              // Make feature list scrollable
              const featuresList = sidebar.querySelector('.features-list-top');
              if (featuresList) {
                featuresList.style.flex = '1';
                featuresList.style.overflowY = 'auto';
              }
            }
          }
        } else {
          console.error('Failed to load HTML file:', file);
          element.innerHTML = "Page not found.";
        }
      } catch (error) {
        console.error('Error fetching HTML:', error, file);
        element.innerHTML = "Error loading content.";
      }
    }
  }
}

// Automatically call includeHTML when the DOM is loaded
document.addEventListener('DOMContentLoaded', includeHTML);
