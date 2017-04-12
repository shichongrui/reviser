const store = require('./store')

module.exports.actions = {}
module.exports.createActions = function (actions) {
  let wrappedActions = Object.keys(actions)
    .reduce((previous, key) => {
      previous[key] = function () {
        let numArguments = arguments.length
        let args = []
        for (let i = 0; i < numArguments; i++) {
          args.push(arguments[i])
        }
        args.unshift(store)
        return actions[key].apply(null, args)
      }
      return previous
    }, {})

  module.exports.actions = {
    ...module.exports.actions,
    ...wrappedActions
  }
}