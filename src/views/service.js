import {renderSection} from '../renderers/sectionRenderers.js'
import {formatBulletinDate} from '../utils/formatDate.js'
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
  if (!bulletins.length) {
    container.innerHTML = `
      <div class="page">

        <h1>
          Service
        </h1>

        <p>
          No upcoming bulletin has been published.
        </p>

      </div>
    `

    return
  }

  const bulletin = bulletins[selectedBulletinIndex]

  const sections = bulletin.sections || []

  const section = sections[currentSectionIndex]

  container.innerHTML = `
    <div class="service-page">

      <div class="service-top">

        <header class="page-header">

          <h1>
            Service
          </h1>

          <p>
            ${formatBulletinDate(bulletin.date)} · 1:00 PM
          </p>

        </header>


        <div class="week-toggle">

          <button
            id="this-week"
            class="${selectedBulletinIndex === 0 ? 'active' : ''}"
          >
            This week · Tu zarh
          </button>


          <button
            id="next-week"
            class="${selectedBulletinIndex === 1 ? 'active' : ''}"
            ${bulletins.length < 2 ? 'disabled' : ''}
          >
            Next week · Hmaizarh
          </button>

        </div>

      </div>


      ${
        section
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
                ${currentSectionIndex === 0 ? 'disabled' : ''}
              >
                ‹ Back
              </button>


              <div class="service-progress">

                <strong>
                  ${currentSectionIndex + 1} of ${sections.length}
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

  document
    .querySelector('#this-week')
    ?.addEventListener('click', () => {
      onSelectBulletin(0)
    })

  document
    .querySelector('#next-week')
    ?.addEventListener('click', () => {
      if (bulletins.length >= 2) {
        onSelectBulletin(1)
      }
    })

  document
    .querySelector('#previous-section')
    ?.addEventListener('click', onPreviousSection)

  document
    .querySelector('#next-section')
    ?.addEventListener('click', onNextSection)
}