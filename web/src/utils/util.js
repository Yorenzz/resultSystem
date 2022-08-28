import storage from './storage.js'

const TOKEN_KEY = 'XToken'

export const getToken = () => {
  return storage.getItem(TOKEN_KEY)
}
