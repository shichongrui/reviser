const createStore = require('simmutable')
const setupReviser = require('./reviser')

const setupActions = require('./actions')

module.exports = function () {
  const store = createStore()
  const actions = {}

  return {
    store,
    reviser: setupReviser(store, actions),
    createActions: setupActions(store, actions),
    actions,
  }
}