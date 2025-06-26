# Webropol Sidebar and Header Integration Guide

This guide explains how to properly integrate the Webropol sidebar, header, and floating button components into new pages in the webropol folder.

## Overview

All pages in the Webropol application should use a consistent layout with:
- **Sidebar navigation** (`<webropol-sidebar>`)
- **Header component** (`<webropol-header>`) 
- **Breadcrumbs navigation** (`<webropol-breadcrumbs>`)
- **Floating Create Button** (`<webropol-floating-button>`) - NEW!

## Quick Start

1. **Copy the template**: Use `page-template.html` as your starting point for new pages
2. **Update file paths**: Adjust script imports based on your page location
3. **Configure components**: Set the active state, base paths, and breadcrumbs
4. **Add floating button**: Include the floating button component for quick actions
5. **Add your content**: Replace the placeholder content with your page-specific content

## Detailed Configuration

### 1. Script Imports

Include these script imports in your `<head>` section. **Update paths based on your page location:**

```html
<!-- For root level pages (e.g., /webropol/index.html) -->
<script src="components/sidebar.js" type="module"></script>
<script src="components/header.js" type="module"></script>
<script src="components/breadcrumbs.js" type="module"></script>
<script src="components/floating-button.js" type="module"></script>

<!-- For one level deep (e.g., /webropol/surveys/index.html) -->
<script src="../components/sidebar.js" type="module"></script>
<script src="../components/header.js" type="module"></script>
<script src="../components/breadcrumbs.js" type="module"></script>
<script src="../components/floating-button.js" type="module"></script>

<!-- For two levels deep (e.g., /webropol/surveys/create/index.html) -->
<script src="../../components/sidebar.js" type="module"></script>
<script src="../../components/header.js" type="module"></script>
<script src="../../components/breadcrumbs.js" type="module"></script>
<script src="../../components/floating-button.js" type="module"></script>
```

### 2. Basic HTML Structure

Use this basic structure for all pages:

```html
<body class="bg-gradient-to-br from-webropol-blue-50 to-webropol-teal-50/30" style="background-color: #ebf4f7;">
    <div class="flex h-screen">
        <webropol-sidebar active="[SECTION]" base="[BASE_PATH]"></webropol-sidebar>
        <div class="flex-1 flex flex-col overflow-hidden">
            <webropol-header username="[USERNAME]"></webropol-header>
            <div class="bg-white/70 backdrop-blur px-0 sm:px-4">
                <webropol-breadcrumbs trail='[BREADCRUMB_TRAIL]'></webropol-breadcrumbs>
            </div>
            <main class="flex-1 overflow-y-auto px-6 py-12 lg:px-12" role="main">
                <!-- Your page content goes here -->
            </main>
        </div>
    </div>

    <!-- Floating Create Button Component -->
    <webropol-floating-button 
        position="bottom-center"
        theme="teal-blue"
        items='[...]'>
    </webropol-floating-button>
</body>
```

### 3. Sidebar Configuration

#### Active States
Set the `active` attribute to highlight the current section:

- `active="home"` - For main dashboard/home pages
- `active="surveys"` - For survey-related pages
- `active="events"` - For event management pages
- `active="sms"` - For SMS survey pages
- `active="dashboards"` - For dashboard/reporting pages
- `active="mywebropol"` - For MyWebropol library pages
- `active="admin-tools"` - For admin/settings pages
- `active="training-videos"` - For training content pages
- `active="shop"` - For shop/marketplace pages

#### Base Paths
Set the `base` attribute for correct navigation:

```html
<!-- Root level: /webropol/ -->
<webropol-sidebar active="home" base=""></webropol-sidebar>

<!-- One level deep: /webropol/surveys/ -->
<webropol-sidebar active="surveys" base="../"></webropol-sidebar>

<!-- Two levels deep: /webropol/surveys/create/ -->
<webropol-sidebar active="surveys" base="../../"></webropol-sidebar>
```

### 4. Breadcrumbs Configuration

Update the `trail` attribute with proper navigation hierarchy:

```html
<!-- Root page -->
<webropol-breadcrumbs trail='[{"label":"Home","url":"index.html"}]'></webropol-breadcrumbs>

<!-- Section page -->
<webropol-breadcrumbs trail='[{"label":"Home","url":"../index.html"},{"label":"Surveys","url":"index.html"}]'></webropol-breadcrumbs>

<!-- Deep page -->
<webropol-breadcrumbs trail='[{"label":"Home","url":"../../index.html"},{"label":"Surveys","url":"../index.html"},{"label":"Create Survey","url":"index.html"}]'></webropol-breadcrumbs>
```

### 5. Floating Create Button Configuration

The floating button component provides quick access to create new items. Add it before the closing `</body>` tag:

```html
<webropol-floating-button 
    position="bottom-center"
    theme="teal-blue"
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
        },
        {
            "id": "events",
            "label": "Event",
            "description": "Event management", 
            "icon": "fas fa-calendar-alt",
            "url": "../events/create.html"
        },
        {
            "id": "dashboards",
            "label": "Dashboard",
            "description": "Data visualization",
            "icon": "fas fa-chart-line", 
            "url": "../dashboards/create.html"
        }
    ]'>
</webropol-floating-button>
```

#### Floating Button Attributes:

- **`position`**: `"bottom-center"`, `"bottom-right"`, or `"bottom-left"`
- **`theme`**: `"teal-blue"` or `"blue"`
- **`items`**: JSON array of menu items with id, label, description, icon, and url

#### Customizing Menu Items:

Update the `items` array to include only relevant options for your page context. For example, on the SMS page, you might want SMS-specific items:

```html
<webropol-floating-button 
    items='[
        {
            "id": "sms-campaign",
            "label": "SMS Campaign",
            "description": "Create new SMS survey",
            "icon": "fas fa-sms",
            "url": "../sms/create.html"
        },
        {
            "id": "contact-list",
            "label": "Contact List",
            "description": "Manage recipients",
            "icon": "fas fa-address-book",
            "url": "../sms/contacts.html"
        }
    ]'>
</webropol-floating-button>
```

## Required Dependencies

Make sure to include these dependencies in your `<head>`:

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Font Awesome icons -->
<script src="https://kit.fontawesome.com/50ef2d3cf8.js" crossorigin="anonymous"></script>

<!-- Alpine.js (if using interactive components) -->
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

<!-- Inter font -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

## Tailwind Configuration

Include the Webropol color scheme and theme configuration:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'webropol-teal': { 50: '#f0fdff', 100: '#ccf7fe', 200: '#99effd', 300: '#66e0fa', 400: '#22ccf1', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63' },
                'webropol-gray': { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a' },
                'webropol-blue': { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            }
        }
    }
}
```

## Status Check

✅ **All existing pages in the webropol folder already have the sidebar and header components properly integrated!**

The following pages are correctly configured:
- `/webropol/index.html` - Home page
- `/webropol/admin-tools/index.html` - Admin tools
- `/webropol/dashboards/index.html` - Dashboards
- `/webropol/events/index.html` - Events listing
- `/webropol/events/events.html` - Events page
- `/webropol/mywebropol/index.html` - MyWebropol main
- `/webropol/mywebropol/library.html` - MyWebropol library
- `/webropol/shop/index.html` - Shop
- `/webropol/sms/index.html` - SMS surveys
- `/webropol/surveys/index.html` - Surveys
- `/webropol/training-videos/index.html` - Training videos

## Next Steps

1. **For new pages**: Use the `page-template.html` as your starting point
2. **Review existing pages**: Ensure all paths and configurations are correct
3. **Test navigation**: Verify that all sidebar links work correctly from each page location
4. **Update breadcrumbs**: Make sure breadcrumb trails accurately reflect the page hierarchy

---

*This guide ensures consistent navigation and user experience across all Webropol application pages.*
