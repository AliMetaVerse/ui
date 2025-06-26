# Webropol Floating Button Component

A reusable, configurable floating action button component for the Webropol application.

## Features

- ✅ **Reusable Component**: Web Components API implementation
- ✅ **Configurable**: Position, theme, and menu items
- ✅ **Interactive**: Alpine.js powered animations and interactions
- ✅ **Responsive**: Works on all screen sizes
- ✅ **Customizable**: Easy to customize menu items and styling
- ✅ **Event System**: Custom events for handling user interactions

## Basic Usage

### 1. Include the Component

```html
<script src="components/floating-button.js" type="module"></script>
```

### 2. Add to Your Page

```html
<webropol-floating-button></webropol-floating-button>
```

## Configuration Options

### Position

Control where the button appears on the screen:

```html
<!-- Bottom center (default) -->
<webropol-floating-button position="bottom-center"></webropol-floating-button>

<!-- Bottom right -->
<webropol-floating-button position="bottom-right"></webropol-floating-button>

<!-- Bottom left -->
<webropol-floating-button position="bottom-left"></webropol-floating-button>
```

### Theme

Choose the color scheme:

```html
<!-- Teal-Blue gradient (default) -->
<webropol-floating-button theme="teal-blue"></webropol-floating-button>

<!-- Blue theme -->
<webropol-floating-button theme="blue"></webropol-floating-button>
```

### Custom Menu Items

Define what appears in the dropdown menu:

```html
<webropol-floating-button 
    items='[
        {
            "id": "surveys",
            "label": "Survey",
            "description": "Create custom surveys",
            "icon": "fas fa-poll-h",
            "url": "../surveys/create.html"
        },
        {
            "id": "sms",
            "label": "SMS Campaign", 
            "description": "SMS messaging",
            "icon": "fas fa-sms",
            "url": "../sms/create.html"
        }
    ]'>
</webropol-floating-button>
```

## Menu Item Properties

Each menu item can have the following properties:

- **`id`** (required): Unique identifier for the item
- **`label`** (required): Display text for the menu item
- **`description`** (required): Subtitle text shown below the label
- **`icon`** (required): FontAwesome icon class (e.g., "fas fa-poll-h")
- **`url`** (optional): URL to navigate to when clicked. Use "#" for custom handling

## Custom Event Handling

Listen for custom events to handle menu item clicks:

```html
<script>
document.addEventListener('webropol:create-item', function(event) {
    console.log('User wants to create:', event.detail.itemId);
    
    // Custom handling based on item ID
    switch(event.detail.itemId) {
        case 'custom-action':
            // Handle custom action
            break;
        default:
            // Default behavior
            break;
    }
});
</script>
```

## Page-Specific Examples

### For Surveys Section

```html
<webropol-floating-button 
    position="bottom-center"
    theme="teal-blue"
    items='[
        {
            "id": "survey",
            "label": "New Survey",
            "description": "Create a survey from scratch",
            "icon": "fas fa-poll-h",
            "url": "create.html"
        },
        {
            "id": "template",
            "label": "From Template",
            "description": "Use existing template",
            "icon": "fas fa-clone",
            "url": "templates.html"
        },
        {
            "id": "import",
            "label": "Import Survey",
            "description": "Import from file",
            "icon": "fas fa-upload",
            "url": "#"
        }
    ]'>
</webropol-floating-button>
```

### For SMS Section

```html
<webropol-floating-button 
    items='[
        {
            "id": "sms-campaign",
            "label": "SMS Campaign",
            "description": "Create new SMS survey",
            "icon": "fas fa-sms",
            "url": "create-campaign.html"
        },
        {
            "id": "contact-list",
            "label": "Contact List",
            "description": "Manage recipients",
            "icon": "fas fa-address-book",
            "url": "contacts.html"
        }
    ]'>
</webropol-floating-button>
```

## Styling and Customization

The component uses Webropol's design system colors and follows the established visual patterns. The styling is automatically applied and responsive.

### Default Colors

- **Teal-Blue Theme**: Gradient from `webropol-teal-500` to `webropol-blue-600`
- **Blue Theme**: Solid `webropol-blue-500` background
- **Hover Effects**: Automatic scaling and shadow animations

## Dependencies

- **Alpine.js**: Required for interactive functionality
- **FontAwesome**: Required for icons
- **Tailwind CSS**: Required for styling (with Webropol color scheme)

## Browser Support

The component uses Web Components API and is supported in all modern browsers. For older browsers, you may need polyfills.

---

## Integration Checklist

- [ ] Include `floating-button.js` script
- [ ] Ensure Alpine.js is loaded
- [ ] Ensure FontAwesome is available
- [ ] Configure menu items for your page context
- [ ] Set appropriate position and theme
- [ ] Test on different screen sizes
