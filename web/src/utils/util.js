import storage from './storage.js'

import {TOKEN_KEY} from '../config'

export const getToken = () => {
  console.log(TOKEN_KEY);
  return storage.getItem(TOKEN_KEY)
}
