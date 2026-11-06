// Calculate the upcoming Sunday and the following Sunday.
// Use New Zealand time, regardless of the visitor's timezone.

export function getSundayDates() {
  const parts = new Intl.DateTimeFormat('en-NZ', {
    timeZone: 'Pacific/Auckland',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const getPart = (type) => {
    return Number(
      parts.find((part) => part.type === type).value
    )
  }

  // Construct a date using the NZ calendar day.
  // UTC date methods prevent daylight-saving calculations
  // from changing the intended Sunday.
  const sunday = new Date(
    Date.UTC(
      getPart('year'),
      getPart('month') - 1,
      getPart('day')
    )
  )

  // Sunday = 0.
  // If today is Sunday, use today.
  const daysUntilSunday =
    (7 - sunday.getUTCDay()) % 7

  sunday.setUTCDate(
    sunday.getUTCDate() + daysUntilSunday
  )

  const thisSunday =
    sunday.toISOString().slice(0, 10)

  sunday.setUTCDate(
    sunday.getUTCDate() + 7
  )

  const nextSunday =
    sunday.toISOString().slice(0, 10)

  return {
    thisSunday,
    nextSunday,
  }
}



/* 

For November 6, 2026, this returns:
{
  thisSunday: '2026-11-08',
  nextSunday: '2026-11-15'
}

*/