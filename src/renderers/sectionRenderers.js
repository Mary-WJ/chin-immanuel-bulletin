import {escapeHtml, formatMultiline} from '../utils/escapeHtml.js'

export function renderSection(section) {
  switch (section.type) {
    case 'list':
      return renderLabelValueItems(section.items)

    case 'offering':
      return renderLabelValueItems(section.items)

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

function renderLabelValueItems(items = []) {
  return `
    <div class="bulletin-list">

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