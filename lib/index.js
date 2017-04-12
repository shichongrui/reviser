const store = require('./store')
const actions = require('./actions')
const reactor = require('./reactor')

module.exports = {
  store,
  reactor,
  ...actions,
}