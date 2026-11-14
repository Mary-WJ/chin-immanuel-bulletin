const PREFIX = 'cic-content-v1:'

function readSaved(key, isValid) {
  try {
    const saved = JSON.parse(
      localStorage.getItem(PREFIX + key),
    )

    if (
      saved &&
      typeof saved.savedAt === 'string' &&
      isValid(saved.data)
    ) {
      return saved
    }
  } catch {
    // Missing, inaccessible or damaged saved data.
  }

  return null
}

function saveData(key, data) {
  const saved = {
    data,
    savedAt: new Date().toISOString(),
  }

  try {
    localStorage.setItem(
      PREFIX + key,
      JSON.stringify(saved),
    )

    return true
  } catch {
    // The live site can still work if storage is unavailable.
    return false
  }
}

async function withTimeout(fetchData) {
  let timer

  try {
    return await Promise.race([
      Promise.resolve().then(fetchData),

      new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error('Content request timed out'))
        }, 8000)
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

export async function loadWithSavedCopy(
  key,
  fetchData,
  isValid,
) {
  const saved = readSaved(key, isValid)

  if (navigator.onLine === false) {
    return {
      data: saved?.data ?? null,
      source: saved ? 'saved' : 'missing',
      storageFailed: false,
    }
  }

  try {
    const data = await withTimeout(fetchData)

    if (!isValid(data)) {
      throw new Error('Unexpected content format')
    }

    const stored = saveData(key, data)

    return {
      data,
      source: 'live',
      storageFailed: !stored,
    }
  } catch (error) {
    console.warn(`Unable to refresh ${key}:`, error)

    return {
      data: saved?.data ?? null,
      source: saved ? 'saved' : 'missing',
      storageFailed: false,
    }
  }
}