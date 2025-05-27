// EmailJS Force Override - Ensures real email sending instead of simulation
// This script runs after all other scripts to forcefully enable EmailJS

console.log('EmailJS Force Override - Initializing real email functionality');

// Wait for page to be fully loaded
window.addEventListener('load', function() {
    // Give a moment for other scripts to initialize
    setTimeout(function() {
        console.log('Starting EmailJS force override...');
        
        // Load EmailJS SDK if not already loaded
        if (!window.emailjs) {
            console.log('Loading EmailJS SDK...');
            const script = document.createElement('script');
            script.src = 'https://cdn.emailjs.com/dist/email.min.js';
            script.onload = function() {
                console.log('EmailJS SDK loaded successfully');
                initializeRealEmailSending();
            };
            script.onerror = function() {
                console.error('Failed to load EmailJS SDK');
                showNotification('Failed to load email service. Please check your internet connection.', 'error');
            };
            document.head.appendChild(script);
        } else {
            console.log('EmailJS SDK already loaded');
            initializeRealEmailSending();
        }
    }, 1000);
});

function initializeRealEmailSending() {
    console.log('Initializing real email sending functionality...');
      // Set up default EmailJS configuration
    const defaultConfig = {
        service: 'emailjs',
        serviceId: 'service_6t8hyif',
        templateId: 'template_newsletter', // Use the actual template ID from your EmailJS dashboard
        publicKey: 'WkloAEeQols8UpWuh',
        fromEmail: 'ali.zuh.fin@gmail.com',
        fromName: 'Webropol Newsletter',
        useDirectHTML: true
    };
    
    // Store configuration if not exists
    if (!localStorage.getItem('emailServiceConfig')) {
        localStorage.setItem('emailServiceConfig', JSON.stringify(defaultConfig));
        console.log('EmailJS default configuration stored');
    }
    
    // Initialize EmailJS
    try {
        emailjs.init(defaultConfig.publicKey);
        console.log('EmailJS initialized with public key:', defaultConfig.publicKey);
        
        // Force override the sendEmailToServer function
        window.sendEmailToServer = createRealEmailSendFunction();
        console.log('Real email sending function activated - no more simulations!');
        
        // Show success notification
        setTimeout(() => {
            if (typeof showNotification === 'function') {
                showNotification('✅ Real email sending is now active (no more simulations)', 'success');
            }
        }, 2000);
        
    } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
        if (typeof showNotification === 'function') {
            showNotification('Email initialization failed: ' + error.message, 'error');
        }
    }
}

function createRealEmailSendFunction() {
    return function(emailData, type) {
        console.log('🚀 REAL EMAIL SENDING - Type:', type, 'Data:', emailData);
        
        if (!window.emailjs) {
            console.error('EmailJS not available');
            if (typeof showNotification === 'function') {
                showNotification('Email service not available', 'error');
            }
            return;
        }
        
        // Get configuration
        const config = JSON.parse(localStorage.getItem('emailServiceConfig') || '{}');
        
        if (!config.serviceId) {
            console.error('Email service not configured');
            if (typeof showNotification === 'function') {
                showNotification('Email service not configured. Please check settings.', 'error');
            }
            return;
        }
          // Prepare email parameters for direct HTML sending
        const templateParams = {
            to_email: Array.isArray(emailData.to) ? emailData.to.join(',') : emailData.to,
            from_name: config.fromName || 'Campaign Sender',
            from_email: config.fromEmail || 'noreply@example.com',
            subject: emailData.subject || 'Campaign Email',
            html_content: emailData.html || emailData.body || '<p>No content provided</p>',
            reply_to: config.fromEmail || 'noreply@example.com'
        };
        
        console.log('Sending email with parameters:', templateParams);
        
        // Show sending notification
        if (typeof showNotification === 'function') {
            showNotification('📤 Sending real email...', 'info');
        }        // Send via EmailJS using multiple approaches
        const templateId = config.templateId || 'template_newsletter';
        const fallbackTemplateIds = ['template_newsletter', 'template_default', 'template_email', 'template_campaign'];
        
        // First try: Use EmailJS send with template
        console.log('📧 Attempting to send email via EmailJS...');
        
        // Function to try sending with different approaches
        function tryEmailJSSend() {
            // Approach 1: Try with available templates
            function tryWithTemplates(templateIds, index = 0) {
                if (index >= templateIds.length) {
                    // All templates failed, try direct approach
                    tryDirectEmailSend();
                    return;
                }
                
                const currentTemplateId = templateIds[index];
                console.log(`Trying template ID: ${currentTemplateId}`);
                
                emailjs.send(config.serviceId, currentTemplateId, templateParams)
                    .then(function(response) {
                        console.log('✅ Email sent successfully with template:', currentTemplateId, response);
                        
                        // Update config with working template ID
                        config.templateId = currentTemplateId;
                        localStorage.setItem('emailServiceConfig', JSON.stringify(config));
                        
                        const recipientCount = Array.isArray(emailData.to) ? emailData.to.length : 1;
                        const message = type === 'test' 
                            ? `✅ Test email sent successfully to ${emailData.to}` 
                            : `✅ Campaign sent successfully to ${recipientCount} recipient(s)`;
                        
                        if (typeof showNotification === 'function') {
                            showNotification(message, 'success');
                        }
                    })
                    .catch(function(error) {
                        console.error(`❌ Template ${currentTemplateId} failed:`, error);
                        
                        // If this is a template not found error, try next template
                        if (error.text && error.text.includes('template ID not found')) {
                            tryWithTemplates(templateIds, index + 1);
                        } else {
                            // Other error, show it
                            handleEmailError(error);
                        }
                    });
            }
            
            // Approach 2: Direct email sending without templates (fallback)
            function tryDirectEmailSend() {
                console.log('🔄 Trying direct email send without templates...');
                
                // Create a form dynamically for EmailJS sendForm
                const form = document.createElement('form');
                form.style.display = 'none';
                
                // Add form fields
                const fields = {
                    to_email: Array.isArray(emailData.to) ? emailData.to.join(',') : emailData.to,
                    from_name: config.fromName || 'Campaign Sender',
                    subject: emailData.subject || 'Campaign Email',
                    message: emailData.html || emailData.body || 'No content provided',
                    reply_to: config.fromEmail || 'noreply@example.com'
                };
                
                Object.keys(fields).forEach(key => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = fields[key];
                    form.appendChild(input);
                });
                
                document.body.appendChild(form);
                
                // Try with a basic service template
                emailjs.sendForm(config.serviceId, 'contact_form', form)
                    .then(function(response) {
                        console.log('✅ Direct email sent successfully!', response);
                        document.body.removeChild(form);
                        
                        const recipientCount = Array.isArray(emailData.to) ? emailData.to.length : 1;
                        const message = type === 'test' 
                            ? `✅ Test email sent successfully to ${emailData.to}` 
                            : `✅ Campaign sent successfully to ${recipientCount} recipient(s)`;
                        
                        if (typeof showNotification === 'function') {
                            showNotification(message, 'success');
                        }
                    })
                    .catch(function(error) {
                        console.error('❌ Direct email also failed:', error);
                        document.body.removeChild(form);
                        handleEmailError(error);
                    });
            }
            
            // Start with template approach
            tryWithTemplates(fallbackTemplateIds);
        }
        
        function handleEmailError(error) {
            let errorMessage = 'Failed to send email';
            if (error.text) {
                errorMessage += ': ' + error.text;
            } else if (error.message) {
                errorMessage += ': ' + error.message;
            }
            
            // Add helpful message about template creation
            if (error.text && error.text.includes('template ID not found')) {
                errorMessage += '\n\n📋 To fix this:\n1. Go to https://dashboard.emailjs.com/admin/templates\n2. Create a new template\n3. Use variables: {{to_email}}, {{subject}}, {{html_content}}, {{from_name}}';
            }
            
            if (typeof showNotification === 'function') {
                showNotification(errorMessage, 'error');
            }
        }
        
        // Start the email sending process
        tryEmailJSSend();
    };
}

// Also provide utility functions
window.getEmailServiceConfig = function() {
    try {
        return JSON.parse(localStorage.getItem('emailServiceConfig') || '{}');
    } catch (e) {
        console.error('Failed to parse email config:', e);
        return {};
    }
};

window.showEmailServiceConfigDialog = function(emailData, type) {
    if (typeof showNotification === 'function') {
        showNotification('Email service configuration needed. Please check the Settings.', 'warning');
    }
    console.log('Email service configuration dialog requested for:', emailData, type);
};

console.log('EmailJS Force Override script loaded');
