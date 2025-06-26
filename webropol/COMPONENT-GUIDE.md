# Webropol Component Library

## Overview
This document outlines the standardized button and card components for the Webropol platform, designed to ensure consistency, accessibility, and maintainability across all user interfaces.

## Components

### 1. Button Component (`webropol-button`)

#### Variants
- **Primary**: High emphasis, used for main actions
- **Secondary**: Medium emphasis, used for supportive actions  
- **Tertiary**: Low emphasis, used for minimal or contextual actions
- **Danger**: For destructive actions (delete, remove, etc.)
- **Success**: For positive confirmation actions

#### Usage
```html
<webropol-button variant="primary" size="md" icon="fas fa-plus">
  Button Text
</webropol-button>
```

#### Attributes
- `variant`: primary | secondary | tertiary | danger | success (default: primary)
- `size`: sm | md | lg | xl (default: md)
- `icon`: FontAwesome class for icon
- `icon-position`: left | right (default: left)
- `disabled`: Boolean attribute to disable the button
- `full-width`: Boolean attribute to make button full width
- `href`: URL to navigate to (creates an anchor tag instead of button)
- `target`: Target for the link (e.g., "_blank")

#### Accessibility Features
- Focus indicators with ring styling
- Keyboard navigation support
- Screen reader compatible
- Proper contrast ratios
- Disabled state handling

### 2. Card Components

#### Main Card Component (`webropol-card`)
Container component for all card types.

```html
<webropol-card variant="standard" hoverable>
  <!-- Card content -->
</webropol-card>
```

**Attributes:**
- `variant`: standard | light | gradient | glass (default: standard)
- `gradient`: Custom gradient classes (e.g., "from-blue-100 to-teal-100")
- `hoverable`: Boolean attribute for hover effects
- `elevated`: Boolean attribute for enhanced shadow

#### Card Header (`webropol-card-header`)
Header section with icon, title, subtitle, and optional badge.

```html
<webropol-card-header 
  icon="fas fa-chart-line" 
  title="Analytics Dashboard" 
  subtitle="View detailed insights"
  badge="New"
  badge-variant="primary">
</webropol-card-header>
```

#### Card Content (`webropol-card-content`)
Main content area with configurable padding.

```html
<webropol-card-content padding="normal">
  <p>Your content here</p>
</webropol-card-content>
```

#### Card List (`webropol-card-list`)
Container for list items with optional collapsible functionality.

```html
<webropol-card-list title="Recent Items" collapsible default-open>
  <!-- List items -->
</webropol-card-list>
```

#### Card List Item (`webropol-card-list-item`)
Individual list item with icon, title, subtitle, status, and actions.

```html
<webropol-card-list-item 
  icon="fas fa-poll"
  title="Survey Name"
  subtitle="Created 2 days ago"
  status="active"
  action="View Results"
  action-icon="fas fa-chart-bar"
  clickable>
</webropol-card-list-item>
```

#### Card Actions (`webropol-card-actions`)
Footer section for action buttons.

```html
<webropol-card-actions alignment="right">
  <webropol-button variant="secondary" size="sm">Cancel</webropol-button>
  <webropol-button variant="primary" size="sm">Save</webropol-button>
</webropol-card-actions>
```

#### Gradient Card (`webropol-gradient-card`)
Special homepage-style cards with gradients and centered content.

```html
<webropol-gradient-card 
  icon="fa-solid fa-poll-h"
  title="Gain insight with surveys"
  button-text="Create survey"
  gradient="from-webropol-blue-100 to-webropol-teal-100/80">
</webropol-gradient-card>
```

## Design Guidelines

### Colors
- **Primary Colors**: Webropol teal (#06b6d4) and blue (#3b82f6)
- **Secondary Colors**: Gray scale for text and borders
- **Status Colors**: Green (success), Yellow (warning), Red (danger)

### Typography
- **Font Family**: Inter (system fallback: system-ui, sans-serif)
- **Font Weights**: 300, 400, 500, 600, 700
- **Text Colors**: Consistent gray scale with proper contrast ratios

### Spacing
- **Consistent Padding**: 6px, 12px, 16px, 24px, 32px
- **Gap Spacing**: 12px, 16px, 24px
- **Border Radius**: 12px (cards), 24px (buttons and badges)

### Shadows
- **Card Shadow**: Subtle shadow for depth
- **Medium Shadow**: Enhanced shadow for elevated elements
- **Soft Shadow**: Light shadow for background elements

### Accessibility
- **Contrast Ratios**: WCAG AA compliant (4.5:1 minimum)
- **Focus Indicators**: Clear, visible focus rings
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Touch Targets**: Minimum 44px for interactive elements

## Implementation Notes

### Browser Support
- Modern browsers supporting ES6+ and CSS Custom Properties
- Graceful degradation for older browsers

### Performance
- Components use efficient event delegation
- Minimal DOM manipulation
- CSS-based animations for smooth performance

### Customization
- Components inherit from Tailwind CSS configuration
- Color variables can be customized via CSS custom properties
- Sizes and spacing follow the design system scale

## Examples

See `components-demo.html` for comprehensive examples of all component variations and usage patterns.

## Integration

1. Include the component scripts in your HTML:
```html
<script src="components/buttons.js" type="module"></script>
<script src="components/cards.js" type="module"></script>
```

2. Use the components in your HTML markup with the provided attributes.

3. Style customizations should be done via CSS custom properties or Tailwind configuration.

## Event Handling

Components dispatch custom events that bubble up:
- `button-click`: Fired when buttons are clicked
- `card-click`: Fired when hoverable cards are clicked
- `list-item-click`: Fired when clickable list items are clicked

```javascript
document.addEventListener('button-click', function(e) {
  console.log('Button clicked:', e.target);
});
```

## Migration Guide

When migrating existing UI to use these components:

1. Replace existing button HTML with `<webropol-button>` components
2. Convert card structures to use the new card component hierarchy
3. Update event handlers to listen for the new custom events
4. Verify styling matches the design system guidelines
5. Test accessibility features with screen readers and keyboard navigation

## Future Enhancements

- Loading states for buttons
- More card layout variations
- Animation and transition utilities
- Form integration components
- Data visualization card types
