import './style.css'

import {getUpcomingBulletins, getChurchSettings} from './sanity.js'

import {
  renderBottomNav,
  bindBottomNav,
} from './components/bottomNav.js'

import {renderHome} from './views/home.js'
import {renderService} from './views/service.js'
import {renderEvents} from './views/events.js'
import {renderContact} from './views/contact.js'

const app = document.querySelector('#app')

// --------------------------------------------------
// APPLICATION STATE
// --------------------------------------------------

const state = {
  bulletins: [],
  churchSettings: null,
  currentTab: 'home',
  selectedBulletinIndex: 0,
  currentSectionIndex: 0,
}

// --------------------------------------------------
// LOAD DATA
// --------------------------------------------------


async function startApp() {
  try {
    // Retrieve bulletins and Church Settings
    // from Sanity at the same time.
    const [bulletins, churchSettings] = await Promise.all([
      getUpcomingBulletins(),
      getChurchSettings(),
    ])

    state.bulletins = bulletins
    state.churchSettings = churchSettings

    renderApp()
  } catch (error) {
    console.error('Failed to start app:', error)

    app.innerHTML = `
      <div class="error-message">
        Unable to load the church website.
      </div>
    `
  }
}


// --------------------------------------------------
// MAIN RENDER
// --------------------------------------------------

function renderApp() {
  app.innerHTML = `
    <div class="app-shell">

      <main
        id="page-content"
        class="page-content"
      ></main>

      ${renderBottomNav(state.currentTab)}

    </div>
  `

  bindBottomNav(handleNavigate)

  renderCurrentPage()
}

// --------------------------------------------------
// PAGE ROUTING
// --------------------------------------------------

function renderCurrentPage() {
  const container =
    document.querySelector('#page-content')

  switch (state.currentTab) {
    case 'home':
      renderHome(
        container,
        state.bulletins,
        state.churchSettings,
        handleViewBulletin,
      )
      break

    case 'service':
      renderService(container, {
        bulletins: state.bulletins,
        selectedBulletinIndex:
          state.selectedBulletinIndex,
        currentSectionIndex:
          state.currentSectionIndex,

        onSelectBulletin:
          handleSelectBulletin,

        onPreviousSection:
          handlePreviousSection,

        onNextSection:
          handleNextSection,
      })
      break

    case 'events':
      renderEvents(container)
      break

    case 'contact':
      renderContact(container)
      break
  }
}

// --------------------------------------------------
// NAVIGATION
// --------------------------------------------------

function handleNavigate(tab) {
  state.currentTab = tab

  renderApp()
}

function handleViewBulletin() {
  state.currentTab = 'service'
  state.selectedBulletinIndex = 0
  state.currentSectionIndex = 0

  renderApp()
  window.scrollTo(0, 0)
}

// --------------------------------------------------
// BULLETIN WEEK NAVIGATION
// --------------------------------------------------

function handleSelectBulletin(index) {
  // Only the two supported week positions
  // can be selected.
  if (index !== 0 && index !== 1) {
    return
  }

  state.selectedBulletinIndex = index

  // Start from the first section when
  // switching between bulletins.
  state.currentSectionIndex = 0

  renderApp()
  window.scrollTo(0, 0)
}

// --------------------------------------------------
// BULLETIN SECTION NAVIGATION
// --------------------------------------------------

function handlePreviousSection() {
  if (state.currentSectionIndex > 0) {
    state.currentSectionIndex--

    renderApp()
    window.scrollTo(0, 0)
  }
}



function handleNextSection() {
  const bulletin =
    state.bulletins[state.selectedBulletinIndex]

  const numberOfSections =
    bulletin?.sections?.length ?? 0

  if (
    state.currentSectionIndex <
    numberOfSections - 1
  ) {
    state.currentSectionIndex++

    renderApp()
    window.scrollTo(0, 0)  //everytime you switch to the next section, it will scroll to the top of the page so that the user can see the title of the section and not have to scroll up to see it.
  }
}

// --------------------------------------------------
// START
// --------------------------------------------------

startApp()
