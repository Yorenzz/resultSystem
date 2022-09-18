import { defineStore } from 'pinia'
import { getClass } from '../api/index.js'

const one = await getClass(1)
const two = await getClass(2)
const three = await getClass(3)

export const useClassStore = defineStore(
  'class',
  {
    state: () => {
      return {
        gradeOneClass: one,
        gradeTwoClass: two,
        gradeThreeClass: three,
      }
    },
    getters: {
      getPerClass(state) {
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
  },
)
