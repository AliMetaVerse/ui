/**
 * EmailJS Connection Tester
 * This script provides a way to test EmailJS connection directly from the configuration dialog.
 */

// Function to add the test connection button to the EmailJS configuration dialog
function addTestConnectionButton() {
    // Wait for the configuration dialog to be opened
    const checkInterval = setInterval(() => {
        const emailjsFields = document.getElementById('emailjs-fields');
        
        if (emailjsFields && !document.getElementById('test-connection-btn')) {
            // Create the test connection container
            const testConnectionDiv = document.createElement('div');
            testConnectionDiv.id = 'emailjs-test-connection';
            testConnectionDiv.style.marginBottom = '20px';
            testConnectionDiv.style.backgroundColor = '#f9fafb';
            testConnectionDiv.style.padding = '15px';
            testConnectionDiv.style.borderRadius = '5px';
            testConnectionDiv.style.textAlign = 'center';
            
            // Add content
            testConnectionDiv.innerHTML = `
                <p style="margin: 0 0 10px 0;">Test your EmailJS configuration before saving</p>
                <button id="test-connection-btn" style="padding: 10px 15px; background-color: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Connection</button>
                <div id="connection-result" style="margin-top: 10px; font-size: 14px;"></div>
            `;
            
            // Insert after the EmailJS fields
            const parentElement = emailjsFields.parentNode;
            parentElement.insertBefore(testConnectionDiv, emailjsFields.nextSibling);
            
            // Add event listener for the test button
            document.getElementById('test-connection-btn').addEventListener('click', function() {
                testEmailJSConnection();
            });
            
            // Since we found it, clear the interval
            clearInterval(checkInterval);
        }
    }, 500); // Check every half second
    
    // Clear interval after 10 seconds to avoid memory leaks
    setTimeout(() => {
        clearInterval(checkInterval);
    }, 10000);
}

// Function to test the EmailJS connection with current form values (not saved yet)
function testEmailJSConnection() {
    // Get values from the form fields
    const serviceId = document.getElementById('service-id-input')?.value?.trim();
    const templateId = document.getElementById('template-id-input')?.value?.trim();
    const publicKey = document.getElementById('public-key-input')?.value?.trim();
    const fromEmail = document.getElementById('from-email-input')?.value?.trim();
    const fromName = document.getElementById('from-name-input')?.value?.trim();
    
    const resultDiv = document.getElementById('connection-result');
    if (!resultDiv) return;
    
    // Validate input
    if (!serviceId || !templateId || !publicKey || !fromEmail) {
        resultDiv.innerHTML = `
            <span style="color: #ef4444; font-weight: 500;">
                ⚠ Please fill in all required fields first
            </span>
        `;
        return;
    }
    
    // Show loading state
    resultDiv.innerHTML = `
        <span style="color: #6366f1;">
            <span class="loading-dots">Testing connection...</span>
        </span>
    `;
    
    // Add loading animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes blink {
            0% { opacity: .2; }
            20% { opacity: 1; }
            100% { opacity: .2; }
        }
        .loading-dots::after {
            content: '...';
            animation: blink 1.4s infinite both;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize EmailJS with the current public key
    if (window.emailjs) {
        emailjs.init(publicKey);
    } else {
        resultDiv.innerHTML = `
            <span style="color: #ef4444; font-weight: 500;">
                ⚠ EmailJS SDK not loaded. Please refresh the page and try again.
            </span>
        `;
        return;
    }
    
    // Test the connection with a minimal payload
    emailjs.send(serviceId, templateId, {
        to_email: 'test@example.com',
        subject: 'Connection Test',
        message_html: 'This is a connection test.',
        from_name: fromName || 'Test Sender',
        from_email: fromEmail
    })
    .then(function(response) {
        // Show success message
        resultDiv.innerHTML = `
            <span style="color: #10b981; font-weight: 500;">
                ✓ Connection successful! Your configuration works correctly.
            </span>
        `;
    })
    .catch(function(error) {
        // Show error message
        resultDiv.innerHTML = `
            <span style="color: #ef4444; font-weight: 500;">
                ✗ Connection failed: ${error.text || 'Unknown error'}
            </span>
            <div style="margin-top: 5px; font-size: 12px; color: #666;">
                Check your Service ID, Template ID, and Public Key
            </div>
        `;
    });
}

// Add the test button when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the config dialog to open
    document.body.addEventListener('click', function(event) {
        if (event.target && (event.target.id === 'email-settings-btn' || 
                             event.target.closest('#email-settings-btn'))) {
            // The settings button was clicked, add our test connection button
            setTimeout(addTestConnectionButton, 300);
        }
    });
});
