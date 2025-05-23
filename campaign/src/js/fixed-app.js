// Simple Email Campaign Tool

window.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing email campaign tool');
    initCKEditor();
    setupEventListeners();
});

// Initialize CKEditor
function initCKEditor() {
    console.log('Loading CKEditor...');
    
    // First, check if CKEditor is loaded
    if (typeof DecoupledEditor === 'undefined') {
        console.error('CKEditor is not loaded. Please check if the CKEditor script is properly included.');
        showNotification('CKEditor failed to load. Please refresh the page or check your internet connection.', 'error');
        
        // Add a button to reload the page
        const editorContainer = document.querySelector('.document-editor__editable-container');
        if (editorContainer) {
            editorContainer.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h3>CKEditor failed to load</h3>
                    <p>This might be due to network issues or script loading problems.</p>
                    <button onclick="location.reload()" style="padding: 10px 15px; margin-top: 15px;">Reload Page</button>
                </div>
            `;
        }
        return;
    }
    
    try {
        // Use a preset configuration from CKEditor 5 builder
        const editorConfig = {
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
        };

        // Create the editor instance
        DecoupledEditor
            .create(document.querySelector('.document-editor__editable'), editorConfig)
            .then(editor => {
                window.editor = editor;
                
                // Set initial template
                editor.setData(getEmailTemplate());
                
                // Attach the editor's toolbar to the container
                const toolbarContainer = document.querySelector('.document-editor__toolbar');
                toolbarContainer.appendChild(editor.ui.view.toolbar.element);
                
                console.log('CKEditor initialized successfully');
                
                // Generate initial preview
                setTimeout(() => {
                    const previewBtn = document.getElementById('preview-btn');
                    if (previewBtn) {
                        previewBtn.click();
                    }
                }, 1000);
            })
            .catch(error => {
                console.error('CKEditor initialization failed:', error);
                showNotification('Error initializing the editor. Some features might not work properly.', 'error');
            });
    } catch (err) {
        console.error('Fatal CKEditor error:', err);
        showNotification('Failed to initialize the editor.', 'error');
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Setup preview button
    const previewBtn = document.getElementById('preview-btn');
    if (previewBtn) {
        previewBtn.addEventListener('click', generatePreview);
    }
    
    // Setup source view toggle
    setupSourceViewToggle();
    
    // Setup email recipient handling
    setupEmailRecipients();
    
    // Setup campaign send buttons
    setupSendButtons();
    
    // Initialize fallback email sending function if not already defined
    initEmailSendingFallback();
}

// Initialize fallback for email sending if the mailtrap-config.js is not loaded
function initEmailSendingFallback() {
    // Only define if it doesn't exist yet (won't override mailtrap-config.js)
    if (typeof window.sendEmailToServer !== 'function') {
        console.log('Setting up fallback email sending function');
        
        window.sendEmailToServer = function(emailData, type) {
            console.log(`Fallback email sending (${type}):`, emailData);
            
            // Simulate API call with a delay
            setTimeout(() => {
                if (type === 'test') {
                    showNotification(`Test email sent to ${emailData.to} (simulated)`, 'success');
                } else {
                    const recipientCount = Array.isArray(emailData.to) ? emailData.to.length : 1;
                    showNotification(`Campaign sent to ${recipientCount} recipients (simulated)`, 'success');
                }
            }, 1500);
        };
        
        // Also provide a fallback for email service config dialog
        if (typeof window.showEmailServiceConfigDialog !== 'function') {
            window.showEmailServiceConfigDialog = function() {
                showNotification('Email service configuration would be shown here', 'info');
            };
        }
        
        if (typeof window.getEmailServiceConfig !== 'function') {
            window.getEmailServiceConfig = function() {
                return null;
            };
        }
    }
}

// Setup source view toggle
function setupSourceViewToggle() {
    const wysiwygBtn = document.getElementById('wysiwyg-view-btn');
    const sourceBtn = document.getElementById('source-view-btn');
    const wysiwygEditor = document.getElementById('wysiwyg-editor');
    const sourceEditor = document.getElementById('source-editor');
    const htmlSource = document.getElementById('html-source');
    const applyBtn = document.getElementById('apply-source-btn');
    
    // Check if elements exist
    if (!wysiwygBtn || !sourceBtn || !wysiwygEditor || !sourceEditor) return;
    
    // Source view button
    sourceBtn.addEventListener('click', () => {
        if (window.editor) {
            htmlSource.value = window.editor.getData();
            wysiwygEditor.style.display = 'none';
            sourceEditor.style.display = 'block';
            wysiwygBtn.classList.remove('active');
            sourceBtn.classList.add('active');
        }
    });
    
    // WYSIWYG view button
    wysiwygBtn.addEventListener('click', () => {
        wysiwygEditor.style.display = 'block';
        sourceEditor.style.display = 'none';
        wysiwygBtn.classList.add('active');
        sourceBtn.classList.remove('active');
    });
    
    // Apply HTML button
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            if (window.editor && htmlSource) {
                window.editor.setData(htmlSource.value);
                showNotification('HTML applied to editor', 'success');
                wysiwygBtn.click(); // Switch back to WYSIWYG view
            }
        });
    }
    
    // Setup HTML import/copy buttons
    setupHtmlSourceTools();
}

// Setup HTML source tools (import, copy, paste)
function setupHtmlSourceTools() {
    const importBtn = document.getElementById('import-html-btn');
    const fileInput = document.getElementById('html-file-input');
    const copyBtn = document.getElementById('copy-html-btn');
    const pasteBtn = document.getElementById('paste-html-btn');
    const htmlSource = document.getElementById('html-source');
    
    // Import HTML button
    if (importBtn && fileInput) {
        importBtn.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    htmlSource.value = e.target.result;
                    showNotification('HTML file imported', 'success');
                };
                reader.readAsText(e.target.files[0]);
            }
        });
    }
    
    // Copy HTML button
    if (copyBtn && htmlSource) {
        copyBtn.addEventListener('click', () => {
            htmlSource.select();
            document.execCommand('copy');
            showNotification('HTML copied to clipboard', 'success');
        });
    }
    
    // Paste HTML button
    if (pasteBtn && htmlSource) {
        pasteBtn.addEventListener('click', () => {
            htmlSource.focus();
            document.execCommand('paste');
            showNotification('Ready to paste from clipboard', 'info');
        });
    }
}

// Setup email recipients handling
function setupEmailRecipients() {
    const recipientsInput = document.getElementById('email-recipients');
    const tagsContainer = document.getElementById('recipient-tags');
    
    if (recipientsInput && tagsContainer) {
        recipientsInput.addEventListener('blur', () => {
            const emails = parseEmails(recipientsInput.value);
            displayEmailTags(emails, tagsContainer, recipientsInput);
        });
    }
}

// Parse emails from input
function parseEmails(text) {
    if (!text) return [];
    return [...new Set(
        text.split(/[,\n]/)
            .map(email => email.trim())
            .filter(email => email && validateEmail(email))
    )];
}

// Validate email format
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Display email tags
function displayEmailTags(emails, container, inputElem) {
    container.innerHTML = '';
    
    emails.forEach(email => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            <span>${email}</span>
            <span class="remove" data-email="${email}">×</span>
        `;
        container.appendChild(tag);
        
        // Add remove action
        const removeBtn = tag.querySelector('.remove');
        removeBtn.addEventListener('click', () => {
            // Remove from list
            const currentEmails = parseEmails(inputElem.value);
            const updatedEmails = currentEmails.filter(e => e !== email);
            inputElem.value = updatedEmails.join(', ');
            
            // Remove tag
            tag.remove();
        });
    });
}

// Setup send buttons
function setupSendButtons() {
    // Test email button
    const testBtn = document.getElementById('test-send-btn');
    if (testBtn) {
        testBtn.addEventListener('click', () => {
            const campaign = document.getElementById('campaign-name')?.value;
            if (!campaign) {
                showNotification('Please enter a campaign name', 'error');
                return;
            }
            
            const subject = document.getElementById('campaign-subject')?.value;
            if (!subject) {
                showNotification('Please enter an email subject', 'error');
                return;
            }
            
            // Prompt for test email address
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
            
            // Show loading notification
            showNotification('Sending test email...', 'info');
            
            // Prepare email data
            const emailData = {
                to: testEmail,
                subject: subject,
                html: content,
                campaignName: campaign,
                isTest: true
            };
            
            // Send to server if sendEmailToServer function exists
            if (typeof window.sendEmailToServer === 'function') {
                window.sendEmailToServer(emailData, 'test');
            } else {
                // Fallback for when mailtrap integration is not available
                console.log('Simulated email send:', emailData);
                showNotification(`Test email would be sent to: ${testEmail}`, 'success');
            }
        });
    }
    
    // Send campaign button
    const sendBtn = document.getElementById('send-campaign-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const campaign = document.getElementById('campaign-name')?.value;
            if (!campaign) {
                showNotification('Please enter a campaign name', 'error');
                return;
            }
            
            const subject = document.getElementById('campaign-subject')?.value;
            if (!subject) {
                showNotification('Please enter an email subject', 'error');
                return;
            }
            
            const emails = parseEmails(document.getElementById('email-recipients')?.value || '');
            if (emails.length === 0) {
                showNotification('Please add at least one email recipient', 'error');
                return;
            }
            
            const content = window.editor.getData();
            if (!content) {
                showNotification('Email content cannot be empty', 'error');
                return;
            }
            
            // Confirm before sending
            const confirmSend = confirm(`Are you sure you want to send this campaign to ${emails.length} recipients?`);
            if (!confirmSend) {
                return;
            }
            
            // Show loading notification
            showNotification(`Sending campaign "${campaign}" to ${emails.length} recipients...`, 'info');
            
            // Prepare email data
            const emailData = {
                to: emails,
                subject: subject,
                html: content,
                campaignName: campaign,
                isTest: false
            };
            
            // Send to server if sendEmailToServer function exists
            if (typeof window.sendEmailToServer === 'function') {
                window.sendEmailToServer(emailData, 'campaign');
            } else {
                // Fallback for when mailtrap integration is not available
                console.log('Simulated campaign send:', emailData);
                showNotification(`Campaign "${campaign}" would be sent to ${emails.length} recipients`, 'success');
            }
        });
    }
    
    // Email settings button
    const settingsBtn = document.getElementById('email-settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            // Check if the showEmailServiceConfigDialog function exists (from mailtrap-config.js)
            if (typeof window.showEmailServiceConfigDialog === 'function') {
                window.showEmailServiceConfigDialog(null, null);
            } else {
                showNotification('Email settings would be configured here', 'info');
            }
        });
    }
}

// Generate email preview
function generatePreview() {
    if (!window.editor) return;
    
    const previewFrame = document.getElementById('preview-frame');
    if (!previewFrame) return;
    
    const content = window.editor.getData();
    const subject = document.getElementById('campaign-subject')?.value || 'Email Preview';
    
    const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    previewDoc.open();
    previewDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${subject}</title>
            <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            ${content}
        </body>
        </html>
    `);
    previewDoc.close();
    
    showNotification('Preview generated', 'success');
}

// Show notification
function showNotification(message, type) {
    console.log(`Notification (${type}): ${message}`);
    
    let container = document.querySelector('.notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.padding = '12px 20px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '4px';
    notification.style.color = 'white';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    // Set color based on type
    switch (type) {
        case 'success': notification.style.backgroundColor = '#10b981'; break;
        case 'error': notification.style.backgroundColor = '#ef4444'; break;
        case 'info': notification.style.backgroundColor = '#3b82f6'; break;
        default: notification.style.backgroundColor = '#6b7280';
    }
    
    notification.textContent = message;
    container.appendChild(notification);
    
    // Auto remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            container.removeChild(notification);
            if (container.children.length === 0) {
                document.body.removeChild(container);
            }
        }, 500);
    }, 5000);
}

// Get sample email template
function getEmailTemplate() {
    return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f9fafa">
        <tr>
            <td style="padding: 20px 0;">
                <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <!-- Top Bar with Logo -->
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td class="top-bar" style="background-color: #ffffff; padding: 15px 20px; border-bottom: 1px solid #d1d5d6;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td width="50%" style="vertical-align: middle;">
                                            <img src="https://ali-ui-dev.github.io/ui/images/logo/Logo_128.png" alt="Webropol Logo" width="150" style="max-width: 150px;">
                                        </td>
                                        <td width="50%" align="right" style="font-size: 14px; vertical-align: middle;">
                                            Weekly Update - May 23, 2025
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    
                    <!-- Header with Title -->
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td class="header" style="background-color: #1e6880; color: #ffffff; padding: 30px 20px;">
                                <h1 style="font-size: 24px; font-weight: 700; color: #ffffff; margin: 0;">Webropol Marketing Update</h1>
                            </td>
                        </tr>
                    </table>
                    
                    <!-- Main Content -->
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td class="content" style="padding: 30px 20px; background-color: #ffffff;">
                                <p style="font-size: 16px;">
                                    Hi all, and greetings from the marketing department!
                                </p>
                                
                                <p>
                                    We're excited to share our latest updates with you. This is your weekly newsletter from Webropol.
                                </p>
                                
                                <h2>Current Campaign</h2>
                                <p>
                                    Currently, we are running a campaign with a special discount. Feel free to ask for more information and share with your customers.
                                </p>
                                
                                <!-- CTA Button -->
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center" style="padding: 20px 0;">
                                            <a href="mailto:sales@example.com?subject=Campaign%20Inquiry" style="display: inline-block; background-color: #1e6880; color: #ffffff; font-size: 16px; font-weight: 500; line-height: 1; text-decoration: none; text-align: center; border-radius: 4px; padding: 12px 24px; margin: 10px 0;">Request More Info</a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p>
                                    Thanks for reading our update! Have a great day!
                                </p>
                                
                                <!-- Footer -->
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="padding-top: 20px; border-top: 1px solid #d1d5d6; text-align: center; font-size: 12px; color: #61686a;">
                                            <p style="margin: 5px 0;">Your Company Name</p>
                                            <p style="margin: 5px 0;">123 Street Address, City, Country</p>
                                            <p style="margin: 5px 0;">Email: <a href="mailto:contact@example.com" style="color:#61686a;">contact@example.com</a></p>
                                            <p style="margin: 5px 0;"><a href="#unsubscribe" style="color: #61686a; text-decoration: underline;">Unsubscribe</a></p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
    </table>
    `;
}
