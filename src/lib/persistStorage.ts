import type { WebStorage } from 'redux-persist'

/**
 * Adaptateur localStorage compatible redux-persist.
 * Évite les problèmes d'interop CJS/ESM de `redux-persist/lib/storage` avec Vite.
 */
export const persistStorage: WebStorage = {
  getItem(key) {
    return Promise.resolve(localStorage.getItem(key))
  },
  setItem(key, value) {
    localStorage.setItem(key, value)
    return Promise.resolve()
  },
  removeItem(key) {
    localStorage.removeItem(key)
    return Promise.resolve()
  },
}
