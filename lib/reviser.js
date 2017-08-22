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
          this.boundForceUpdate = this.forceUpdate.bind(this)
          store.on('change', this.boundForceUpdate)
        }

        componentWillUnmount () {
          store.removeListener('change', this.boundForceUpdate)
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