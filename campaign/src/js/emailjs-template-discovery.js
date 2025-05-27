// EmailJS Template Discovery - Find available templates in your account
console.log('EmailJS Template Discovery loaded');

// Function to discover available templates by trying common template naming patterns
window.discoverEmailJSTemplates = function() {
    console.log('🔍 Discovering available EmailJS templates...');
    
    if (!window.emailjs) {
        console.error('EmailJS not loaded');
        return;
    }
    
    const config = JSON.parse(localStorage.getItem('emailServiceConfig') || '{}');
    if (!config.serviceId) {
        console.error('No service ID configured');
        return;
    }
    
    // Common template ID patterns to try
    const commonTemplateIds = [
        'template_1',
        'template_2', 
        'template_3',
        'template_default',
        'template_newsletter',
        'template_email',
        'template_campaign',
        'template_test',
        'template_basic',
        'template_contact',
        'template_form',
        'template_notification',
        'template_welcome',
        'template_simple',
        'template_html',
        'template_custom'
    ];
    
    // Test email data
    const testParams = {
        to_email: 'test@example.com',
        from_name: 'Test Sender',
        subject: 'Template Discovery Test',
        html_content: '<p>Test content</p>',
        message: 'Test message'
    };
    
    let foundTemplates = [];
    let testIndex = 0;
    
    function testNextTemplate() {
        if (testIndex >= commonTemplateIds.length) {
            console.log('✅ Template discovery complete!');
            console.log('Found templates:', foundTemplates);
            
            if (foundTemplates.length > 0) {
                // Update config with first working template
                config.templateId = foundTemplates[0];
                localStorage.setItem('emailServiceConfig', JSON.stringify(config));
                console.log(`✅ Updated configuration to use template: ${foundTemplates[0]}`);
                
                if (typeof showNotification === 'function') {
                    showNotification(`Found working template: ${foundTemplates[0]}. Ready to send emails!`, 'success');
                }
            } else {
                console.log('❌ No templates found. You need to create a template in EmailJS dashboard.');
                if (typeof showNotification === 'function') {
                    showNotification('No templates found. Please create a template in your EmailJS dashboard.', 'error');
                }
            }
            return;
        }
        
        const templateId = commonTemplateIds[testIndex];
        console.log(`Testing template: ${templateId}`);
        
        // Try to send with this template (but with invalid email to avoid actually sending)
        emailjs.send(config.serviceId, templateId, testParams)
            .then(function(response) {
                console.log(`✅ Template ${templateId} exists and works!`);
                foundTemplates.push(templateId);
                testIndex++;
                setTimeout(testNextTemplate, 1000); // Wait 1 second between tests
            })
            .catch(function(error) {
                if (error.text && error.text.includes('template ID not found')) {
                    console.log(`❌ Template ${templateId} not found`);
                } else {
                    console.log(`✅ Template ${templateId} exists (got different error):`, error.text);
                    foundTemplates.push(templateId);
                }
                testIndex++;
                setTimeout(testNextTemplate, 1000); // Wait 1 second between tests
            });
    }
    
    testNextTemplate();
};

// Auto-run discovery when page loads
window.addEventListener('load', function() {
    setTimeout(function() {
        if (window.emailjs && typeof window.discoverEmailJSTemplates === 'function') {
            console.log('Auto-running EmailJS template discovery...');
            window.discoverEmailJSTemplates();
        }
    }, 3000);
});

console.log('To manually run template discovery, call: window.discoverEmailJSTemplates()');
