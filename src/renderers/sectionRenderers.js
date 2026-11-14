import {escapeHtml, formatMultiline} from '../utils/escapeHtml.js'

export function renderSection(section) {
  switch (section.type) {
    case 'list':
      return renderLabelValueItems(section.items, true)

    case 'offering':
      return renderOffering(section.items)

    case 'note':
      return renderNote(section.note)

    case 'numbered':
      return renderNumbered(section.numberedItems)

    default:
      return `
        <p>
          Unsupported section type.
        </p>
      `
  }
}

function renderLabelValueItems(items = [], isTaskList = false) {
  return `
    <div class="bulletin-list ${isTaskList ? 'service-task-list' : ''}">

      ${items
        .map(
          (item) => `
            <div class="bulletin-row">

              <div class="bulletin-label">
                ${escapeHtml(item.label)}
              </div>

              <div class="leader"></div>

              <div class="bulletin-value">
                ${formatMultiline(item.value)}
              </div>

            </div>
          `,
        )
        .join('')}

    </div>
  `
}

function renderNote(note) {
  return `
    <div class="note">
      ${
        note
          ? formatMultiline(note)
          : 'No information added yet.'
      }
    </div>
  `
}

function renderNumbered(items = []) {
  if (!items.length) {
    return `
      <p>
        No information added yet.
      </p>
    `
  }

  return `
    <ol class="numbered-list">

      ${items
        .map(
          (item) => `
            <li>
              ${escapeHtml(item)}
            </li>
          `,
        )
        .join('')}

    </ol>
  `
}



//Offering section to calculate total offering amount
function renderOffering(items = []) {
  // Exclude any manually entered total to avoid counting it twice.
  const contributions = (items ?? []).filter(
    (item) =>
      String(item.label ?? '').trim().toLowerCase() !==
      'dihlakfonh',
  )

  const amounts = contributions.map(
    (item) => parseOfferingCents(item.value),
  )

  const hasInvalidAmount = amounts.some(
    (amount) => amount === null,
  )

  const totalCents = amounts.reduce(
    (total, amount) => total + (amount ?? 0),
    0,
  )

  const totalText = hasInvalidAmount
    ? 'Check amounts'
    : (totalCents / 100).toLocaleString('en-NZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })

  return `
    ${renderLabelValueItems(contributions)}

    <div class="bulletin-row offering-total">
      <div class="bulletin-label">
        Dihlakfonh
      </div>

      <div class="leader"></div>

      <div class="bulletin-value">
        ${escapeHtml(totalText)}
      </div>
    </div>
  `
}

function parseOfferingCents(value) {
  // Accept amounts such as 5530, 5530.00, or $5,530.00.
  const text = String(value ?? '')
    .trim()
    .replace(/^(?:NZ\$|\$)\s*/, '')

  // Treat an empty field as zero.
  if (!text) return 0

  // Reject invalid entries instead of displaying an incorrect total.
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(text)) {
    return null
  }

  const [whole, decimal = ''] = text.replace(/,/g, '').split('.')

  // Calculate in cents to avoid decimal rounding errors.
  const cents =
    Number(whole) * 100 +
    Number(decimal.padEnd(2, '0'))

  return Number.isSafeInteger(cents) ? cents : null
}




