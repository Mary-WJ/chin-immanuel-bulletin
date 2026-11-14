import './style.css'
import './pwa.js'

import {loadWithSavedCopy} from './utils/offlineCache.js'
import {getSundayDates} from './utils/getSundayDates.js'


import {getUpcomingBulletins, getChurchSettings, getUpcomingEvents} from './sanity.js'

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
  events: [],
  eventsError: false,
  contentNotice: '',
  bulletinDocuments: [],
  bulletinsSource: 'missing',
}

// --------------------------------------------------
// LOAD DATA
// --------------------------------------------------

async function startApp() {
  app.innerHTML = `
    <p class="content-notice" role="status">
      Loading church content…
    </p>
  `

  const [bulletinsResult, settingsResult, eventsResult] =
    await Promise.all([
      loadWithSavedCopy(
        'bulletins',
        getUpcomingBulletins,
        (data) =>
          Array.isArray(data) &&
          data.every(
            (item) =>
              item === null ||
              (
                typeof item === 'object' &&
                typeof item.date === 'string'
              ),
          ),
      ),

      loadWithSavedCopy(
        'settings',
        getChurchSettings,
        (data) =>
          data === null ||
          (
            typeof data === 'object' &&
            !Array.isArray(data)
          ),
      ),

      loadWithSavedCopy(
        'events',
        getUpcomingEvents,
        (data) =>
          Array.isArray(data) &&
          data.every(
            (item) =>
              item &&
              typeof item === 'object' &&
              typeof item.date === 'string',
          ),
      ),
    ])

  state.bulletinDocuments =
    (bulletinsResult.data ?? []).filter(Boolean)
  
  state.bulletinsSource = bulletinsResult.source;

  state.churchSettings = settingsResult.data;

  state.events = eventsResult.data ?? []
  state.eventsError = eventsResult.source === 'missing'

  const results = [
    bulletinsResult,
    settingsResult,
    eventsResult,
  ]

  const messages = []

  if (results.some((result) => result.source === 'saved')) {
    messages.push(
      'Showing saved content. It may not include the latest changes.',
    )
  }

  if (results.some((result) => result.source === 'missing')) {
    messages.push(
      'Some content is unavailable. Connect to the internet and reload to download it.',
    )
  }

  if (results.some((result) => result.storageFailed)) {
    messages.push(
      'Content loaded, but could not be saved on this device for offline use.',
    )
  }

  state.contentNotice = messages.join(' ')

  renderApp()
}


// --------------------------------------------------
// MAIN RENDER
// --------------------------------------------------

function renderApp() {
  // Match saved or live bulletins to the correct Sundays.
  const {thisSunday, nextSunday} = getSundayDates()

  state.bulletins = [thisSunday, nextSunday].map(
    (date) =>
      state.bulletinDocuments.find(
        (bulletin) => bulletin.date === date,
      ) ?? null,
  )

  // Keep the section index within the selected bulletin.
  const sections =
    state.bulletins[state.selectedBulletinIndex]?.sections ?? []

  state.currentSectionIndex = Math.min(
    state.currentSectionIndex,
    Math.max(0, sections.length - 1),
  )

  // Hide past events, including when using saved content.
  const parts = new Intl.DateTimeFormat('en-NZ', {
    timeZone: 'Pacific/Auckland',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const part = (type) =>
    parts.find((item) => item.type === type).value

  const today =
    `${part('year')}-${part('month')}-${part('day')}`

  state.events = state.events.filter(
    (event) => event.date >= today,
  )

  // Create the page before trying to add anything to it.
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

  // Add the notice after the current page has rendered.
  if (state.contentNotice) {
    const notice = document.createElement('p')
    notice.className = 'content-notice'
    notice.setAttribute('role', 'status')
    notice.textContent = state.contentNotice

    const reloadButton = document.createElement('button')
    reloadButton.type = 'button'
    reloadButton.textContent = 'Reload'

    reloadButton.addEventListener('click', () => {
      window.location.reload()
    })

    notice.append(' ', reloadButton)

    document.querySelector('#page-content').prepend(notice)
  }
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
        bulletinsSource: state.bulletinsSource,

        onSelectBulletin:
          handleSelectBulletin,

        onPreviousSection:
          handlePreviousSection,

        onNextSection:
          handleNextSection,
      })
      break

    case 'events':
      renderEvents(
        container,
        state.events,
        state.eventsError,
      )
      break

    case 'contact':
      renderContact(container, state.churchSettings)
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
