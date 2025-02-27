const TOKEN_LOCAL_STORAGE_KEY = 'TOKEN'

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, JSON.stringify(token))
}

export function getToken(): string | undefined {
  const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY)
  return token ? JSON.parse(token) : undefined
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY)
}
