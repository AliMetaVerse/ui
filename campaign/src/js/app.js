// Email Campaign Sender Tool - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize CKEditor
    initCKEditor();
    
    // Initialize email recipient input handling
    initEmailRecipients();
    
    // Initialize button event listeners
    initButtonListeners();
});

// Initialize CKEditor with the specified preset
function initCKEditor() {
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

// Send a test email (simulated)
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
    
    // In a real application, this would send an API request
    showNotification('Test email sent successfully', 'success');
}

// Send the campaign (simulated)
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
    
    // In a real application, this would send an API request
    showNotification(`Campaign "${campaignName}" sent to ${emails.length} recipients`, 'success');
}

// Show notification
function showNotification(message, type) {
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
    notification.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.marginBottom = '10px';
    notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    notification.style.minWidth = '250px';
    notification.textContent = message;
    
    notificationContainer.appendChild(notification);
    
    // Auto-remove notification after 5 seconds
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
    }, 5000);
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
