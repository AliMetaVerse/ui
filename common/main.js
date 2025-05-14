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
          content = content.replace(/src="\.\.\/common\/assets\//g, 'src="https://webropol.com/wp-content/themes/webropol/images/');
          
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
            // Style the container element properly
            element.style.width = '250px';
            element.style.minWidth = '250px';
            element.style.backgroundColor = '#fff';
            element.style.borderRight = '1px solid #e3eaf3';
            element.style.zIndex = '10';
            
            const sidebar = element.querySelector('.sidebar');
            if (sidebar) {
              // Apply direct styling to ensure proper display
              sidebar.style.width = '100%';
              sidebar.style.height = '100%';
              sidebar.style.display = 'flex';
              sidebar.style.flexDirection = 'column';
              sidebar.style.backgroundColor = '#fff';
              sidebar.classList.remove('scrollbar'); // Remove scrollbar class
              
              // Ensure Contact Us is visible at bottom
              const contactUs = sidebar.querySelector('.sidebar-contact');
              if (contactUs) {
                contactUs.style.position = 'sticky';
                contactUs.style.bottom = '0';
                contactUs.style.backgroundColor = '#fff';
                contactUs.style.padding = '15px';
                contactUs.style.borderTop = '1px solid #f0f0f0';
                contactUs.style.zIndex = '5';
              }
              
              // Make feature list scrollable but keep it contained
              const featuresList = sidebar.querySelector('.features-list-top');
              if (featuresList) {
                featuresList.style.flex = '1';
                featuresList.style.overflowY = 'auto';
                featuresList.style.overflowX = 'hidden';
                featuresList.style.paddingBottom = '10px';
              }
            }
          }
          
          // Apply special handling for header
          if (file.includes('header.html')) {
            element.style.width = '100%';
            element.style.backgroundColor = '#fff';
            element.style.borderBottom = '1px solid #e3eaf3';
            element.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.05)';
            element.style.zIndex = '5';
            
            const header = element.querySelector('.mainheader');
            if (header) {
              header.style.width = '100%';
              header.style.display = 'flex';
              header.style.alignItems = 'center';
              header.style.backgroundColor = '#fff';
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
