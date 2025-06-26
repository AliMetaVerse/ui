# Webropol Application Pages

This folder contains all the pages for the Webropol application, organized by feature and functionality.

## 📁 Folder Structure

```
webropol/
├── components/           # Reusable UI components
│   ├── sidebar.js       # Main navigation sidebar
│   ├── header.js        # Top navigation header
│   └── breadcrumbs.js   # Breadcrumb navigation
├── admin-tools/         # Admin and configuration pages
├── dashboards/          # Analytics and reporting dashboards
├── events/              # Event management pages
├── mywebropol/          # MyWebropol library and templates
├── shop/                # Marketplace and shop pages
├── sms/                 # SMS survey functionality
├── surveys/             # Survey creation and management
├── training-videos/     # Training and help content
├── index.html           # Application home page
├── page-template.html   # Template for new pages
├── SIDEBAR-HEADER-GUIDE.md  # Integration guide
└── validate-pages.js    # Validation script
```

## 🚀 Quick Start for New Pages

1. **Copy the template**: Use `page-template.html` as your starting point
2. **Update configuration**: Set active state, paths, and breadcrumbs
3. **Add your content**: Replace placeholder content with your page
4. **Test navigation**: Ensure all links work correctly

## 🧩 Standard Components

All pages include these standard components:

### Sidebar Navigation (`<webropol-sidebar>`)
- Main navigation menu
- Active state highlighting
- Responsive design
- Proper path resolution

### Header Component (`<webropol-header>`)
- User profile section
- Notification center
- Help access
- Consistent branding

### Breadcrumb Navigation (`<webropol-breadcrumbs>`)
- Hierarchical navigation
- Current page context
- Easy backtracking

## 📋 Current Page Status

✅ **All existing pages are properly configured!**

The following pages have sidebar and header components integrated:

- **Home**: `/index.html`
- **Admin Tools**: `/admin-tools/index.html`
- **Dashboards**: `/dashboards/index.html`
- **Events**: `/events/index.html`, `/events/events.html`
- **MyWebropol**: `/mywebropol/index.html`, `/mywebropol/library.html`
- **Shop**: `/shop/index.html`
- **SMS**: `/sms/index.html`
- **Surveys**: `/surveys/index.html`
- **Training**: `/training-videos/index.html`

## 🛠️ Development Guidelines

### For New Pages

1. **Use the template**: Always start with `page-template.html`
2. **Follow the guide**: Reference `SIDEBAR-HEADER-GUIDE.md` for detailed instructions
3. **Validate your work**: Run `node validate-pages.js` to check implementation
4. **Test thoroughly**: Verify navigation works from all locations

### Path Management

Update these attributes based on your page location:

- **Script imports**: `../components/` or `../../components/`
- **Sidebar base**: `../` or `../../` or empty for root
- **Breadcrumb URLs**: Relative paths to parent pages

### Active States

Set the sidebar `active` attribute to match your page section:

- `home` - Dashboard/main pages
- `surveys` - Survey functionality
- `events` - Event management
- `sms` - SMS surveys
- `dashboards` - Analytics/reporting
- `mywebropol` - Templates/library
- `admin-tools` - Settings/admin
- `training-videos` - Help/training
- `shop` - Marketplace

## 🔍 Validation

Run the validation script to check page compliance:

```bash
node validate-pages.js
```

This will verify:
- ✅ Sidebar component usage
- ✅ Header component usage
- ✅ Breadcrumb navigation
- ✅ Required script imports
- ✅ Proper HTML structure

## 🎨 Design System

All pages use the Webropol design system with:

- **Colors**: Teal, blue, and gray color palettes
- **Typography**: Inter font family
- **Components**: Consistent UI elements
- **Layout**: Responsive grid system
- **Icons**: Font Awesome icon library

## 📚 Resources

- `page-template.html` - New page template
- `SIDEBAR-HEADER-GUIDE.md` - Detailed integration guide
- `validate-pages.js` - Page validation script
- `/components/` - Component implementations

---

*For questions or issues, refer to the guide or contact the development team.*
