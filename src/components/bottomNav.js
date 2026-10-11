export function renderBottomNav(currentTab) {
  return `
    <nav class="bottom-nav">

      ${navButton('home', '⌂', 'Home', currentTab)}

      ${navButton('service', '▤', 'Service', currentTab)}

      ${navButton('events', '▣', 'Events', currentTab)}

      ${navButton('contact', '☎', 'Contact', currentTab)}

    </nav>
  `
}

function navButton(tab, icon, label, currentTab) {
  return `
    <button
      class="nav-button ${currentTab === tab ? 'active' : ''}"
      data-tab="${tab}"
    >
      <span class="nav-icon">
        ${icon}
      </span>

      <span>
        ${label}
      </span>
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