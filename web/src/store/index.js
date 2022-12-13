import { defineStore } from 'pinia'
import storage from '../utils/storage.js'

export const mainStore = defineStore('main', {
	state: () => {
		return { msg: 'ggg' }
	},
	getters: {},
	actions: {},
})

export const userInfoStore = defineStore(
	'userInfo',
	{
		state: () => {
			return {
				username: '',
				role: '',
				XToken: '' || storage.getItem('XToken'),
			}
		},
		getters: {},
		actions: {
			saveUserInfo (username, role, token) {
				this.username = username
				this.role = role
				token
          && (this.XToken = token)
          && storage.setItem('XToken', this.XToken)
			},
		},
	},
)
