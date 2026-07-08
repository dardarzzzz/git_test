const PREFIX = 'we-store:'

export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // storage unavailable (private mode, quota) — fail silently
  }
}

export function nextId(items) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1
}
