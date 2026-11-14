import '../styles/contact.css'
import {escapeHtml} from '../utils/escapeHtml.js'

// Optional: a Google Maps Embed API key. Without one, the map still shows
// using Google's simple embed link. To use a key, add this line to .env:
//   VITE_GOOGLE_MAPS_EMBED_KEY=your-key
// and restrict the key to your website's domain in Google Cloud.
const MAPS_EMBED_KEY = import.meta.env?.VITE_GOOGLE_MAPS_EMBED_KEY || ''

const EXTERNAL_ICON = `
  <svg class="contact-external" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true" focusable="false">
    <path d="M7 17 17 7"/><path d="M8 7h9v9"/>
  </svg>
`

export function renderContact(container, settings = {}) {
  const address = settings?.address?.trim()
  const phone = settings?.phone?.trim()
  const email = settings?.email?.trim()
  const facebookUrl = safeWebUrl(settings?.facebookUrl)
  const dialNumber = phone?.replace(/[^\d+]/g, '')

  const mapQuery = address ? toMapQuery(address) : ''
  const directionsUrl = mapQuery
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`
    : ''

  const details = [
    address && renderDetail('Address', `
      <p class="contact-value contact-address">${escapeHtml(address)}</p>
      ${externalLink(directionsUrl, 'Get directions', 'contact-action')}
    `),

    email && renderDetail('Email', `
      <a class="contact-value contact-link" href="mailto:${escapeHtml(encodeURIComponent(email))}">
        ${escapeHtml(email)}
      </a>
    `),

    phone && dialNumber && renderDetail('Phone', `
      <a class="contact-value contact-link" href="tel:${escapeHtml(dialNumber)}">
        ${escapeHtml(phone)}
      </a>
    `),

    facebookUrl && renderDetail('Facebook', `
      ${externalLink(facebookUrl, 'Follow our page', 'contact-value contact-link')}
    `)
  ].filter(Boolean)

  container.innerHTML = `
    <div class="page contact-page">
      <header class="page-header">
        <h1>Contact</h1>
        <p>Find us or get in touch</p>
      </header>

        ${
          mapQuery
            ? navigator.onLine === false
              ? `
                <div class="contact-map-offline" role="status">
                  Connect to the internet to view the map.
                </div>
              `
              : `
                <div class="contact-map">
                  <iframe
                    src="${escapeHtml(mapEmbedUrl(mapQuery))}"
                    title="Map showing where our church is"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    allowfullscreen
                  ></iframe>
                </div>
              `
            : ''
        }

      ${
        details.length
          ? `<div class="contact-details">${details.join('')}</div>`
          : `
            <div class="empty-message">
              Contact details will be available soon.
            </div>
          `
      }
    </div>
  `
}

function renderDetail(label, body) {
  return `
    <div class="contact-detail">
      <span class="contact-label">${escapeHtml(label)}</span>
      ${body}
    </div>
  `
}

function externalLink(href, text, className) {
  return `
    <a class="${className}" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">
      ${escapeHtml(text)}${EXTERNAL_ICON}
      <span class="contact-sr-only">(opens in a new tab)</span>
    </a>
  `
}

/* ---------- Map helpers ---------- */

// Joins a multi-line address into one line and adds the country,
// so Google doesn't confuse Nelson NZ with Nelson in the UK or Canada.
function toMapQuery(address) {
  const oneLine = address.split(/\s*\n\s*/).filter(Boolean).join(', ')
  return /new zealand|\bnz\b/i.test(oneLine) ? oneLine : `${oneLine}, New Zealand`
}

function mapEmbedUrl(query) {
  const q = encodeURIComponent(query)

  return MAPS_EMBED_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(MAPS_EMBED_KEY)}&q=${q}`
    : `https://www.google.com/maps?q=${q}&output=embed`
}

function safeWebUrl(value) {
  if (!value) return ''

  try {
    const url = new URL(value)

    return ['https:', 'http:'].includes(url.protocol)
      ? url.href
      : ''
  } catch {
    return ''
  }
}