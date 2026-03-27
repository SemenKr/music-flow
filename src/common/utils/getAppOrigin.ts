const removeTrailingSlash = (value: string) => value.replace(/\/+$/, '')

export const getAppOrigin = () => {
  if (typeof window !== 'undefined' && window.location.origin) {
    return removeTrailingSlash(window.location.origin)
  }

  const envOrigin = import.meta.env.VITE_DOMAIN_ADDRESS?.trim()

  return envOrigin ? removeTrailingSlash(envOrigin) : ''
}
