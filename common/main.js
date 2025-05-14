async function includeHTML() {
  const includeElements = document.querySelectorAll('[include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    const file = element.getAttribute("include-html");
    if (file) {
      try {
        const response = await fetch(file);
        if (response.ok) {
          element.innerHTML = await response.text();
        } else {
          element.innerHTML = "Page not found.";
        }
      } catch (error) {
        console.error('Error fetching HTML:', error);
        element.innerHTML = "Error loading content.";
      }
    }
  }
}

// Automatically call includeHTML when the DOM is loaded
document.addEventListener('DOMContentLoaded', includeHTML);
