
import churchLogo from '../assets/church-logo.png'

import {formatToday} from '../utils/formatDate.js'
import {escapeHtml} from '../utils/escapeHtml.js'

// --------------------------------------------------
// HOME PAGE
// --------------------------------------------------

export function renderHome(
  container,
  bulletins,
  churchSettings,
  onViewBulletin,
) {
  const quote = churchSettings?.quoteText?.trim()
  const year = churchSettings?.quoteYear
  const reference = churchSettings?.quoteReference?.trim()

  container.innerHTML = `
    <div class="page home-page">

      <!-- CHURCH LOGO -->
      <div class="church-logo">
        <img
          src="${churchLogo}"
          alt="Chin Immanuel Church logo"
        >
      </div>

      <!-- CHURCH NAME -->
      <h1>
        Chin Immanuel Church
      </h1>

      <p class="church-location">
        NELSON · NEW ZEALAND
      </p>

      <!-- TODAY -->
      <div class="home-card today-card">

        <span class="eyebrow">
          TODAY
        </span>

        <strong>
          ${formatToday()}
        </strong>

      </div>

      <!-- QUOTE OF THE YEAR -->
      <div class="home-card quote-card">

        <span class="eyebrow">
          QUOTE OF THE YEAR
          ${year ? `· ${escapeHtml(String(year))}` : ''}
        </span>

        ${
          quote
            ? `
              <blockquote class="quote-text">
                ${escapeHtml(quote)}
              </blockquote>

              ${
                reference
                  ? `
                    <p class="quote-reference">
                      ${escapeHtml(reference)}
                    </p>
                  `
                  : ''
              }
            `
            : `
              <p class="quote-placeholder">
                The Quote of the Year
                has not been published yet.
              </p>
            `
        }

      </div>

      <!-- BULLETIN BUTTON -->
      <button
        id="view-bulletin"
        class="primary-button full-button home-bulletin-button"
      >
        View Sunday Bulletin
      </button>

    </div>
  `

  // --------------------------------------------------
  // EVENT LISTENERS
  // --------------------------------------------------

  container
    .querySelector('#view-bulletin')
    ?.addEventListener('click', onViewBulletin)
}
