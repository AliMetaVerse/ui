// Email Campaign Sender Tool - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing application');
    
    // Initialize CKEditor
    initCKEditor();
    
    // Initialize email recipient input handling
    initEmailRecipients();
    
    // Initialize button event listeners
    initButtonListeners();
    
    // Initialize source view toggle functionality
    initSourceViewToggle();
});

// Initialize CKEditor with the specified preset
function initCKEditor() {
    console.log('Initializing CKEditor...');
    
    try {
        DecoupledEditor
            .create(document.querySelector('.document-editor__editable'), {
                // Using the preset configuration from:
                // https://ckeditor.com/ckeditor-5/builder/#presets/NoRgLANARATAdANjgBitEIDsAOMBWLZZbPGbGMAZjwREoE57KEwsN6SEvGu9ts0UAKYA7NMgigIEiSAhzkAXWiYhYIQDN6AEyiKgA===
                toolbar: [
                    'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                    'outdent', 'indent', '|', 'imageUpload', 'blockQuote', 'insertTable', '|',
                    'undo', 'redo', '|', 'fontBackgroundColor', 'fontColor', 'fontSize', 'fontFamily'
                ],
                image: {
                    toolbar: [
                        'imageStyle:inline',
                        'imageStyle:block',
                        'imageStyle:side',
                        '|',
                        'toggleImageCaption',
                        'imageTextAlternative'
                    ]
                },
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                }
        })
        .then(editor => {
            window.editor = editor;
            
            // Set initial content with a template
            editor.setData(getEmailTemplate());

            // Attach the editor to the toolbar
            const toolbarContainer = document.querySelector('.document-editor__toolbar');
            toolbarContainer.appendChild(editor.ui.view.toolbar.element);
            
            console.log('CKEditor initialized successfully');
        })
        .catch(error => {
            console.error('Error initializing CKEditor:', error);
        });
}

// Handle email recipients input
function initEmailRecipients() {
    const recipientsTextarea = document.getElementById('email-recipients');
    const recipientTagsContainer = document.getElementById('recipient-tags');
    
    recipientsTextarea.addEventListener('blur', function() {
        const emails = parseEmails(this.value);
        displayEmailTags(emails, recipientTagsContainer);
    });
}

// Parse emails from input text
function parseEmails(text) {
    // Split by commas or newlines and trim whitespace
    const emails = text.split(/[\n,]/)
                      .map(email => email.trim())
                      .filter(email => email && validateEmail(email));
    return [...new Set(emails)]; // Remove duplicates
}

// Simple email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Display email tags
function displayEmailTags(emails, container) {
    container.innerHTML = '';
    
    emails.forEach(email => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            <span>${email}</span>
            <span class="remove" data-email="${email}">×</span>
        `;
        container.appendChild(tag);
    });
    
    // Add event listeners to remove buttons
    const removeButtons = container.querySelectorAll('.remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const emailToRemove = this.getAttribute('data-email');
            removeEmailFromInput(emailToRemove);
            this.parentElement.remove();
        });
    });
}

// Remove an email from the textarea input
function removeEmailFromInput(emailToRemove) {
    const recipientsTextarea = document.getElementById('email-recipients');
    const emails = parseEmails(recipientsTextarea.value);
    const updatedEmails = emails.filter(email => email !== emailToRemove);
    recipientsTextarea.value = updatedEmails.join(', ');
}

// Initialize button event listeners
function initButtonListeners() {
    // Preview button
    document.getElementById('preview-btn').addEventListener('click', function() {
        previewEmail();
    });
    
    // Test send button
    document.getElementById('test-send-btn').addEventListener('click', function() {
        sendTestEmail();
    });
    
    // Send campaign button
    document.getElementById('send-campaign-btn').addEventListener('click', function() {
        sendCampaign();
    });
    
    // Email settings button
    document.getElementById('email-settings-btn').addEventListener('click', function() {
        showEmailServiceConfigDialog(null, null);
    });
}

// Initialize source view toggle functionality
function initSourceViewToggle() {
    const wysiwygViewBtn = document.getElementById('wysiwyg-view-btn');
    const sourceViewBtn = document.getElementById('source-view-btn');
    const wysiwygEditor = document.getElementById('wysiwyg-editor');
    const sourceEditor = document.getElementById('source-editor');
    const htmlSourceTextarea = document.getElementById('html-source');
    const applySourceBtn = document.getElementById('apply-source-btn');
    
    // Switch to HTML source view
    sourceViewBtn.addEventListener('click', function() {
        if (window.editor) {
            // Get current HTML content from CKEditor
            const editorData = window.editor.getData();
            
            // Format HTML with proper indentation for better readability
            const formattedHTML = formatHTML(editorData);
            
            // Set the formatted HTML in the source textarea
            htmlSourceTextarea.value = formattedHTML;
            
            // Show source editor, hide WYSIWYG editor
            wysiwygEditor.style.display = 'none';
            sourceEditor.style.display = 'block';
            
            // Update button states
            wysiwygViewBtn.classList.remove('active');
            sourceViewBtn.classList.add('active');
        }
    });
    
    // Switch back to WYSIWYG view
    wysiwygViewBtn.addEventListener('click', function() {
        // Show WYSIWYG editor, hide source editor
        wysiwygEditor.style.display = 'block';
        sourceEditor.style.display = 'none';
        
        // Update button states
        wysiwygViewBtn.classList.add('active');
        sourceViewBtn.classList.remove('active');
    });
      // Apply HTML source to editor
    applySourceBtn.addEventListener('click', function() {
        if (window.editor) {
            // Get the HTML from the source textarea
            const sourceHTML = htmlSourceTextarea.value;
            
            // Set the HTML in the CKEditor
            window.editor.setData(sourceHTML);
            
            // Switch back to WYSIWYG view
            wysiwygViewBtn.click();
            
            showNotification('HTML source code applied successfully', 'success');
        }
    });
    
    // Import HTML file
    const importHtmlBtn = document.getElementById('import-html-btn');
    const htmlFileInput = document.getElementById('html-file-input');
    
    importHtmlBtn.addEventListener('click', function() {
        htmlFileInput.click();
    });
      htmlFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                htmlSourceTextarea.value = e.target.result;
                showNotification(`HTML file "${file.name}" imported successfully`, 'success');
            };
            reader.readAsText(file);
        }
    });
    
    // Copy HTML source to clipboard
    const copyHtmlBtn = document.getElementById('copy-html-btn');
    copyHtmlBtn.addEventListener('click', function() {
        htmlSourceTextarea.select();
        document.execCommand('copy');
        // For modern browsers
        if (navigator.clipboard) {
            navigator.clipboard.writeText(htmlSourceTextarea.value)
                .then(() => {
                    showNotification('HTML source code copied to clipboard', 'success');
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    showNotification('Failed to copy HTML source code', 'error');
                });
        } else {
            // Fallback for older browsers
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showNotification('HTML source code copied to clipboard', 'success');
                } else {
                    showNotification('Failed to copy HTML source code', 'error');
                }
            } catch (err) {
                console.error('Failed to copy: ', err);
                showNotification('Failed to copy HTML source code', 'error');
            }
        }
    });
    
    // Paste HTML from clipboard
    const pasteHtmlBtn = document.getElementById('paste-html-btn');
    pasteHtmlBtn.addEventListener('click', function() {
        if (navigator.clipboard) {
            navigator.clipboard.readText()
                .then(text => {
                    htmlSourceTextarea.value = text;
                    showNotification('HTML pasted from clipboard', 'success');
                })
                .catch(err => {
                    console.error('Failed to paste: ', err);
                    showNotification('Failed to paste from clipboard. Please paste manually using Ctrl+V/Cmd+V', 'error');
                });
        } else {
            showNotification('Please paste manually using Ctrl+V/Cmd+V', 'error');
            htmlSourceTextarea.focus();
        }
    });
}

// Format HTML with indentation for readability in the source view
function formatHTML(html) {
    let formatted = '';
    let indent = '';
    
    // Helper function to add newlines and proper indentation
    const addNewLines = function(text) {
        text = text.replace(/>\s*</g, '>\n<');
        text = text.replace(/</g, '\n<');
        text = text.replace(/>/g, '>\n');
        text = text.replace(/\n\n/g, '\n');
        return text;
    };
    
    // Add newlines to HTML
    let lines = addNewLines(html).split('\n');
    
    // Process each line to add proper indentation
    lines.forEach(line => {
        if (line.match(/^<\/[^>]+>$/)) { // Closing tag
            indent = indent.substring(2);
        }
        
        if (line.trim() !== '') {
            formatted += indent + line.trim() + '\n';
        }
        
        if (line.match(/^<[^\/][^>]*[^\/]>$/) && !line.includes('</')) { // Opening tag
            indent += '  ';
        }
    });
    
    return formatted.trim();
}

// Preview the email in the iframe
function previewEmail() {
    const previewFrame = document.getElementById('preview-frame');
    const editorContent = window.editor.getData();
    const subject = document.getElementById('campaign-subject').value;
    
    // Create preview content
    const previewContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${subject}</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">
            ${editorContent}
        </body>
        </html>
    `;
    
    // Write to iframe
    const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(previewContent);
    frameDoc.close();
    
    showNotification('Email preview generated successfully', 'success');
}

// Send a test email
function sendTestEmail() {
    const campaignName = document.getElementById('campaign-name').value;
    if (!campaignName) {
        showNotification('Please enter a campaign name', 'error');
        return;
    }
    
    const subject = document.getElementById('campaign-subject').value;
    if (!subject) {
        showNotification('Please enter an email subject', 'error');
        return;
    }
    
    const testEmail = prompt('Enter email address for test message:');
    if (!testEmail || !validateEmail(testEmail)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    const content = window.editor.getData();
    if (!content) {
        showNotification('Email content cannot be empty', 'error');
        return;
    }
    
    // Show loading indicator
    showNotification('Sending test email...', 'info');
    
    // Prepare email data
    const emailData = {
        to: testEmail,
        subject: subject,
        html: content,
        campaignName: campaignName,
        isTest: true
    };
    
    // Send to backend service (if configured)
    sendEmailToServer(emailData, 'test');
}

// Send the campaign
function sendCampaign() {
    const campaignName = document.getElementById('campaign-name').value;
    if (!campaignName) {
        showNotification('Please enter a campaign name', 'error');
        return;
    }
    
    const subject = document.getElementById('campaign-subject').value;
    if (!subject) {
        showNotification('Please enter an email subject', 'error');
        return;
    }
    
    const emails = parseEmails(document.getElementById('email-recipients').value);
    if (emails.length === 0) {
        showNotification('Please add at least one valid email address', 'error');
        return;
    }
    
    const content = window.editor.getData();
    if (!content) {
        showNotification('Email content cannot be empty', 'error');
        return;
    }
    
    // Confirm before sending to multiple recipients
    const confirmSend = confirm(`Are you sure you want to send this campaign to ${emails.length} recipients?`);
    if (!confirmSend) {
        return;
    }
    
    // Show loading indicator
    showNotification(`Sending campaign "${campaignName}" to ${emails.length} recipients...`, 'info');
    
    // Prepare email data
    const emailData = {
        to: emails,
        subject: subject,
        html: content,
        campaignName: campaignName,
        isTest: false
    };
    
    // Send to backend service (if configured)
    sendEmailToServer(emailData, 'campaign');
}

// Send email data to server
window.sendEmailToServer = function(emailData, type) {
    // Check if email service configuration exists in local storage
    const emailConfig = getEmailServiceConfig();
    
    if (!emailConfig || !emailConfig.apiKey || !emailConfig.serviceUrl) {
        // If no email service is configured, show configuration dialog
        showEmailServiceConfigDialog(emailData, type);
        return;
    }
    
    // Format data according to the selected email service
    let formattedData;
    let headers = {
        'Content-Type': 'application/json'
    };
    
    if (emailConfig.service === 'mailtrap') {
        // Mailtrap API format
        headers['Authorization'] = `Bearer ${emailConfig.apiKey}`;
        
        formattedData = {
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
    } else {
        // Generic format for other services
        headers['Authorization'] = `Bearer ${emailConfig.apiKey}`;
        formattedData = {
            from: emailConfig.fromEmail,
            fromName: emailConfig.fromName,
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.html,
            campaignName: emailData.campaignName
        };
    }
    
    // Make API call to the email service
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
            showNotification(`Test email sent successfully to ${emailData.to}`, 'success');
        } else {
            showNotification(`Campaign "${emailData.campaignName}" sent to ${emailData.to.length} recipients`, 'success');
        }
    })
    .catch(error => {
        console.error('Error sending email:', error);
        showNotification(`Failed to send email: ${error.message}`, 'error');
        // If API call fails, show configuration dialog
        showEmailServiceConfigDialog(emailData, type);
    });
}

// Show notification
window.showNotification = function(message, type) {
    // Check if a notification container already exists
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.marginBottom = '10px';
    notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    notification.style.minWidth = '250px';
    
    // Add message
    notification.textContent = message;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Auto-remove notification after 5 seconds
    // Info notifications stay a bit shorter
    const timeout = type === 'info' ? 3000 : 5000;
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            notificationContainer.removeChild(notification);
            
            // Remove the container if it's empty
            if (notificationContainer.children.length === 0) {
                document.body.removeChild(notificationContainer);
            }
        }, 500);
    }, timeout);
}

// Get or create email service configuration
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
}

// Save email service configuration
function saveEmailServiceConfig(config) {
    localStorage.setItem('emailServiceConfig', JSON.stringify(config));
}

// Show email service configuration dialog
window.showEmailServiceConfigDialog = function(emailData, type) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
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
    modal.className = 'modal-content';
    modal.style.backgroundColor = 'white';
    modal.style.padding = '30px';
    modal.style.borderRadius = '8px';
    modal.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    modal.style.width = '500px';
    modal.style.maxWidth = '90%';
    
    // Get existing config if available
    const existingConfig = getEmailServiceConfig() || {};
    
    // Modal content
    modal.innerHTML = `
        <h3 style="margin-top: 0;">Email Service Configuration</h3>
        <p>To send emails, please configure an email service API:</p>
          <div style="margin-bottom: 15px;">
            <label for="email-service-select" style="display: block; margin-bottom: 5px; font-weight: 500;">Select Email Service</label>
            <select id="email-service-select" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px;">
                <option value="custom" ${!existingConfig.service || existingConfig.service === 'custom' ? 'selected' : ''}>Custom API</option>
                <option value="mailtrap" ${existingConfig.service === 'mailtrap' ? 'selected' : ''}>Mailtrap</option>
                <option value="sendgrid" ${existingConfig.service === 'sendgrid' ? 'selected' : ''}>SendGrid</option>
                <option value="mailchimp" ${existingConfig.service === 'mailchimp' ? 'selected' : ''}>Mailchimp</option>
                <option value="aws-ses" ${existingConfig.service === 'aws-ses' ? 'selected' : ''}>AWS SES</option>
            </select>
        </div>
        
        <div style="margin-bottom: 15px;">
            <label for="api-key-input" style="display: block; margin-bottom: 5px; font-weight: 500;">API Key</label>
            <input type="text" id="api-key-input" placeholder="Enter your API key" 
                value="${existingConfig.apiKey || ''}"
                style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px;">
        </div>
        
        <div style="margin-bottom: 15px;">
            <label for="service-url-input" style="display: block; margin-bottom: 5px; font-weight: 500;">Service URL</label>
            <input type="text" id="service-url-input" placeholder="Enter service endpoint URL" 
                value="${existingConfig.serviceUrl || ''}"
                style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px;">
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
        
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <button id="cancel-config-btn" class="btn btn-secondary" style="padding: 10px 20px;">Cancel</button>
            <div>
                <button id="save-config-btn" class="btn btn-primary" style="padding: 10px 20px; margin-right: 10px;">Save Settings</button>
                <button id="save-send-btn" class="btn btn-primary" style="padding: 10px 20px;">Save & Send</button>
            </div>
        </div>
        
        <div style="margin-top: 20px; border-top: 1px solid #d1d5db; padding-top: 15px;">
            <p style="margin-top: 0; font-size: 0.875rem; color: #6b7280;">
                <strong>Note:</strong> Without email service configuration, this tool will simulate sending but won't deliver actual emails. 
                For development purposes, you might consider using services like <a href="https://mailtrap.io" target="_blank">Mailtrap</a> 
                or <a href="https://ethereal.email" target="_blank">Ethereal Email</a>.
            </p>
        </div>
    `;
    
    // Add modal to overlay
    overlay.appendChild(modal);
    
    // Add overlay to body
    document.body.appendChild(overlay);
    
    // Add event listeners    document.getElementById('email-service-select').addEventListener('change', function(e) {
        const serviceSelect = e.target.value;
        const serviceUrlInput = document.getElementById('service-url-input');
        const apiKeyInput = document.getElementById('api-key-input');
        
        // Set default URL based on service selection
        switch(serviceSelect) {
            case 'mailtrap':
                serviceUrlInput.value = 'https://send.api.mailtrap.io/api/send';
                // Pre-fill API key if it's Mailtrap and we're coming from a fresh installation
                if (!existingConfig.apiKey || existingConfig.service !== 'mailtrap') {
                    apiKeyInput.value = 'dd79bf6ee20ede946ece14f162b3f2ac';
                }
                break;
            case 'sendgrid':
                serviceUrlInput.value = 'https://api.sendgrid.com/v3/mail/send';
                break;
            case 'mailchimp':
                serviceUrlInput.value = 'https://mandrillapp.com/api/1.0/messages/send.json';
                break;
            case 'aws-ses':
                serviceUrlInput.value = 'https://email.us-east-1.amazonaws.com';
                break;
            default:
                serviceUrlInput.value = existingConfig.serviceUrl || '';
        }
    });
    
    document.getElementById('cancel-config-btn').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    document.getElementById('save-config-btn').addEventListener('click', function() {
        saveConfig();
        document.body.removeChild(overlay);
        showNotification('Email service configuration saved', 'success');
    });
    
    document.getElementById('save-send-btn').addEventListener('click', function() {
        if (saveConfig()) {
            document.body.removeChild(overlay);
            // Retry sending the email
            sendEmailToServer(emailData, type);
        }
    });
    
    // Helper function to save configuration
    function saveConfig() {
        const apiKey = document.getElementById('api-key-input').value.trim();
        const serviceUrl = document.getElementById('service-url-input').value.trim();
        const fromEmail = document.getElementById('from-email-input').value.trim();
        const fromName = document.getElementById('from-name-input').value.trim();
        const service = document.getElementById('email-service-select').value;
        
        if (!apiKey) {
            alert('API Key is required');
            return false;
        }
        
        if (!serviceUrl) {
            alert('Service URL is required');
            return false;
        }
        
        if (!fromEmail) {
            alert('From Email Address is required');
            return false;
        }
        
        // Save configuration
        const config = {
            service,
            apiKey,
            serviceUrl,
            fromEmail,
            fromName
        };
        
        saveEmailServiceConfig(config);
        return true;
    }
}

// Get email template
function getEmailTemplate() {
    return `
    <h2 style="color: #2c6ecb; margin-bottom: 20px;">Your Email Campaign Title</h2>
    
    <p>Hello,</p>
    
    <p>Welcome to our newsletter! We're excited to share the latest updates with you.</p>
    
    <h3 style="color: #3a82f6; margin-top: 25px;">Featured Content</h3>
    
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.</p>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Item</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Description</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Price</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Product 1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Description of product 1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">$99.99</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Product 2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Description of product 2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">$149.99</td>
        </tr>
    </table>
    
    <p>Feel free to <a href="#" style="color: #2c6ecb; text-decoration: none; font-weight: bold;">contact us</a> if you have any questions.</p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #6b7280; font-size: 0.875rem;">
        <p>Best regards,<br>The Team</p>
        <p style="margin-top: 20px;">© 2025 Your Company. All rights reserved.</p>
    </div>
    `;
}
