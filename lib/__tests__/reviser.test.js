const React = require('react')
const renderer = require('react-test-renderer')
const setupReviser = require('../reviser')
const createStore = require('simmutable')
const setupActions = require('../actions')

const e = React.createElement

describe('reviser', () => {
  let store = createStore()
  let actions = {}
  let createActions = setupActions(store, actions)
  let reviser = setupReviser(store, actions)

  let tree
  beforeEach(() => {
    store.clear()
    actions = {}
    createActions = setupActions(store, actions)
    reviser = setupReviser(store, actions)
  })
  afterEach(() => tree.unmount())

  it('renders the wrapped component with the passed in props', () => {
    let Wrapped = reviser()((props) => e('div', null, props.yo))

    tree = renderer.create(
      e(Wrapped, {yo: 'yo'})
    )

    expect(tree.toJSON()).toMatchSnapshot()
  })

  it('passes in actions as props when asked for', () => {
    let actionFunc = jest.fn()
    createActions({
      yoAction: actionFunc
    })

    let Wrapped = reviser(
      null,
      (actions) => ({ anAction: actions.yoAction })
    )((props) => {
      props.anAction()
      return e('div')
    })

    tree = renderer.create(
      e(Wrapped)
    )

    expect(actionFunc).toHaveBeenCalled()
  })

  it('passes in store state when asked for', () => {
    store.set({
      a: {
        b: 1
      }
    })

    let Wrapped = reviser((state) => ({ yo: state.a.b }))((props) => e('div', null, props.yo))

    tree = renderer.create(
      e(Wrapped)
    )

    expect(tree.toJSON()).toMatchSnapshot()
  })

  it('rerenders when the state changes', () => {
    store.set({
      a: {
        b: 1
      }
    })

    let Wrapped = reviser((state) => ({ yo: state.a.b }))((props) => e('div', null, props.yo))

    tree = renderer.create(
      e(Wrapped)
    )

    expect(tree.toJSON()).toMatchSnapshot('state-change-first-render')

    store.set({
      a: {
        b: 2
      }
    })

    expect(tree.toJSON()).toMatchSnapshot('state-change-re-render')
  })

  it('doesnt rerender after unmount', () => {
    store.set({
      a: {
        b: 1
      }
    })

    let Wrapped = reviser((state) => ({ yo: state.a.b }))((props) => e('div', null, props.yo))

    tree = renderer.create(
      e(Wrapped)
    )

    tree.unmount()

    store.set({
      a: {
        b: 2
      }
    })

    // to appease the afterEach above
    tree = renderer.create(e(Wrapped))
  })
})