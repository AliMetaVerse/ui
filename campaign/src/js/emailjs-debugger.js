/**
 * EmailJS Debugger
 * This script helps diagnose and resolve issues with EmailJS integration.
 */

// Initialize the debugging tools when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add the debug button to the UI
    addDebugButton();
});

// Add a debug button to the interface
function addDebugButton() {
    const actionsSection = document.querySelector('.action-buttons');
    if (!actionsSection) return;
    
    // Check if the button already exists
    if (document.getElementById('debug-emailjs-btn')) return;
    
    // Create and add the debug button
    const debugBtn = document.createElement('button');
    debugBtn.id = 'debug-emailjs-btn';
    debugBtn.className = 'btn btn-secondary';
    debugBtn.title = 'Run EmailJS diagnostics';
    debugBtn.innerHTML = '<span style="color: #ffcc00;">⚠</span> Debug';
    debugBtn.style.marginLeft = '10px';
    debugBtn.style.backgroundColor = '#444';
    
    // Add event listener
    debugBtn.addEventListener('click', showDebugPanel);
    
    // Insert after the emailjs guide button
    const guideBtn = document.getElementById('email-guide-btn');
    if (guideBtn && guideBtn.parentNode) {
        guideBtn.parentNode.insertBefore(debugBtn, guideBtn.nextSibling);
    } else {
        actionsSection.appendChild(debugBtn);
    }
}

// Show the debug panel
function showDebugPanel() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '10000';
    
    // Create panel container
    const panel = document.createElement('div');
    panel.style.backgroundColor = '#fff';
    panel.style.width = '80%';
    panel.style.maxWidth = '800px';
    panel.style.maxHeight = '80vh';
    panel.style.borderRadius = '8px';
    panel.style.padding = '20px';
    panel.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.overflow = 'hidden';
    
    // Create header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '15px';
    
    const title = document.createElement('h2');
    title.textContent = 'EmailJS Diagnostics';
    title.style.margin = '0';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.padding = '5px 10px';
    closeBtn.onclick = function() {
        document.body.removeChild(overlay);
    };
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    panel.appendChild(header);
    
    // Create content area with tabs
    const tabsContainer = document.createElement('div');
    tabsContainer.style.display = 'flex';
    tabsContainer.style.marginBottom = '15px';
    tabsContainer.style.borderBottom = '1px solid #ddd';
    
    const tabs = [
        { id: 'diagnostics', label: 'Diagnostics', active: true },
        { id: 'configuration', label: 'Configuration', active: false },
        { id: 'templates', label: 'Template Helper', active: false },
        { id: 'logs', label: 'Logs', active: false }
    ];
    
    tabs.forEach(tab => {
        const tabElement = document.createElement('div');
        tabElement.textContent = tab.label;
        tabElement.dataset.tabId = tab.id;
        tabElement.style.padding = '10px 15px';
        tabElement.style.cursor = 'pointer';
        tabElement.style.borderBottom = tab.active ? '2px solid #3b82f6' : 'none';
        tabElement.style.fontWeight = tab.active ? 'bold' : 'normal';
        tabElement.style.color = tab.active ? '#3b82f6' : '#333';
        tabElement.onclick = function() {
            document.querySelectorAll('[data-tab-id]').forEach(t => {
                t.style.borderBottom = 'none';
                t.style.fontWeight = 'normal';
                t.style.color = '#333';
            });
            tabElement.style.borderBottom = '2px solid #3b82f6';
            tabElement.style.fontWeight = 'bold';
            tabElement.style.color = '#3b82f6';
            
            document.querySelectorAll('[data-tab-content]').forEach(c => {
                c.style.display = 'none';
            });
            document.querySelector(`[data-tab-content="${tab.id}"]`).style.display = 'block';
        };
        tabsContainer.appendChild(tabElement);
    });
    
    panel.appendChild(tabsContainer);
    
    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.style.flexGrow = '1';
    contentContainer.style.overflow = 'auto';
    contentContainer.style.padding = '10px 0';
    
    // Diagnostics tab content
    const diagnosticsContent = document.createElement('div');
    diagnosticsContent.dataset.tabContent = 'diagnostics';
    diagnosticsContent.style.display = 'block';
    diagnosticsContent.innerHTML = `
        <div style="margin-bottom: 20px;">
            <p>This tool will help diagnose issues with your EmailJS setup.</p>
            <button id="run-diagnostics-btn" style="background: #3b82f6; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Run Diagnostics</button>
        </div>
        <div id="diagnostics-results" style="background: #f5f5f5; padding: 15px; border-radius: 5px; max-height: 350px; overflow: auto;">
            <p>Click "Run Diagnostics" to check your EmailJS configuration.</p>
        </div>
    `;
    
    // Configuration tab content
    const configContent = document.createElement('div');
    configContent.dataset.tabContent = 'configuration';
    configContent.style.display = 'none';
    configContent.innerHTML = `
        <div style="margin-bottom: 15px;">
            <p>Current EmailJS Configuration:</p>
            <div id="current-config" style="background: #f5f5f5; padding: 15px; border-radius: 5px; max-height: 200px; overflow: auto; font-family: monospace;"></div>
        </div>
        <div>
            <button id="reset-config-btn" style="background: #ef4444; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-right: 10px;">Reset Configuration</button>
            <button id="repair-config-btn" style="background: #10b981; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Repair Configuration</button>
        </div>
    `;
    
    // Templates tab content
    const templatesContent = document.createElement('div');
    templatesContent.dataset.tabContent = 'templates';
    templatesContent.style.display = 'none';
    templatesContent.innerHTML = `
        <div style="margin-bottom: 15px;">
            <p>EmailJS Template Example:</p>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; max-height: 300px; overflow: auto; white-space: pre-wrap; font-family: monospace; font-size: 12px;">
&lt;!-- EmailJS Template Example -->
&lt;h2>{{subject}}&lt;/h2>
&lt;p>From: {{from_name}} &lt;{{from_email}}>&lt;/p>
&lt;div>
  {{message_html}}
&lt;/div>
&lt;p style="font-size: 12px; color: #666; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
  This email was sent as part of the "{{campaign_name}}" campaign.
&lt;/p>
            </pre>
            <p style="margin-top: 20px;">Variables that must be included in your template:</p>
            <ul style="padding-left: 20px;">
                <li><strong>{{to_email}}</strong> - Recipient email address</li>
                <li><strong>{{from_name}}</strong> - Sender name</li>
                <li><strong>{{from_email}}</strong> - Sender email</li>
                <li><strong>{{subject}}</strong> - Email subject line</li>
                <li><strong>{{message_html}}</strong> - HTML content of the email</li>
            </ul>
            <button id="copy-template-btn" style="background: #3b82f6; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Copy Template</button>
        </div>
    `;
    
    // Logs tab content
    const logsContent = document.createElement('div');
    logsContent.dataset.tabContent = 'logs';
    logsContent.style.display = 'none';
    logsContent.innerHTML = `
        <div style="margin-bottom: 15px;">
            <p>Email Sending Logs:</p>
            <div id="email-logs" style="background: #f5f5f5; padding: 15px; border-radius: 5px; height: 300px; overflow: auto; font-family: monospace; font-size: 12px;"></div>
        </div>
        <div>
            <button id="clear-logs-btn" style="background: #6b7280; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Clear Logs</button>
        </div>
    `;
    
    contentContainer.appendChild(diagnosticsContent);
    contentContainer.appendChild(configContent);
    contentContainer.appendChild(templatesContent);
    contentContainer.appendChild(logsContent);
    panel.appendChild(contentContainer);
    
    // Add the panel to the overlay
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    
    // Attach event listeners
    attachDebuggerEventListeners();
    
    // Load current configuration immediately
    loadCurrentConfiguration();
    loadEmailLogs();
}

// Attach event listeners for the debug panel
function attachDebuggerEventListeners() {
    // Run diagnostics button
    const runDiagnosticsBtn = document.getElementById('run-diagnostics-btn');
    if (runDiagnosticsBtn) {
        runDiagnosticsBtn.addEventListener('click', runEmailJSDiagnostics);
    }
    
    // Reset configuration button
    const resetConfigBtn = document.getElementById('reset-config-btn');
    if (resetConfigBtn) {
        resetConfigBtn.addEventListener('click', resetEmailJSConfig);
    }
    
    // Repair configuration button
    const repairConfigBtn = document.getElementById('repair-config-btn');
    if (repairConfigBtn) {
        repairConfigBtn.addEventListener('click', repairEmailJSConfig);
    }
    
    // Copy template button
    const copyTemplateBtn = document.getElementById('copy-template-btn');
    if (copyTemplateBtn) {
        copyTemplateBtn.addEventListener('click', copyTemplateToClipboard);
    }
    
    // Clear logs button
    const clearLogsBtn = document.getElementById('clear-logs-btn');
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', clearEmailLogs);
    }
}

// Load and display the current EmailJS configuration
function loadCurrentConfiguration() {
    const configDisplay = document.getElementById('current-config');
    if (!configDisplay) return;
    
    // Get configuration from localStorage
    const configString = localStorage.getItem('emailServiceConfig');
    if (!configString) {
        configDisplay.innerHTML = '<em>No configuration found.</em>';
        return;
    }
    
    try {
        const config = JSON.parse(configString);
        // Create a safer version for display (hiding full key)
        const safeConfig = { ...config };
        if (safeConfig.publicKey) {
            safeConfig.publicKey = safeConfig.publicKey.substring(0, 4) + '...' + 
                                  safeConfig.publicKey.substring(safeConfig.publicKey.length - 4);
        }
        if (safeConfig.apiKey) {
            safeConfig.apiKey = safeConfig.apiKey.substring(0, 4) + '...' + 
                               safeConfig.apiKey.substring(safeConfig.apiKey.length - 4);
        }
        
        // Format and display
        configDisplay.innerHTML = JSON.stringify(safeConfig, null, 2);
    } catch (e) {
        configDisplay.innerHTML = `<em>Error parsing configuration: ${e.message}</em>`;
    }
}

// Run diagnostics on the EmailJS configuration
function runEmailJSDiagnostics() {
    const resultsDiv = document.getElementById('diagnostics-results');
    if (!resultsDiv) return;
    
    resultsDiv.innerHTML = '<p>Running diagnostics...</p>';
    
    // Check if EmailJS SDK is loaded
    const sdkLoaded = typeof window.emailjs !== 'undefined';
    
    // Get configuration
    const configString = localStorage.getItem('emailServiceConfig');
    let config = null;
    let configValid = false;
    
    try {
        if (configString) {
            config = JSON.parse(configString);
            configValid = true;
        }
    } catch (e) {
        configValid = false;
    }
    
    // Start building results
    let results = `<h3>Diagnostic Results</h3>
                  <p><strong>Test completed at:</strong> ${new Date().toLocaleString()}</p>`;
    
    // Test 1: Check if EmailJS SDK is loaded
    results += `<p${sdkLoaded ? ' style="color: green;"' : ' style="color: red;"'}>
                <strong>EmailJS SDK:</strong> ${sdkLoaded ? '✓ Loaded' : '✗ Not loaded'}</p>`;
    
    // Test 2: Check if configuration exists and is valid JSON
    results += `<p${configValid ? ' style="color: green;"' : ' style="color: red;"'}>
                <strong>Configuration:</strong> ${configValid ? '✓ Valid' : '✗ Invalid or missing'}</p>`;
    
    // Additional tests if config exists
    if (config) {
        // Test 3: Check if using EmailJS
        const usingEmailJS = config.service === 'emailjs';
        results += `<p${usingEmailJS ? ' style="color: green;"' : ' style="color: orange;"'}>
                    <strong>Service:</strong> ${usingEmailJS ? '✓ EmailJS' : '⚠ ' + (config.service || 'unknown')}</p>`;
        
        if (usingEmailJS) {
            // Test 4: Check Service ID
            const hasServiceId = !!config.serviceId;
            results += `<p${hasServiceId ? ' style="color: green;"' : ' style="color: red;"'}>
                        <strong>Service ID:</strong> ${hasServiceId ? '✓ Present' : '✗ Missing'}</p>`;
            
            // Test 5: Check Template ID
            const hasTemplateId = !!config.templateId;
            results += `<p${hasTemplateId ? ' style="color: green;"' : ' style="color: red;"'}>
                        <strong>Template ID:</strong> ${hasTemplateId ? '✓ Present' : '✗ Missing'}</p>`;
            
            // Test 6: Check Public Key
            const hasPublicKey = !!config.publicKey;
            results += `<p${hasPublicKey ? ' style="color: green;"' : ' style="color: red;"'}>
                        <strong>Public Key:</strong> ${hasPublicKey ? '✓ Present' : '✗ Missing'}</p>`;
            
            // Test 7: Check From Email
            const hasFromEmail = !!config.fromEmail;
            results += `<p${hasFromEmail ? ' style="color: green;"' : ' style="color: red;"'}>
                        <strong>From Email:</strong> ${hasFromEmail ? '✓ Present' : '✗ Missing'}</p>`;
            
            // Test 8: EmailJS initialization
            const emailJSInitialized = sdkLoaded && hasPublicKey && (typeof window.emailjs !== 'undefined') && 
                                      localStorage.getItem('emailjs_public_key') === config.publicKey;
            results += `<p${emailJSInitialized ? ' style="color: green;"' : ' style="color: red;"'}>
                        <strong>EmailJS Initialization:</strong> ${emailJSInitialized ? '✓ Successful' : '✗ Failed'}</p>`;
        }
    }
    
    // Add troubleshooting section
    results += `<h3>Troubleshooting</h3>`;
    
    if (!sdkLoaded) {
        results += `<p><strong>Issue:</strong> EmailJS SDK is not loaded</p>
                   <p><strong>Solution:</strong> Try refreshing the page. If the issue persists, check 
                   your internet connection or try using a different browser.</p>`;
    }
    
    if (!configValid) {
        results += `<p><strong>Issue:</strong> Configuration is invalid or missing</p>
                   <p><strong>Solution:</strong> Reset your configuration using the "Reset Configuration" 
                   button in the Configuration tab, then set up EmailJS again.</p>`;
    }
    
    if (config && config.service === 'emailjs') {
        if (!config.serviceId || !config.templateId || !config.publicKey || !config.fromEmail) {
            results += `<p><strong>Issue:</strong> One or more required EmailJS parameters are missing</p>
                       <p><strong>Solution:</strong> Click "Email Settings" in the main interface and 
                       complete all required fields. Make sure to follow the EmailJS Setup Guide.</p>`;
        }
    }
    
    // Add overall status and suggestions
    let overallStatus = 'Ready';
    let statusColor = 'green';
    
    if (!sdkLoaded || !configValid || (config && config.service === 'emailjs' && 
        (!config.serviceId || !config.templateId || !config.publicKey || !config.fromEmail))) {
        overallStatus = 'Configuration issues detected';
        statusColor = 'red';
    } else if (config && config.service !== 'emailjs') {
        overallStatus = 'Not using EmailJS (using ' + config.service + ')';
        statusColor = 'orange';
    }
    
    results += `<h3>Overall Status: <span style="color: ${statusColor};">${overallStatus}</span></h3>`;
    
    // Add recommendations
    if (statusColor === 'red') {
        results += `<p><strong>Recommendation:</strong> Fix the issues listed above, then try sending a test email.</p>`;
        if (config && config.service === 'emailjs' && !config.publicKey) {
            results += `<p><strong>Most critical issue:</strong> Missing Public Key. This is required to initialize the EmailJS SDK.</p>`;
        }
    } else if (statusColor === 'orange') {
        results += `<p><strong>Recommendation:</strong> If you want to send real emails, switch to EmailJS in the Email Settings.</p>`;
    } else {
        results += `<p><strong>Recommendation:</strong> Your configuration appears correct. Try sending a test email.</p>`;
    }
    
    // Display results
    resultsDiv.innerHTML = results;
    
    // Log this diagnostic run
    logEmailAction('Diagnostics', 'Ran email system diagnostics', 'info');
}

// Reset the EmailJS configuration
function resetEmailJSConfig() {
    if (confirm('Are you sure you want to reset your EmailJS configuration? This will remove all your current settings.')) {
        localStorage.removeItem('emailServiceConfig');
        localStorage.removeItem('emailjs_public_key');
        
        // Log the action
        logEmailAction('Configuration', 'Reset EmailJS configuration', 'warning');
        
        // Show confirmation
        alert('EmailJS configuration has been reset. You will need to configure it again before sending emails.');
        
        // Refresh the configuration display
        loadCurrentConfiguration();
    }
}

// Repair the EmailJS configuration with default settings
function repairEmailJSConfig() {
    if (confirm('This will attempt to repair your EmailJS configuration with default settings. Continue?')) {
        // Create default configuration
        const defaultConfig = {
            service: 'emailjs',
            serviceId: 'service_6t8hyif',
            templateId: 'template_newsletter',
            publicKey: '',
            fromEmail: 'ali.zuh.fin@gmail.com',
            fromName: 'Webropol Newsletter'
        };
        
        // Get current config to preserve any valid values
        try {
            const currentConfigString = localStorage.getItem('emailServiceConfig');
            if (currentConfigString) {
                const currentConfig = JSON.parse(currentConfigString);
                
                // Preserve valid values
                if (currentConfig.serviceId) defaultConfig.serviceId = currentConfig.serviceId;
                if (currentConfig.templateId) defaultConfig.templateId = currentConfig.templateId;
                if (currentConfig.publicKey) defaultConfig.publicKey = currentConfig.publicKey;
                if (currentConfig.fromEmail) defaultConfig.fromEmail = currentConfig.fromEmail;
                if (currentConfig.fromName) defaultConfig.fromName = currentConfig.fromName;
            }
        } catch (e) {
            console.error('Error parsing current config:', e);
        }
        
        // Save the repaired configuration
        localStorage.setItem('emailServiceConfig', JSON.stringify(defaultConfig));
        
        // If public key exists, also set it separately
        if (defaultConfig.publicKey) {
            localStorage.setItem('emailjs_public_key', defaultConfig.publicKey);
            
            // Try to initialize EmailJS
            if (window.emailjs) {
                try {
                    emailjs.init(defaultConfig.publicKey);
                } catch (e) {
                    console.error('Failed to initialize EmailJS:', e);
                }
            }
        }
        
        // Log the action
        logEmailAction('Configuration', 'Repaired EmailJS configuration', 'success');
        
        // Show confirmation
        alert('EmailJS configuration has been repaired. You may still need to update your Public Key in Email Settings.');
        
        // Refresh the configuration display
        loadCurrentConfiguration();
    }
}

// Copy template example to clipboard
function copyTemplateToClipboard() {
    const templateText = `<h2>{{subject}}</h2>
<p>From: {{from_name}} <{{from_email}}></p>
<div>
  {{message_html}}
</div>
<p style="font-size: 12px; color: #666; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
  This email was sent as part of the "{{campaign_name}}" campaign.
</p>`;

    // Use clipboard API to copy text
    navigator.clipboard.writeText(templateText).then(function() {
        alert('Template copied to clipboard!');
    }, function() {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = templateText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            alert('Template copied to clipboard!');
        } catch (err) {
            alert('Failed to copy template. Please copy it manually.');
            console.error('Failed to copy template:', err);
        }
        
        document.body.removeChild(textArea);
    });
}

// Log email-related actions
function logEmailAction(category, action, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        category,
        action,
        level
    };
    
    // Get existing logs
    let logs = [];
    try {
        const storedLogs = localStorage.getItem('emailjs_logs');
        if (storedLogs) {
            logs = JSON.parse(storedLogs);
        }
    } catch (e) {
        console.error('Error parsing logs:', e);
    }
    
    // Add new log entry
    logs.push(logEntry);
    
    // Limit to last 100 logs
    if (logs.length > 100) {
        logs = logs.slice(logs.length - 100);
    }
    
    // Save logs
    localStorage.setItem('emailjs_logs', JSON.stringify(logs));
    
    // Update display if logs tab is open
    loadEmailLogs();
}

// Load and display email logs
function loadEmailLogs() {
    const logsDisplay = document.getElementById('email-logs');
    if (!logsDisplay) return;
    
    // Get logs from localStorage
    let logs = [];
    try {
        const storedLogs = localStorage.getItem('emailjs_logs');
        if (storedLogs) {
            logs = JSON.parse(storedLogs);
        }
    } catch (e) {
        logsDisplay.innerHTML = `<em>Error loading logs: ${e.message}</em>`;
        return;
    }
    
    if (logs.length === 0) {
        logsDisplay.innerHTML = '<em>No logs found.</em>';
        return;
    }
    
    // Format and display logs
    let formattedLogs = '';
    logs.forEach(log => {
        const date = new Date(log.timestamp).toLocaleString();
        let color = '#333';
        
        switch (log.level) {
            case 'error':
                color = '#ef4444';
                break;
            case 'warning':
                color = '#f59e0b';
                break;
            case 'success':
                color = '#10b981';
                break;
            case 'info':
            default:
                color = '#3b82f6';
                break;
        }
        
        formattedLogs += `<div style="margin-bottom: 5px; border-left: 3px solid ${color}; padding-left: 10px;">
                          <span style="color: #666; font-size: 0.8em;">${date}</span>
                          <strong style="margin-left: 10px;">[${log.category}]</strong>
                          <span style="margin-left: 5px;">${log.action}</span>
                          </div>`;
    });
    
    logsDisplay.innerHTML = formattedLogs;
}

// Clear email logs
function clearEmailLogs() {
    if (confirm('Are you sure you want to clear all email logs?')) {
        localStorage.removeItem('emailjs_logs');
        
        // Update display
        const logsDisplay = document.getElementById('email-logs');
        if (logsDisplay) {
            logsDisplay.innerHTML = '<em>No logs found.</em>';
        }
        
        // Show confirmation
        alert('Email logs have been cleared.');
    }
}

// Hook into the email sending function to log actions
const originalSendEmailToServer = window.sendEmailToServer;
if (originalSendEmailToServer) {
    window.sendEmailToServer = function(emailData, type) {
        // Log the attempt
        logEmailAction('Sending', `Attempting to send ${type} email`, 'info');
        
        // Call the original function
        return originalSendEmailToServer(emailData, type);
    };
}

// Override the EmailJS send function to add logging
if (typeof emailjs !== 'undefined') {
    const originalSend = emailjs.send;
    emailjs.send = function(serviceId, templateId, templateParams) {
        // Log the attempt
        logEmailAction('EmailJS', `Sending email via service ${serviceId}, template ${templateId}`, 'info');
        
        // Call the original function with our own promise handling
        return originalSend(serviceId, templateId, templateParams)
            .then(function(response) {
                // Log success
                logEmailAction('EmailJS', `Email sent successfully (status: ${response.status})`, 'success');
                return response;
            })
            .catch(function(error) {
                // Log error
                logEmailAction('EmailJS', `Failed to send email: ${error.text || 'Unknown error'}`, 'error');
                throw error;
            });
    };
}
