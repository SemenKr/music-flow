const ensureTrailingSlash = (value: string) => (value.endsWith('/') ? value : `${value}/`)

export const getApiBaseUrl = () => {
  const envBaseUrl = import.meta.env.VITE_BASE_URL?.trim()

  return ensureTrailingSlash(envBaseUrl || '/api/proxy')
}
