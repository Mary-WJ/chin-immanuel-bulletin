import '../styles/events.css'
import {escapeHtml} from '../utils/escapeHtml.js'

const NZ_TIME_ZONE = 'Pacific/Auckland'
const DAY_MS = 24 * 60 * 60 * 1000

const ICONS = {
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>'
}

export function renderEvents(container, events = [], error = false) {
  container.innerHTML = `
    <div class="page events-page">
      <header class="page-header">
        <h1>Upcoming events</h1>
        <p>Soonest first · New Zealand time</p>
      </header>

      ${
        error
          ? `
            <div class="empty-message" role="alert">
              Unable to load events. Please refresh to try again.
            </div>
          `
          : events.length
            ? `
              <div class="events-list">
                ${events.map(renderEvent).join('')}
              </div>
            `
            : `
              <div class="empty-message">
                No upcoming events at the moment.
              </div>
            `
      }
    </div>
  `
}

function renderEvent(event) {
  const parts = getDateParts(event.date)
  const time = formatEventTime(event.startTime)
  const location = event.location?.trim()
  const description = event.description?.trim()
  const badge = getRelativeLabel(event.date)

  // "Saturday · 1:00 PM" — the tile already shows the month and day.
  const when = [parts?.weekday, time].filter(Boolean).join(' · ')

  return `
    <article class="event-card">
      ${
        parts
          ? `
            <time class="event-date-tile" datetime="${escapeHtml(event.date)}">
              <span class="event-date-month">${parts.month}</span>
              <span class="event-date-day">${parts.day}</span>
            </time>
          `
          : ''
      }

      <div class="event-body">
        <div class="event-title-row">
          <h2>${escapeHtml(event.title || 'Church event')}</h2>
          ${
            badge
              ? `<span class="event-badge${badge === 'Today' ? ' is-today' : ''}">${badge}</span>`
              : ''
          }
        </div>

        <ul class="event-meta">
          ${when ? `<li>${icon('clock')}<span>${escapeHtml(when)}</span></li>` : ''}
          ${location ? `<li>${icon('pin')}<span>${escapeHtml(location)}</span></li>` : ''}
        </ul>

        ${
          description
            ? `<p class="event-description">${escapeHtml(description)}</p>`
            : ''
        }
      </div>
    </article>
  `
}

function icon(name) {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      ${ICONS[name]}
    </svg>
  `
}

/* ---------- Date and time helpers ---------- */

// Turns "YYYY-MM-DD" into a plain calendar date (UTC midnight),
// so it never shifts to another day in the visitor's timezone.
// Returns null if the date is missing or not in that format.
function parseDateOnly(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? '').trim())
  if (!match) return null

  const utc = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(utc) ? null : utc
}

// { month: "Nov", day: "21", weekday: "Saturday" }
function getDateParts(value) {
  const utc = parseDateOnly(value)
  if (utc === null) return null

  const date = new Date(utc)
  const format = options =>
    new Intl.DateTimeFormat('en-NZ', {timeZone: 'UTC', ...options}).format(date)

  return {
    month: format({month: 'short'}),
    day: format({day: 'numeric'}),
    weekday: format({weekday: 'long'})
  }
}

// Today's date in New Zealand, as UTC midnight (same shape as parseDateOnly).
function todayInNZ() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-NZ', {
      timeZone: NZ_TIME_ZONE,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
      .formatToParts(new Date())
      .map(({type, value}) => [type, value])
  )

  return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day))
}

// "Today", "Tomorrow", "In 3 days" — only for events in the next 7 days.
function getRelativeLabel(value) {
  const utc = parseDateOnly(value)
  if (utc === null) return ''

  const days = Math.round((utc - todayInNZ()) / DAY_MS)

  if (days < 0) return ''
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days <= 7) return `In ${days} days`
  return ''
}

// "13:00" -> "1:00 PM"
function formatEventTime(time) {
  if (!time || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return ''
  }

  const [hours, minutes] = time.split(':')
  const hour = Number(hours)

  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`
}