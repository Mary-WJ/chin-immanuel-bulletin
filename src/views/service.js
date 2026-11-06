import {renderSection} from '../renderers/sectionRenderers.js'
import {formatBulletinDate} from '../utils/formatDate.js'
import {getSundayDates} from '../utils/getSundayDates.js'
import {escapeHtml} from '../utils/escapeHtml.js'

export function renderService(
  container,
  {
    bulletins,
    selectedBulletinIndex,
    currentSectionIndex,
    onSelectBulletin,
    onPreviousSection,
    onNextSection,
  },
) {
  // --------------------------------------------------
  // SELECT THE CORRECT WEEK
  // --------------------------------------------------

  const {thisSunday, nextSunday} = getSundayDates()

  const selectedDate =
    selectedBulletinIndex === 0
      ? thisSunday
      : nextSunday

  const bulletin =
    bulletins[selectedBulletinIndex] ?? null

  const sections = bulletin?.sections ?? []

  const section = sections[currentSectionIndex]

  // --------------------------------------------------
  // RENDER SERVICE PAGE
  // --------------------------------------------------

  container.innerHTML = `
    <div class="service-page">

      <div class="service-top">

        <header class="page-header">

          <h1>
            Service
          </h1>

          <p>
            ${formatBulletinDate(selectedDate)} · 1:00 PM
          </p>

        </header>

        <div class="week-toggle">

          <button
            id="this-week"
            class="${
              selectedBulletinIndex === 0
                ? 'active'
                : ''
            }"
          >
            This week · Tu zarh
          </button>

          <button
            id="next-week"
            class="${
              selectedBulletinIndex === 1
                ? 'active'
                : ''
            }"
          >
            Next week · Hmaizarh
          </button>

        </div>

      </div>

      ${
        !bulletin
          ? `
            <div class="empty-message">

              <p>
                ${
                  selectedBulletinIndex === 0
                    ? "This Sunday's bulletin has not been published yet."
                    : "Next Sunday's bulletin has not been published yet."
                }
              </p>

            </div>
          `
          : section
            ? `
              <section class="bulletin-section">

                <div class="section-heading">

                  <h2>
                    ${escapeHtml(section.title)}
                  </h2>

                </div>

                <div class="section-content">

                  ${renderSection(section)}

                </div>

              </section>

              <div class="service-navigation">

                <button
                  id="previous-section"
                  class="service-nav-button service-back"
                  ${
                    currentSectionIndex === 0
                      ? 'disabled'
                      : ''
                  }
                >
                  ‹ Back
                </button>

                <div class="service-progress">

                  <strong>
                    ${currentSectionIndex + 1}
                    of
                    ${sections.length}
                  </strong>

                  <span>
                    ${escapeHtml(section.title)}
                  </span>

                </div>

                <button
                  id="next-section"
                  class="service-nav-button service-next"
                  ${
                    currentSectionIndex === sections.length - 1
                      ? 'disabled'
                      : ''
                  }
                >
                  Next ›
                </button>

              </div>
            `
            : `
              <div class="empty-message">
                This bulletin has no sections.
              </div>
            `
      }

    </div>
  `

  // --------------------------------------------------
  // WEEK NAVIGATION
  // --------------------------------------------------

  container
    .querySelector('#this-week')
    ?.addEventListener('click', () => {
      onSelectBulletin(0)
    })

  container
    .querySelector('#next-week')
    ?.addEventListener('click', () => {
      onSelectBulletin(1)
    })

  // --------------------------------------------------
  // SECTION NAVIGATION
  // --------------------------------------------------

  container
    .querySelector('#previous-section')
    ?.addEventListener('click', onPreviousSection)

  container
    .querySelector('#next-section')
    ?.addEventListener('click', onNextSection)
}
