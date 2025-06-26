class WebropolBreadcrumbs extends HTMLElement {
  static get observedAttributes() { return ['trail']; }

  attributeChangedCallback() { this.render(); }
  connectedCallback() { this.render(); }

  render() {
    let trail = [];
    try {
      trail = JSON.parse(this.getAttribute('trail')) || [];
    } catch {
      // fallback: allow comma-separated string: Home,/index.html,Surveys,/surveys.html
      const str = this.getAttribute('trail') || '';
      if (str.includes(',')) {
        const arr = str.split(',');
        for (let i = 0; i < arr.length; i += 2) {
          trail.push({ label: arr[i], url: arr[i + 1] || null });
        }
      }
    }
    if (!trail.length) {
      this.style.display = 'none';
      return (this.innerHTML = '');
    }
    this.style.display = '';
    this.innerHTML = `
      <nav class="flex items-center text-sm text-webropol-gray-500 py-4 px-4 sm:px-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          ${trail
            .map((item, i) =>
              i < trail.length - 1
                ? `<li><a href="${item.url}" class="hover:text-webropol-teal-600 font-medium">${item.label}</a><span class="mx-2">/</span></li>`
                : `<li class="text-webropol-gray-900 font-semibold">${item.label}</li>`
            )
            .join('')}
        </ol>
      </nav>
    `;
  }
}
customElements.define('webropol-breadcrumbs', WebropolBreadcrumbs);
