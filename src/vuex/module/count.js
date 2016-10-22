import * as types from '../mutation-types'

// initial state
const state = [
  {
    number: 0
  }
]

// mutations
const mutations = {
  increment (state, { item }) {
    state.push(item)
  }
}

export default {
  state,
  mutations
}
