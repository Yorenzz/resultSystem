import storage from './storage.js'

import { TOKEN_KEY } from '../config'

export const getToken = () => {
	return storage.getItem(TOKEN_KEY)
}
