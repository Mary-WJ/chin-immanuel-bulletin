
import {createClient} from '@sanity/client'
import {getSundayDates} from './utils/getSundayDates.js'

export const client = createClient({
  projectId: 'pb4w96ze',
  dataset: 'production',
  apiVersion: '2026-10-06',
  useCdn: false,
})

// --------------------------------------------------
// GET THIS WEEK AND NEXT WEEK BULLETINS
// --------------------------------------------------

export async function getUpcomingBulletins() {
  const {thisSunday, nextSunday} = getSundayDates()

  // Only retrieve bulletins matching these two Sundays.
  const query = `
    *[
      _type == "bulletin" &&
      date in $dates
    ] | order(_updatedAt desc) {
      date,
      sections[]{
        title,
        type,
        items[]{
          label,
          value
        },
        note,
        numberedItems
      }
    }
  `

  const documents = await client.fetch(query, {
    dates: [thisSunday, nextSunday],
  })

  // Preserve each week's position.
  // A missing bulletin is represented by null.
  const thisWeekBulletin =
    documents.find(
      (bulletin) => bulletin.date === thisSunday
    ) ?? null

  const nextWeekBulletin =
    documents.find(
      (bulletin) => bulletin.date === nextSunday
    ) ?? null

  return [
    thisWeekBulletin,
    nextWeekBulletin,
  ]
}




/* --------------------------------
   CHURCH SETTINGS
-------------------------------- */

export async function getChurchSettings() {
  const query = `
    *[
      _type == "churchSettings" &&
      _id == "churchSettings"
    ][0] {
      quoteYear,
      quoteText,
      quoteReference,
      address,
      phone,
      email,
      facebookUrl
    }
  `

  return client.fetch(query)
}



// --------------------------------------------------
// UPCOMING EVENTS — NEW ZEALAND DATES
// --------------------------------------------------

export async function getUpcomingEvents() {
  const parts = new Intl.DateTimeFormat('en-NZ', {
    timeZone: 'Pacific/Auckland',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const getPart = (type) =>
    parts.find((part) => part.type === type).value

  const today =
    `${getPart('year')}-${getPart('month')}-${getPart('day')}`

  const query = `
    *[
      _type == "event" &&
      defined(date) &&
      date >= $today
    ] | order(date asc, startTime asc, title asc) {
      _id,
      title,
      date,
      startTime,
      location,
      description
    }
  `

  return client.fetch(
    query,
    {today},
    {perspective: 'published'},
  )
}