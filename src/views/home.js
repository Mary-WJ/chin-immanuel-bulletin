import churchLogo from '../assets/logo1.png'

import {
  formatToday,
  formatBulletinDate,
} from '../utils/formatDate.js'

export function renderHome(container, bulletins, onViewBulletin) {
  const bulletin = bulletins[0]

  container.innerHTML = `
    <div class="page home-page">

      <div class="church-logo">
          <img src="${churchLogo}" alt="Chin Immanuel Church logo">
      </div>

      <h1>
        Chin Immanuel Church
      </h1>

      <p class="church-location">
        NELSON · NEW ZEALAND
      </p>

      <div class="home-card today-card">

        <span class="eyebrow">
          TODAY
        </span>

        <strong>
          ${formatToday()}
        </strong>

      </div>

      ${
        bulletin
          ? `
            <div class="home-card sunday-card">

              <span class="eyebrow">
                THIS SUNDAY
              </span>

              <h2>
                ${formatBulletinDate(bulletin.date)} · 1:00 PM
              </h2>

              <p>
                Nelson, New Zealand
              </p>

              <button
                id="view-bulletin"
                class="primary-button full-button"
              >
                View this week's bulletin
              </button>

            </div>
          `
          : `
            <div class="home-card">
              No upcoming bulletin has been published yet.
            </div>
          `
      }

    </div>
  `

  document
    .querySelector('#view-bulletin')
    ?.addEventListener('click', onViewBulletin)
}