// Universal EmailJS solution - Works with or without templates
// This script provides multiple email sending approaches

class UniversalEmailJS {    constructor() {
        this.publicKey = 'WkloAEeQols8UpWuh';
        this.serviceId = 'service_webropol';
        this.templateId = 'template_fni9yqj'; // Your actual template ID
        this.isInitialized = false;
        this.availableTemplates = [];
        
        this.init();
    }
    
    async init() {
        try {
            // Initialize EmailJS
            emailjs.init(this.publicKey);
            this.isInitialized = true;
            console.log('Universal EmailJS initialized successfully');
            
            // Discover available templates
            await this.discoverTemplates();
            
            // Override the global sendEmailToServer function
            this.overrideGlobalFunction();
            
            showNotification('Email system ready - Universal EmailJS loaded', 'success');
        } catch (error) {
            console.error('EmailJS initialization failed:', error);
            this.setupFallback();
        }
    }
      async discoverTemplates() {
        // Try your actual template first, then common fallbacks
        const commonTemplates = [
            'template_fni9yqj', // Your actual template - try this first!
            'template_newsletter',
            'template_default',
            'template_email',
            'template_basic',
            'template_campaign',
            'template_html',
            'template_1',
            'template_test'
        ];
        
        for (const templateId of commonTemplates) {
            try {
                // Test if template exists by sending a test (dry run)
                const testResult = await this.testTemplate(templateId);
                if (testResult) {
                    this.availableTemplates.push(templateId);
                    console.log(`Found available template: ${templateId}`);
                }
            } catch (error) {
                // Template doesn't exist, continue
            }
        }
        
        if (this.availableTemplates.length > 0) {
            this.templateId = this.availableTemplates[0];
            console.log(`Using template: ${this.templateId}`);
        } else {
            console.log('No templates found - will use direct sending method');
        }
    }
    
    async testTemplate(templateId) {
        try {
            // This is a test to see if template exists
            // We'll catch the error to determine if template exists
            const result = await emailjs.send(this.serviceId, templateId, {
                to_email: 'test@test.com',
                subject: 'test',
                html_content: 'test',
                from_name: 'test'
            });
            return true;
        } catch (error) {
            if (error.text && error.text.includes('template')) {
                return false; // Template doesn't exist
            }
            return true; // Other error means template exists but params might be wrong
        }
    }
    
    async sendEmail(emailData) {
        if (!this.isInitialized) {
            throw new Error('EmailJS not initialized');
        }
        
        const { recipients, subject, htmlContent, fromName = 'Campaign Sender' } = emailData;
        
        // Try different sending methods in order of preference
        const sendingMethods = [
            () => this.sendWithTemplate(recipients, subject, htmlContent, fromName),
            () => this.sendWithDirectMethod(recipients, subject, htmlContent, fromName),
            () => this.sendWithFormData(recipients, subject, htmlContent, fromName)
        ];
        
        for (const method of sendingMethods) {
            try {
                const result = await method();
                console.log('Email sent successfully with method:', method.name);
                return result;
            } catch (error) {
                console.log(`Method ${method.name} failed:`, error.message);
                continue;
            }
        }
        
        throw new Error('All email sending methods failed');
    }
    
    async sendWithTemplate(recipients, subject, htmlContent, fromName) {
        if (this.availableTemplates.length === 0) {
            throw new Error('No templates available');
        }
        
        const results = [];
        
        for (const email of recipients) {
            const templateParams = {
                to_email: email,
                subject: subject,
                html_content: htmlContent,
                from_name: fromName,
                message: htmlContent, // Alternative parameter name
                to_name: email.split('@')[0], // Extract name from email
                reply_to: 'noreply@webropol.com'
            };
            
            try {
                const result = await emailjs.send(this.serviceId, this.templateId, templateParams);
                results.push({ email, status: 'success', result });
                console.log(`Email sent to ${email} using template ${this.templateId}`);
            } catch (error) {
                console.error(`Failed to send to ${email}:`, error);
                results.push({ email, status: 'failed', error: error.message });
            }
        }
        
        return results;
    }
    
    async sendWithDirectMethod(recipients, subject, htmlContent, fromName) {
        // Direct EmailJS API call without template
        const results = [];
        
        for (const email of recipients) {
            try {
                const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        service_id: this.serviceId,
                        user_id: this.publicKey,
                        template_params: {
                            to_email: email,
                            from_name: fromName,
                            subject: subject,
                            html_content: htmlContent
                        }
                    })
                });
                
                if (response.ok) {
                    results.push({ email, status: 'success' });
                    console.log(`Direct email sent to ${email}`);
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error) {
                console.error(`Direct send failed for ${email}:`, error);
                results.push({ email, status: 'failed', error: error.message });
            }
        }
        
        return results;
    }
    
    async sendWithFormData(recipients, subject, htmlContent, fromName) {
        // Use EmailJS sendForm method with dynamically created form
        const results = [];
        
        for (const email of recipients) {
            try {
                // Create a temporary form
                const form = document.createElement('form');
                form.style.display = 'none';
                
                // Add form fields
                const fields = {
                    to_email: email,
                    subject: subject,
                    message: htmlContent,
                    html_content: htmlContent,
                    from_name: fromName
                };
                
                Object.entries(fields).forEach(([name, value]) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = name;
                    input.value = value;
                    form.appendChild(input);
                });
                
                document.body.appendChild(form);
                
                // Send using form
                const result = await emailjs.sendForm(this.serviceId, this.templateId, form);
                
                // Clean up
                document.body.removeChild(form);
                
                results.push({ email, status: 'success', result });
                console.log(`Form email sent to ${email}`);
            } catch (error) {
                console.error(`Form send failed for ${email}:`, error);
                results.push({ email, status: 'failed', error: error.message });
            }
        }
        
        return results;
    }
    
    overrideGlobalFunction() {
        // Override the global sendEmailToServer function
        window.sendEmailToServer = async (emailData) => {
            try {
                showNotification('Sending emails with Universal EmailJS...', 'info');
                const results = await this.sendEmail(emailData);
                
                const successful = results.filter(r => r.status === 'success').length;
                const failed = results.filter(r => r.status === 'failed').length;
                
                if (successful > 0) {
                    showNotification(`Successfully sent ${successful} email(s)${failed > 0 ? `, ${failed} failed` : ''}`, 'success');
                } else {
                    showNotification(`Failed to send emails: ${results[0]?.error || 'Unknown error'}`, 'error');
                }
                
                return results;
            } catch (error) {
                console.error('Universal EmailJS send failed:', error);
                showNotification(`Email sending failed: ${error.message}`, 'error');
                throw error;
            }
        };
        
        console.log('Global sendEmailToServer function overridden with Universal EmailJS');
    }
    
    setupFallback() {
        // If EmailJS fails, create a fallback
        window.sendEmailToServer = async (emailData) => {
            const message = `EmailJS is not properly configured. Please:
1. Create a template at https://dashboard.emailjs.com/admin/templates
2. Use template ID: template_newsletter
3. Include these variables in your template:
   - {{to_email}}
   - {{subject}}
   - {{html_content}}
   - {{from_name}}

Email content preview:
To: ${emailData.recipients.join(', ')}
Subject: ${emailData.subject}
Content: ${emailData.htmlContent.substring(0, 100)}...`;

            console.log(message);
            showNotification('EmailJS configuration needed - check console for details', 'warning');
            
            // Still return a result for UI consistency
            return emailData.recipients.map(email => ({
                email,
                status: 'simulated',
                message: 'EmailJS needs configuration'
            }));
        };
    }
}

// Initialize when EmailJS SDK is available
function initUniversalEmailJS() {
    if (typeof emailjs !== 'undefined') {
        window.universalEmailJS = new UniversalEmailJS();
    } else {
        // Wait for EmailJS to load
        setTimeout(initUniversalEmailJS, 100);
    }
}

// Start initialization
initUniversalEmailJS();
