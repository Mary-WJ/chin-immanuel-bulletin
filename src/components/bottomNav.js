// style thats the bottom navigation bar and its buttons

const icons = {
  home: `
    <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1Z"/>
  `,
  service: `
    <path d="M12 5v16"/>
    <path d="M12 5C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z"/>
  `,
  events: `
    <rect x="3" y="5" width="18" height="16" rx="2"/>
    <path d="M16 3v4M8 3v4M3 11h18"/>
    <path d="M8 15h2M14 15h2"/>
  `,
  contact: `
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2
      19.8 19.8 0 0 1-8.6-3.1
      19.5 19.5 0 0 1-6-6
      19.8 19.8 0 0 1-3.1-8.7
      A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7
      c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9
      a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5
      c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z"/>
  `,
}

export function renderBottomNav(currentTab) {
  return `
    <nav class="bottom-nav" aria-label="Main navigation">
      ${navButton('home', 'Home', currentTab)}
      ${navButton('service', 'Service', currentTab)}
      ${navButton('events', 'Events', currentTab)}
      ${navButton('contact', 'Contact', currentTab)}
    </nav>
  `
}

function navButton(tab, label, currentTab) {
  const isActive = currentTab === tab

  return `
    <button
      type="button"
      class="nav-button ${isActive ? 'active' : ''}"
      data-tab="${tab}"
      ${isActive ? 'aria-current="page"' : ''}
    >
      <span class="nav-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          focusable="false"
        >
          ${icons[tab]}
        </svg>
      </span>

      <span>${label}</span>
    </button>
  `
}

export function bindBottomNav(onNavigate) {
  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      onNavigate(button.dataset.tab)
    })
  })
}
