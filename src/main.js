import './style.css'

import {getUpcomingBulletins} from './sanity.js'

import {
  renderBottomNav,
  bindBottomNav,
} from './components/bottomNav.js'

import {renderHome} from './views/home.js'
import {renderService} from './views/service.js'
import {renderEvents} from './views/events.js'
import {renderContact} from './views/contact.js'

import {getLocalDateString} from './utils/formatDate.js'


const app = document.querySelector('#app')


const state = {
  bulletins: [],
  currentTab: 'home',
  selectedBulletinIndex: 0,
  currentSectionIndex: 0,
}


// --------------------------------------------------
// LOAD DATA
// --------------------------------------------------

async function startApp() {
  try {
    const today = getLocalDateString()

    state.bulletins = await getUpcomingBulletins(today)

    renderApp()
  } catch (error) {
    console.error('Failed to start app:', error)

    app.innerHTML = `
      <div class="error-message">
        Unable to load the bulletin.
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
  const container = document.querySelector('#page-content')

  switch (state.currentTab) {

    case 'home':
      renderHome(
        container,
        state.bulletins,
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
}


// --------------------------------------------------
// BULLETIN WEEK
// --------------------------------------------------

function handleSelectBulletin(index) {
  state.selectedBulletinIndex = index

  state.currentSectionIndex = 0

  renderApp()
}


// --------------------------------------------------
// BULLETIN SECTIONS
// --------------------------------------------------

function handlePreviousSection() {
  if (state.currentSectionIndex > 0) {
    state.currentSectionIndex--

    renderApp()
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
  }
}


// --------------------------------------------------
// START
// --------------------------------------------------

startApp()