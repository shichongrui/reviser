module.exports = function (store, actions) {
  return function (newActions) {
    Object.keys(newActions)
      .forEach(key => {
        actions[key] = function () {
          let numArguments = arguments.length
          let args = []
          for (let i = 0; i < numArguments; i++) {
            args.push(arguments[i])
          }
          args.unshift(store)
          return newActions[key].apply(null, args)
        }
      })
  }
}