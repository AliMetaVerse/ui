// Mailtrap integration for email campaign tool

// When the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Pre-configure Mailtrap settings
    preConfigureMailtrap();
});

// Pre-configure Mailtrap if no configuration exists
function preConfigureMailtrap() {    // Only set default if no existing config
    if (!localStorage.getItem('emailServiceConfig')) {
        const defaultConfig = {
            service: 'mailtrap',
            apiKey: 'dd79bf6ee20ede946ece14f162b3f2ac', // Your Mailtrap API key
            serviceUrl: 'https://send.api.mailtrap.io/api/send',
            fromEmail: 'campaign@yourdomain.com',  // Update this with your preferred sender
            fromName: 'Email Campaign Tool'        // Update this with your preferred name
        };
        localStorage.setItem('emailServiceConfig', JSON.stringify(defaultConfig));
        console.log('Mailtrap configuration pre-set successfully');
    }
}

// Extend the sendEmailToServer function
const originalSendEmailToServer = window.sendEmailToServer;
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
                showNotification(`Test email sent successfully to ${emailData.to}`, 'success');
            } else {
                showNotification(`Campaign "${emailData.campaignName}" sent to ${emailData.to.length} recipients`, 'success');
            }
        })
        .catch(error => {
            console.error('Error sending email:', error);
            showNotification(`Failed to send email via Mailtrap: ${error.message}`, 'error');
        });
    } else if (originalSendEmailToServer) {
        // Use original function for other services
        originalSendEmailToServer(emailData, type);
    } else {
        // Fallback if original function not available
        showNotification('Email service not properly configured', 'error');
    }
};
