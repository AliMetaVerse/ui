/**
 * Edit Page Content Loader
 * 
 * This script loads the edit page content from a separate HTML file
 * and injects it into the main-content-body element
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get the container where the content will be inserted
    const mainContentBody = document.querySelector('.main-content-body');
    
    if (!mainContentBody) {
        console.error('Could not find .main-content-body element');
        return;
    }
    
    // Fetch the edit page content
    fetch('components/edit-page-content.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load edit page content');
            }
            return response.text();
        })
        .then(html => {
            // Insert the HTML into the main content body
            mainContentBody.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading edit page content:', error);
        });
});
