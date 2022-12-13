import { defineStore } from 'pinia'

export const useClassStore = defineStore(
	'class',
	{
		state: () => {
			return {
				gradeOneClass: [],
				gradeTwoClass: [],
				gradeThreeClass: [],
			}
		},
		getters: {
			getPerClass (state) {
				return grade => {
					if (grade === 1) {
						return state.gradeOneClass
					} else if (grade === 2) {
						return state.gradeTwoClass
					} else if (grade === 3) {
						return state.gradeThreeClass
					}
				}
			},
		},
		actions: {
			setOne (one) {
				this.gradeOneClass = one
			},
			setTwo (two) {
				this.gradeTwoClass = two
			},
			setThree (three) {
				this.gradeThreeClass = three
			},
		},
	},
)
