import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: 'pb4w96ze',
  dataset: 'production',
  apiVersion: '2026-10-06',
  useCdn: false // `false` if you want to ensure fresh data
})

export async function getUpcomingBulletins(today) {
  const query = `
    *[
      _type == "bulletin" &&
      date >= $today
    ] | order(date asc)[0...2] {
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

  return client.fetch(query, {today})
}