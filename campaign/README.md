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

The tool now uses EmailJS to send real emails to recipients. To configure:

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

## Testing Email Sending

When you click "Send Test Email" you will be prompted to enter a recipient email address. The email will be sent to your Mailtrap inbox rather than to the actual recipient.

## Customizing Templates

You can create and save your own email templates by:
1. Designing your email in the editor
2. Switching to HTML source mode
3. Copying the HTML code
4. Saving it to a file for future use
