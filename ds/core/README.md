# Webropol Design System

A unified design system for Webropol products that follows Tailwind best practices and uses ds.css color variables.

## Overview

The Webropol Design System provides a consistent set of UI components, styles, and patterns that can be used across all Webropol products. It is built with Tailwind CSS and follows best practices for modern web development.

## File Structure

- `ds-core.js`: Core functionality for the design system
- `inject-components.js`: Loader script that initializes the design system
- `ds.css`: Core CSS variables and styles

## Pages

- `index.html`: Overview and documentation
- `components.html`: UI components library
- `colors.html`: Color palette and usage
- `typography.html`: Typography styles and guidelines
- `spacing.html`: Spacing and layout guidelines
- `tokens.html`: Design tokens reference
- `feedback.html`: Feedback and support

## Usage

To use the design system in your project, include the following in the `<head>` of your HTML:

```html
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="../ds.css">
<link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
<script src="ds/inject-components.js" defer></script>
```

## Components

The design system includes the following components:

- Buttons
- Cards
- Form elements
- Navigation components
- Alerts and notifications
- Modals and dialogs
- Tables
- Typography components

## JavaScript API

The design system provides a JavaScript API for interacting with components programmatically:

```javascript
// Show a toast notification
window.dsUtils.showToast('Your message here', 'success'); // Types: success, warning, error, info

// Copy text to clipboard
window.dsUtils.copyToClipboard('Text to copy');
```

## Theme Colors

The design system uses the following color palette:

- Primary: Blue (#1e6880)
- Neutral: Gray (#272a2b)
- Success: Green (#448237)
- Warning: Orange (#f5980b)
- Error: Red (#be1241)

## Contributing

To contribute to the design system:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

© 2025 Webropol. All rights reserved.
