// lib/storage.ts
export function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/`
}

export function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  return document.cookie.split('; ').reduce((r, v) => {
    const [key, val] = v.split('=')
    return key === name ? decodeURIComponent(val) : r
  }, '')
}

export function saveAndStore<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  const serialized = JSON.stringify(data)
  setCookie(key, serialized)
  sessionStorage.setItem(key, serialized)
}

export function loadStored<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const sessionData = sessionStorage.getItem(key)
    const cookieData = getCookie(key)
    const data = sessionData || cookieData
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function clearSessionStorage(keys: string[]) {
  if (typeof window === 'undefined') return;
  keys.forEach(key => sessionStorage.removeItem(key))
}
