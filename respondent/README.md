# Survey UI Component

This project implements a modern, accessible survey form UI based on the provided design. The implementation uses Tailwind CSS for styling and Radix UI for accessible interactive components.

## Features

- Responsive design that works on all devices (mobile, tablet, desktop)
- Fully accessible components using Radix UI primitives
- Modular component structure for maintainability
- Configuration-driven survey creation
- Modern React implementation with hooks
- Customizable theme using Tailwind CSS

## File Structure

- `respondent.html` - Static HTML version with minimal JavaScript
- `survey-component.jsx` - React components implementation
- `survey-config.js` - Survey structure and configuration
- `survey-styles.css` - Tailwind CSS utilities and custom styles
- `index.jsx` - React entry point
- `package.json` - Dependencies and scripts
- `vite.config.js` - Build configuration
- `tailwind.config.js` - Tailwind CSS theme customization

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Usage

### Basic HTML Implementation

To use the basic HTML version:

```html
<div id="survey-container">
  <!-- The survey will be rendered here -->
</div>
<script src="path/to/respondent.html"></script>
```

### React Implementation

```jsx
import { Survey } from './survey-component';
import './survey-styles.css';

function App() {
  return (
    <div className="app">
      <Survey />
    </div>
  );
}
```

Or use the global render method in a non-React environment:

```html
<div id="survey-root"></div>
<script src="path/to/dist/survey-ui.umd.js"></script>
<script>
  window.renderSurvey('survey-root');
</script>
```

## Customization

### Survey Structure

Modify the `survey-config.js` file to change the survey structure, questions, and options.

### Styling

The UI is styled using Tailwind CSS. You can customize the appearance by:

1. Modifying the `tailwind.config.js` file to change the theme
2. Adding custom styles in `survey-styles.css`

## Accessibility Features

- Proper ARIA attributes on all interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly structure
- High contrast mode support

## Browser Support

The UI is compatible with all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
