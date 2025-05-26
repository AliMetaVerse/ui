// EmailJS integration for email campaign sender tool - Set as Default Service

// Load the EmailJS SDK
const emailjsScript = document.createElement('script');
emailjsScript.src = 'https://cdn.emailjs.com/dist/email.min.js';
document.head.appendChild(emailjsScript);

// Initialize EmailJS when script is loaded
emailjsScript.onload = function() {
    // Initialize with stored public key if available
    (function() {
        const publicKey = localStorage.getItem('emailjs_public_key') || '';
        if (publicKey) {
            try {
                emailjs.init(publicKey);
                console.log('EmailJS initialized with stored public key');
                
                // Log initialization success with subtle notification
                setTimeout(() => {
                    showNotification('Email system initialized successfully', 'success');
                }, 1000);
            } catch (error) {
                console.error('Failed to initialize EmailJS:', error);
                showNotification('Email system initialization failed', 'error');
            }
        } else {
            console.warn('No EmailJS public key found. Email sending will not work until configured.');
        }
    })();
    console.log('EmailJS SDK loaded successfully');
};

// When the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Pre-configure EmailJS settings as the default service
    preConfigureEmailJS();
    
    // Show a console message indicating EmailJS is the default
    console.log('EmailJS is configured as the default email service for sending actual emails');
});

// Pre-configure EmailJS as the default service if no configuration exists
function preConfigureEmailJS() {
    // Set EmailJS as the default service
    if (!localStorage.getItem('emailServiceConfig')) {
        const defaultConfig = {
            service: 'emailjs',
            serviceId: 'service_6t8hyif',  // Pre-filled with your service ID
            templateId: 'template_newsletter',  // Updated with more conventional template naming
            publicKey: '',  // User needs to provide their actual public key from EmailJS dashboard
            fromEmail: 'ali.zuh.fin@gmail.com',
            fromName: 'Webropol Newsletter'
        };
        localStorage.setItem('emailServiceConfig', JSON.stringify(defaultConfig));
        console.log('EmailJS set as default email service - configure your Public Key to start sending real emails');
    }
}

// Get email service configuration from localStorage
window.getEmailServiceConfig = function() {
    const configString = localStorage.getItem('emailServiceConfig');
    if (configString) {
        try {
            return JSON.parse(configString);
        } catch (e) {
            console.error('Failed to parse email config:', e);
            return null;
        }
    }
    return null;
};

// Save email service configuration to localStorage
function saveEmailServiceConfig(config) {
    localStorage.setItem('emailServiceConfig', JSON.stringify(config));
    
    // Also store public key separately for initialization
    if (config.publicKey) {
        localStorage.setItem('emailjs_public_key', config.publicKey);
        // Re-initialize EmailJS with the new key
        if (window.emailjs) {
            emailjs.init(config.publicKey);
        }
    }
}

// Show email service configuration dialog
window.showEmailServiceConfigDialog = function(emailData, type) {
    // Get existing configuration
    const existingConfig = getEmailServiceConfig() || {};
    
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'email-config-modal-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'email-config-modal';
    modal.style.backgroundColor = 'white';
    modal.style.padding = '30px';
    modal.style.borderRadius = '8px';
    modal.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    modal.style.width = '500px';
    modal.style.maxWidth = '90%';
    
    modal.innerHTML = `
        <h2 style="margin-top: 0;">Email Service Configuration</h2>
        <p style="margin-bottom: 20px;">Configure EmailJS to send real emails to recipients.</p>
        
        <div style="margin-bottom: 15px;">
            <label for="service-select" style="display: block; margin-bottom: 5px; font-weight: 500;">Email Service</label>
            <select id="service-select" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px;">
                <option value="emailjs" ${existingConfig.service === 'emailjs' ? 'selected' : ''}>EmailJS</option>
                <option value="mailtrap" ${existingConfig.service === 'mailtrap' ? 'selected' : ''}>Mailtrap (Testing Only)</option>
            </select>
        </div>
        
        <div id="emailjs-fields" style="${existingConfig.service !== 'mailtrap' ? '' : 'display: none;'}">
            <div style="margin-bottom: 15px;">
                <label for="service-id-input" style="display: block; margin-bottom: 5px; font-weight: 500;">Service ID</label>
                <input type="text" id="service-id-input" placeholder="service_xxxxxxxx" 
                    value="${existingConfig.serviceId || ''}"
                    style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px;">
                <small style="color: #6b7280; display: block; margin-top: 4px;">Find this in your EmailJS dashboard under "Services"</small>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label for="template-id-input" style="display: block; margin-bottom: 5px; font-weight: 500;">Template ID</label>
                <input type="text" id="template-id-input" placeholder="template_xxxxxxxx" 
                    value="${existingConfig.templateId || 'email_template'}"
                    style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px;">
                <small style="color: #6b7280; display: block; margin-top: 4px;">Find this in your EmailJS dashboard under "Email Templates"</small>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label for="public-key-input" style="display: block; margin-bottom: 5px; font-weight: 500;">Public Key</label>
                <input type="text" id="public-key-input" placeholder="XXXXXXXXXXXXXXXXXX" 
                    value="${existingConfig.publicKey || ''}"
                    style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px;">
                <small style="color: #6b7280; display: block; margin-top: 4px;">Find this in your EmailJS dashboard under "Account" → "API Keys"</small>
            </div>
        </div>
        
        <div id="mailtrap-fields" style="${existingConfig.service === 'mailtrap' ? '' : 'display: none;'}">
            <div style="margin-bottom: 15px;">
                <label for="api-key-input" style="display: block; margin-bottom: 5px; font-weight: 500;">API Key</label>
                <input type="text" id="api-key-input" placeholder="Enter your API key" 
                    value="${existingConfig.apiKey || ''}"
                    style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label for="service-url-input" style="display: block; margin-bottom: 5px; font-weight: 500;">Service URL</label>
                <input type="text" id="service-url-input" placeholder="https://send.api.mailtrap.io/api/send" 
                    value="${existingConfig.serviceUrl || 'https://send.api.mailtrap.io/api/send'}"
                    style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px;">
            </div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <label for="from-email-input" style="display: block; margin-bottom: 5px; font-weight: 500;">From Email Address</label>
            <input type="email" id="from-email-input" placeholder="sender@example.com" 
                value="${existingConfig.fromEmail || ''}"
                style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px;">
        </div>
        
        <div style="margin-bottom: 15px;">
            <label for="from-name-input" style="display: block; margin-bottom: 5px; font-weight: 500;">From Name</label>
            <input type="text" id="from-name-input" placeholder="Your Name or Organization" 
                value="${existingConfig.fromName || ''}"
                style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px;">
        </div>
        
        <div id="emailjs-test-connection" style="${existingConfig.service !== 'mailtrap' ? '' : 'display: none;'} margin-bottom: 20px; background-color: #f9fafb; padding: 15px; border-radius: 5px; text-align: center;">
            <p style="margin: 0 0 10px 0;">Test your EmailJS configuration before sending emails</p>
            <button id="test-connection-btn" style="padding: 10px 15px; background-color: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Connection</button>
            <div id="connection-result" style="margin-top: 10px; font-size: 14px;"></div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <button id="cancel-config-btn" style="padding: 10px 15px; background-color: #e5e7eb; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
            <div>
                <button id="save-config-btn" style="padding: 10px 15px; background-color: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Save Settings</button>
                <button id="save-send-btn" style="padding: 10px 15px; background-color: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;">Save & Send</button>
            </div>
        </div>
        
        <div style="margin-top: 20px; border-top: 1px solid #d1d5db; padding-top: 15px;">
            <p style="margin-top: 0; font-size: 0.875rem; color: #6b7280;">
                <strong>How to set up EmailJS:</strong><br>
                1. Create a free account at <a href="https://www.emailjs.com" target="_blank">emailjs.com</a><br>
                2. Set up an email service (Gmail, Outlook, etc.)<br>
                3. Create an email template<br>
                4. Copy your Service ID, Template ID, and Public Key to this form
            </p>
        </div>
    `;
    
    // Add modal to overlay
    overlay.appendChild(modal);
    
    // Add overlay to body
    document.body.appendChild(overlay);
    
    // Add event listeners for service selection toggle
    const serviceSelect = document.getElementById('service-select');
    serviceSelect.addEventListener('change', function(e) {
        const service = e.target.value;
        document.getElementById('emailjs-fields').style.display = service === 'emailjs' ? 'block' : 'none';
        document.getElementById('mailtrap-fields').style.display = service === 'mailtrap' ? 'block' : 'none';
        document.getElementById('emailjs-test-connection').style.display = service === 'emailjs' ? 'block' : 'none';
    });
    
    // Add event listeners for buttons
    document.getElementById('cancel-config-btn').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    document.getElementById('save-config-btn').addEventListener('click', function() {
        if (saveConfig()) {
            document.body.removeChild(overlay);
            showNotification('Email service configuration saved', 'success');
        }
    });
    
    document.getElementById('save-send-btn').addEventListener('click', function() {
        if (saveConfig()) {
            document.body.removeChild(overlay);
            // Retry sending the email
            if (emailData && type) {
                sendEmailToServer(emailData, type);
            } else {
                showNotification('Email service configuration saved', 'success');
            }
        }
    });
    
    // Add test connection functionality
    document.getElementById('test-connection-btn').addEventListener('click', function() {
        testEmailJSConnection();
    });
    
    // Helper function to save configuration
    function saveConfig() {
        const service = document.getElementById('service-select').value;
        const fromEmail = document.getElementById('from-email-input').value.trim();
        const fromName = document.getElementById('from-name-input').value.trim();
        
        let config = {
            service,
            fromEmail,
            fromName
        };
        
        if (service === 'emailjs') {
            const serviceId = document.getElementById('service-id-input').value.trim();
            const templateId = document.getElementById('template-id-input').value.trim();
            const publicKey = document.getElementById('public-key-input').value.trim();
            
            if (!serviceId) {
                alert('EmailJS Service ID is required');
                return false;
            }
            
            if (!templateId) {
                alert('EmailJS Template ID is required');
                return false;
            }
            
            if (!publicKey) {
                alert('EmailJS Public Key is required');
                return false;
            }
            
            if (!fromEmail) {
                alert('From Email is required');
                return false;
            }
            
            config = {
                ...config,
                serviceId,
                templateId,
                publicKey
            };
            
        } else if (service === 'mailtrap') {
            const apiKey = document.getElementById('api-key-input').value.trim();
            const serviceUrl = document.getElementById('service-url-input').value.trim();
            
            if (!apiKey) {
                alert('API Key is required');
                return false;
            }
            
            if (!serviceUrl) {
                alert('Service URL is required');
                return false;
            }
            
            if (!fromEmail) {
                alert('From Email is required');
                return false;
            }
            
            config = {
                ...config,
                apiKey,
                serviceUrl
            };
        }
        
        saveEmailServiceConfig(config);
        return true;
    }
};

// Email sending function - Prioritizes EmailJS for real email sending
window.sendEmailToServer = function(emailData, type) {
    // Check if email service configuration exists in local storage
    const emailConfig = getEmailServiceConfig();
    
    if (!emailConfig) {
        // If no email service is configured, show configuration dialog
        showEmailServiceConfigDialog(emailData, type);
        return;
    }
    
    if (emailConfig.service === 'emailjs') {
        // Validate EmailJS configuration
        const validationResult = validateEmailJSConfig(emailConfig);
        if (!validationResult.valid) {
            showNotification(validationResult.message, 'error');
            showEmailServiceConfigDialog(emailData, type);
            return;
        }
        
        // Check if EmailJS is loaded
        if (!window.emailjs) {
            showNotification('EmailJS SDK is not loaded yet. Please try again in a few seconds.', 'error');
            
            // Try to reload the SDK
            const reloadScript = document.createElement('script');
            reloadScript.src = 'https://cdn.emailjs.com/dist/email.min.js';
            reloadScript.onload = function() {
                emailjs.init(emailConfig.publicKey);
                showNotification('EmailJS reloaded successfully. Please try sending again.', 'info');
            };
            document.head.appendChild(reloadScript);
            return;
        }
        
        // Prepare parameters for the template
        const templateParams = {
            to_email: type === 'test' ? emailData.to : emailData.to.join(', '),
            from_name: emailConfig.fromName,
            from_email: emailConfig.fromEmail,
            subject: emailData.subject,
            message_html: emailData.html,
            campaign_name: emailData.campaignName,
            // Add additional parameters that might be expected in the template
            reply_to: emailConfig.fromEmail,
            content: emailData.html,  // Some templates use 'content' instead of 'message_html'
            recipient: type === 'test' ? emailData.to : 'Multiple Recipients',
            recipient_name: type === 'test' ? emailData.to.split('@')[0] : 'Recipients'
        };
        
        // Show sending indicator
        showNotification('Sending email via EmailJS...', 'info');
        
        // Send email using EmailJS
        emailjs.send(emailConfig.serviceId, emailConfig.templateId, templateParams)
            .then(function(response) {
                console.log('EmailJS SUCCESS:', response);
                
                // Create more persistent notification
                const notificationDiv = document.createElement('div');
                notificationDiv.style.position = 'fixed';
                notificationDiv.style.top = '50%';
                notificationDiv.style.left = '50%';
                notificationDiv.style.transform = 'translate(-50%, -50%)';
                notificationDiv.style.backgroundColor = '#10b981';
                notificationDiv.style.color = 'white';
                notificationDiv.style.padding = '20px 30px';
                notificationDiv.style.borderRadius = '8px';
                notificationDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                notificationDiv.style.zIndex = '10000';
                notificationDiv.style.textAlign = 'center';
                notificationDiv.style.minWidth = '300px';
                
                if (type === 'test') {
                    notificationDiv.innerHTML = `
                        <h3 style="margin-top:0">Email Sent Successfully!</h3>
                        <p>Test email was sent to: ${emailData.to}</p>
                        <p style="margin-bottom:0">Check your inbox shortly.</p>
                    `;
                    showNotification(`Test email sent successfully to ${emailData.to}`, 'success');
                } else {
                    const recipientCount = Array.isArray(emailData.to) ? emailData.to.length : 1;
                    notificationDiv.innerHTML = `
                        <h3 style="margin-top:0">Campaign Sent!</h3>
                        <p>Campaign "${emailData.campaignName}" was sent to ${recipientCount} recipients.</p>
                        <p style="margin-bottom:0">Emails should arrive shortly.</p>
                    `;
                    showNotification(`Campaign "${emailData.campaignName}" sent to ${recipientCount} recipients`, 'success');
                }
                
                // Add close button
                const closeBtn = document.createElement('button');
                closeBtn.innerText = 'Close';
                closeBtn.style.marginTop = '15px';
                closeBtn.style.padding = '8px 16px';
                closeBtn.style.border = 'none';
                closeBtn.style.borderRadius = '4px';
                closeBtn.style.backgroundColor = 'white';
                closeBtn.style.color = '#10b981';
                closeBtn.style.cursor = 'pointer';
                closeBtn.onclick = function() {
                    document.body.removeChild(notificationDiv);
                };
                notificationDiv.appendChild(closeBtn);
                
                document.body.appendChild(notificationDiv);
                
                // Remove after 8 seconds automatically
                setTimeout(() => {
                    if (document.body.contains(notificationDiv)) {
                        document.body.removeChild(notificationDiv);
                    }
                }, 8000);
            }, function(error) {
                console.error('EmailJS FAILED:', error);
                showNotification(`Failed to send email: ${error.text || 'Unknown error'}`, 'error');
            });
            
    } else if (emailConfig.service === 'mailtrap') {
        // Check if Mailtrap is properly configured
        if (!emailConfig.apiKey || !emailConfig.serviceUrl) {
            showNotification('Mailtrap is not properly configured', 'error');
            showEmailServiceConfigDialog(emailData, type);
            return;
        }
        
        // Format data according to Mailtrap API
        const formattedData = {
            from: {
                email: emailConfig.fromEmail,
                name: emailConfig.fromName || 'Email Campaign Sender'
            },
            to: type === 'test' 
                ? [{ email: emailData.to }] 
                : emailData.to.map(email => ({ email })),
            subject: emailData.subject,
            html: emailData.html
        };
        
        // Set headers with API key
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${emailConfig.apiKey}`
        };
        
        // Make API call to Mailtrap
        fetch(emailConfig.serviceUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(formattedData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (type === 'test') {
                showNotification(`Test email sent to Mailtrap inbox for ${emailData.to}`, 'success');
            } else {
                showNotification(`Campaign "${emailData.campaignName}" sent to Mailtrap inbox`, 'success');
            }
        })
        .catch(error => {
            console.error('Error sending email:', error);
            showNotification(`Failed to send email via Mailtrap: ${error.message}`, 'error');
        });
    } else {
        showNotification(`Unsupported email service: ${emailConfig.service}`, 'error');
    }
};

// Helper function to show notifications
function showNotification(message, type) {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        alert(message);
        console.log(`Notification (${type}): ${message}`);
    }
}

// Function to validate EmailJS configuration
function validateEmailJSConfig(config) {
    if (!config) {
        return {
            valid: false,
            message: 'No email configuration found'
        };
    }
    
    if (config.service !== 'emailjs') {
        return { valid: true }; // Not EmailJS, so other validation will handle it
    }
    
    const issues = [];
    
    if (!config.serviceId) issues.push('Service ID is missing');
    if (!config.templateId) issues.push('Template ID is missing');
    if (!config.publicKey) issues.push('Public Key is missing');
    if (!config.fromEmail) issues.push('From Email is missing');
    
    if (issues.length > 0) {
        return {
            valid: false,
            message: `EmailJS configuration issues: ${issues.join(', ')}`
        };
    }
    
    return { valid: true };
}

// Add a function to test the EmailJS connection
window.testEmailJSConnection = function() {
    const config = getEmailServiceConfig();
    const validationResult = validateEmailJSConfig(config);
    
    if (!validationResult.valid) {
        showNotification(validationResult.message, 'error');
        return;
    }
    
    if (!window.emailjs) {
        showNotification('EmailJS SDK not loaded yet. Please try again in a few seconds.', 'error');
        return;
    }
    
    // Create loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.style.position = 'fixed';
    loadingDiv.style.top = '50%';
    loadingDiv.style.left = '50%';
    loadingDiv.style.transform = 'translate(-50%, -50%)';
    loadingDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
    loadingDiv.style.color = 'white';
    loadingDiv.style.padding = '20px';
    loadingDiv.style.borderRadius = '8px';
    loadingDiv.style.zIndex = '10000';
    loadingDiv.innerHTML = 'Testing Email Connection...';
    document.body.appendChild(loadingDiv);
    
    // Test the connection with a minimal payload
    emailjs.send(config.serviceId, config.templateId, {
        to_email: 'test@example.com',
        subject: 'Connection Test',
        message_html: 'This is a connection test.',
        from_name: config.fromName,
        from_email: config.fromEmail
    })
    .then(function(response) {
        document.body.removeChild(loadingDiv);
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.style.position = 'fixed';
        successDiv.style.top = '50%';
        successDiv.style.left = '50%';
        successDiv.style.transform = 'translate(-50%, -50%)';
        successDiv.style.backgroundColor = '#10b981';
        successDiv.style.color = 'white';
        successDiv.style.padding = '20px';
        successDiv.style.borderRadius = '8px';
        successDiv.style.zIndex = '10000';
        successDiv.style.textAlign = 'center';
        successDiv.innerHTML = `
            <h3 style="margin-top: 0">Connection Successful!</h3>
            <p>Your EmailJS configuration is working correctly.</p>
            <button style="padding: 8px 16px; border: none; border-radius: 4px; background: white; color: #10b981; cursor: pointer; margin-top: 10px;">
                Close
            </button>
        `;
        
        document.body.appendChild(successDiv);
        
        const closeBtn = successDiv.querySelector('button');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(successDiv);
        });
        
        setTimeout(() => {
            if (document.body.contains(successDiv)) {
                document.body.removeChild(successDiv);
            }
        }, 5000);
    })
    .catch(function(error) {
        document.body.removeChild(loadingDiv);
        
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '50%';
        errorDiv.style.left = '50%';
        errorDiv.style.transform = 'translate(-50%, -50%)';
        errorDiv.style.backgroundColor = '#ef4444';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '20px';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.zIndex = '10000';
        errorDiv.style.textAlign = 'center';
        errorDiv.innerHTML = `
            <h3 style="margin-top: 0">Connection Failed</h3>
            <p>There's an issue with your EmailJS configuration:</p>
            <div style="background: rgba(0,0,0,0.2); padding: 10px; margin: 10px 0; text-align: left; border-radius: 4px; max-height: 100px; overflow-y: auto;">
                ${error.text || 'Unknown error'}
            </div>
            <button style="padding: 8px 16px; border: none; border-radius: 4px; background: white; color: #ef4444; cursor: pointer; margin-top: 10px;">
                Close
            </button>
        `;
        
        document.body.appendChild(errorDiv);
        
        const closeBtn = errorDiv.querySelector('button');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(errorDiv);
        });
    });
};
