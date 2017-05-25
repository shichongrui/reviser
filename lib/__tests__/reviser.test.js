const React = require('react')
const renderer = require('react-test-renderer')
const reviser = require('../reviser')
const actions = require('../actions')
const store = require('../store')

const e = React.createElement

describe('reviser', () => {
  let tree
  beforeEach(() => {
    store.clear()
    actions.actions = {}
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
    actions.createActions({
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
})