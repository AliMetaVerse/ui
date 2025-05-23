# Email Campaign Sender Tool

A modern email campaign creator with CK Editor integration and Mailtrap support.

## Features

- Rich text email editor with CK Editor 5
- HTML source code editing capability
- Email recipient management
- HTML template import/export
- Live email preview
- Integration with email services (Mailtrap configured)

## Setup

### Quick Start

1. Make sure you have Node.js installed
2. Run the server:
```
node server.js
```
3. Open your browser and go to http://localhost:3000

### Email Service Configuration

You have two options for sending emails:

#### 1. EmailJS (Recommended for Real Email Sending)

The tool now uses EmailJS to send real emails to recipients. A detailed setup guide is available within the application (click the "Setup Guide" button). To configure:

1. Create a free account at [emailjs.com](https://www.emailjs.com/)
2. Set up an email service (Gmail, Outlook, etc.)
3. Create an email template that includes these variables:
   - `{{to_email}}` - Recipient email(s)
   - `{{from_name}}` - Sender name
   - `{{from_email}}` - Sender email
   - `{{subject}}` - Email subject
   - `{{message_html}}` - Email HTML content
4. Get your Service ID, Template ID, and Public Key
5. Enter these details in the "Email Settings" dialog in the app

For detailed instructions with screenshots and troubleshooting tips, use the "Setup Guide" button in the application. The guide contains:
- Step-by-step instructions for EmailJS setup
- Example template code
- Template variable requirements
- Troubleshooting common issues

#### 2. Mailtrap (For Testing Only)

Alternatively, you can still use Mailtrap for testing. This will deliver emails to your Mailtrap inbox rather than to actual recipients.

- Default API Key: dd79bf6ee20ede946ece14f162b3f2ac
- Default Endpoint: https://send.api.mailtrap.io/api/send

You can switch between EmailJS and Mailtrap in the Email Settings dialog.

## Using the HTML Source Editor

1. Click on "HTML Source" to switch from the visual editor
2. Edit your HTML directly or use the buttons to:
   - Import HTML files
   - Copy HTML to clipboard
   - Paste HTML from clipboard
3. Click "Apply HTML" to update the visual editor with your changes

## Troubleshooting Email Sending

The campaign tool includes several features to help diagnose and fix email sending issues:

### Setup Guide
Click the "Setup Guide" button for comprehensive instructions on setting up EmailJS with screenshots and examples.

### Verification Checklist
Use the verification checklist (linked from the setup guide) to ensure you've completed all necessary steps for EmailJS integration.

### Debug Tool
Click the "Debug" button to access the EmailJS diagnostics tool, which helps identify and resolve common issues:

- **Diagnostics tab**: Runs tests on your EmailJS configuration and identifies problems
- **Configuration tab**: View, reset, or repair your EmailJS settings
- **Template Helper tab**: Get example templates and copy them to your clipboard
- **Logs tab**: Review a history of email sending attempts and errors

## Testing Email Sending

When you click "Send Test Email" you will be prompted to enter a recipient email address. 

- If using EmailJS, the test email will be sent to the actual recipient email address.
- If using Mailtrap, the email will be sent to your Mailtrap inbox rather than to the actual recipient.

You can use the "Connection Test" feature in the Email Settings dialog to verify your EmailJS configuration is working properly without sending an actual email.

## Customizing Templates

You can create and save your own email templates by:
1. Designing your email in the editor
2. Switching to HTML source mode
3. Copying the HTML code
4. Saving it to a file for future use
