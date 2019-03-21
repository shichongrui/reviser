const React = require('react')
const hoistStatics = require('hoist-non-react-statics')

const NOOP = function () {}

module.exports = function (store, actions) {
  return function (mapStore, mapActions) {
    mapStore = mapStore || NOOP
    mapActions = mapActions || NOOP

    return function (ComponentToWrap) {
      class Reviser extends React.Component {
        componentWillMount () {
          this.boundUpdate = this.update.bind(this)
          store.on('change', this.boundUpdate)
        }

        componentWillUnmount () {
          store.removeListener('change', this.boundUpdate)
        }

        update () {
          this.forceUpdate()
        }

        render () {
          return React.createElement(ComponentToWrap, {
            ...this.props,
            ...mapStore(store.get()),
            ...mapActions(actions)
          })
        }
      }
      hoistStatics(Reviser, ComponentToWrap)
      return Reviser
    }
  }
}