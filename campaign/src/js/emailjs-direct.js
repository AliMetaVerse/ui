// EmailJS Direct HTML Email Sending - Bypasses Templates
// This module sends HTML emails directly without requiring EmailJS templates

// Load the EmailJS SDK
const emailjsScript = document.createElement('script');
emailjsScript.src = 'https://cdn.emailjs.com/dist/email.min.js';
document.head.appendChild(emailjsScript);

// Initialize EmailJS when script is loaded
emailjsScript.onload = function() {
    // Initialize with stored public key if available
    (function() {
        const publicKey = localStorage.getItem('emailjs_public_key') || 'WkloAEeQols8UpWuh';
        if (publicKey) {
            try {
                emailjs.init(publicKey);
                console.log('EmailJS Direct HTML initialized with public key');
                
                // Store the public key if not already stored
                if (!localStorage.getItem('emailjs_public_key')) {
                    localStorage.setItem('emailjs_public_key', publicKey);
                }
                
                // Log initialization success with subtle notification
                setTimeout(() => {
                    if (typeof showNotification !== 'undefined') {
                        showNotification('EmailJS ready for direct HTML email sending', 'success');
                    }
                }, 1000);
            } catch (error) {
                console.error('Failed to initialize EmailJS:', error);
                if (typeof showNotification !== 'undefined') {
                    showNotification('Email system initialization failed', 'error');
                }
            }
        } else {
            console.warn('No EmailJS public key found. Email sending will not work until configured.');
        }
    })();
    console.log('EmailJS SDK loaded successfully for direct HTML sending');
};

// When the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Pre-configure EmailJS settings for direct HTML sending
    preConfigureDirectHTML();
    
    // Show a console message indicating direct HTML mode
    console.log('EmailJS configured for direct HTML email sending (no templates required)');
});

// Pre-configure EmailJS for direct HTML sending
function preConfigureDirectHTML() {
    // Set EmailJS as the default service with direct HTML mode
    if (!localStorage.getItem('emailServiceConfig')) {
        const directConfig = {
            service: 'emailjs',
            serviceId: 'service_6t8hyif',  // Pre-filled with your service ID
            templateId: 'DIRECT_HTML',  // Special value indicating direct HTML sending
            publicKey: 'WkloAEeQols8UpWuh',  // Your EmailJS public key
            fromEmail: 'ali.zuh.fin@gmail.com',
            fromName: 'Webropol Newsletter',
            useDirectHTML: true  // Flag to indicate we're sending HTML directly
        };
        
        localStorage.setItem('emailServiceConfig', JSON.stringify(directConfig));
        
        // Also store the public key separately for immediate initialization
        localStorage.setItem('emailjs_public_key', directConfig.publicKey);
        
        console.log('EmailJS set for direct HTML email sending - ready to send real emails!');
    } else {
        // Fix any existing configuration to use direct HTML mode
        try {
            const existingConfig = JSON.parse(localStorage.getItem('emailServiceConfig'));
            if (existingConfig.service === 'emailjs' && !existingConfig.useDirectHTML) {
                console.log('Upgrading configuration to direct HTML mode');
                existingConfig.useDirectHTML = true;
                existingConfig.templateId = 'DIRECT_HTML';
                localStorage.setItem('emailServiceConfig', JSON.stringify(existingConfig));
            }
        } catch (e) {
            console.error('Error fixing existing config:', e);
        }
    }
}

// Send a single HTML email directly using EmailJS API
function sendDirectHTMLEmail(emailConfig, toEmail, subject, htmlContent, campaignName) {
    return new Promise((resolve, reject) => {
        // Use EmailJS API directly without templates
        const emailData = {
            service_id: emailConfig.serviceId,
            user_id: emailConfig.publicKey,
            template_params: {
                to_email: toEmail,
                from_name: emailConfig.fromName,
                from_email: emailConfig.fromEmail,
                subject: subject,
                message: htmlContent,
                html_content: htmlContent,
                campaign_name: campaignName,
                reply_to: emailConfig.fromEmail
            }
        };
        
        // Make direct API call to EmailJS
        fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        })
        .then(data => {
            console.log('Direct HTML Email SUCCESS:', data);
            resolve(data);
        })
        .catch(error => {
            console.error('Direct HTML Email FAILED:', error);
            reject(error);
        });
    });
}

// Main function to send emails with direct HTML content
window.sendDirectHTMLEmails = function(emailData, type) {
    const emailConfig = getEmailServiceConfig();
    
    if (!emailConfig || !emailConfig.useDirectHTML) {
        console.error('Direct HTML mode not configured');
        if (typeof showNotification !== 'undefined') {
            showNotification('Direct HTML email mode not configured', 'error');
        }
        return;
    }
    
    if (typeof showNotification !== 'undefined') {
        showNotification('Sending email with direct HTML content...', 'info');
    }
    
    // For single recipient (test email)
    if (type === 'test') {
        sendDirectHTMLEmail(
            emailConfig, 
            emailData.to, 
            emailData.subject, 
            emailData.html, 
            emailData.campaignName || 'Test Campaign'
        )
        .then(() => {
            showSuccessNotification(emailData, type);
        })
        .catch((error) => {
            console.error('Failed to send test email:', error);
            if (typeof showNotification !== 'undefined') {
                showNotification('Failed to send test email. Check console for details.', 'error');
            }
        });
    } else {
        // For multiple recipients (campaign)
        const recipients = Array.isArray(emailData.to) ? emailData.to : [emailData.to];
        let successCount = 0;
        let failCount = 0;
        
        const sendPromises = recipients.map(recipient => {
            return sendDirectHTMLEmail(
                emailConfig, 
                recipient, 
                emailData.subject, 
                emailData.html, 
                emailData.campaignName || 'Campaign'
            )
            .then(() => {
                successCount++;
                console.log(`Email sent successfully to: ${recipient}`);
            })
            .catch((error) => {
                failCount++;
                console.error(`Failed to send email to ${recipient}:`, error);
            });
        });
        
        Promise.allSettled(sendPromises).then(() => {
            if (successCount > 0) {
                showSuccessNotification({
                    ...emailData,
                    to: `${successCount} recipients`
                }, type);
            }
            if (failCount > 0 && typeof showNotification !== 'undefined') {
                showNotification(`${failCount} emails failed to send`, 'warning');
            }
        });
    }
};

// Helper function to show success notifications
function showSuccessNotification(emailData, type) {
    // Create notification
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
            <h3 style="margin-top:0">📧 Email Sent Successfully!</h3>
            <p>Direct HTML email was sent to: <strong>${emailData.to}</strong></p>
            <p style="margin-bottom:0; font-size: 0.9em; opacity: 0.9;">✓ No templates required - HTML sent directly</p>
        `;
        if (typeof showNotification !== 'undefined') {
            showNotification(`Direct HTML email sent successfully to ${emailData.to}`, 'success');
        }
    } else {
        const recipientCount = Array.isArray(emailData.to) ? emailData.to.length : 1;
        notificationDiv.innerHTML = `
            <h3 style="margin-top:0">🚀 Campaign Sent!</h3>
            <p>Campaign "<strong>${emailData.campaignName}</strong>" was sent to <strong>${recipientCount}</strong> recipients.</p>
            <p style="margin-bottom:0; font-size: 0.9em; opacity: 0.9;">✓ Direct HTML delivery - no templates needed</p>
        `;
        if (typeof showNotification !== 'undefined') {
            showNotification(`Campaign "${emailData.campaignName}" sent to ${recipientCount} recipients`, 'success');
        }
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
}

// Test function for direct HTML email sending
window.testDirectHTMLConnection = function() {
    const config = getEmailServiceConfig();
    
    if (!config || !config.useDirectHTML) {
        if (typeof showNotification !== 'undefined') {
            showNotification('Direct HTML mode not configured', 'error');
        }
        return;
    }
    
    if (typeof showNotification !== 'undefined') {
        showNotification('Testing direct HTML email connection...', 'info');
    }
    
    // Test with direct HTML sending
    sendDirectHTMLEmail(
        config, 
        'test@example.com', 
        'Direct HTML Connection Test', 
        '<h2>Success!</h2><p>This email was sent directly with HTML content without requiring any EmailJS templates.</p>', 
        'Connection Test'
    )
    .then(function(response) {
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
            <h3 style="margin-top: 0">✅ Connection Successful!</h3>
            <p>Direct HTML email sending is working correctly.</p>
            <p style="font-size: 0.9em; opacity: 0.9;">No templates required!</p>
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
            <h3 style="margin-top: 0">❌ Connection Failed</h3>
            <p>There's an issue with your direct HTML email configuration:</p>
            <div style="background: rgba(0,0,0,0.2); padding: 10px; margin: 10px 0; text-align: left; border-radius: 4px; max-height: 100px; overflow-y: auto;">
                ${error.message || error.text || 'Unknown error'}
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

console.log('📧 EmailJS Direct HTML module loaded - ready for template-free email sending!');
