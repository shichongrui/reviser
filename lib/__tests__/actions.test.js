const setupActions = require('../actions')
const createStore = require('simmutable')

describe('actions', () => {
  let store = createStore()
  let actions = {}
  let createActions = setupActions(store, actions)

  beforeEach(() => {
    actions = {}
    createActions = setupActions(store, actions)
  })
  describe('createActions', () => {
    it('adds actions to the actions object', () => {
      createActions({
        anAction: () => {},
        anotherAction: () => {}
      })

      expect(actions).toHaveProperty('anAction')
      expect(actions).toHaveProperty('anotherAction')

      createActions({
        yetAnother: () => {}
      })

      expect(actions).toHaveProperty('yetAnother')
    })

    it('wraps each action so that the action has access to the store', () => {
      createActions({
        anAction: (store) => {
          expect(store).not.toBeNull()
        }
      })
      actions.anAction()
    })

    it('returns the return value of the wrapped action', () => {
      createActions({
        anAction: () => {
          return 'yo'
        }
      })

      expect(actions.anAction()).toEqual('yo')
    })

    it('passes all arguments to the wrapped action', () => {
      createActions({
        anAction: (store, hey, dude) => {
          return { hey, dude }
        }
      })

      expect(actions.anAction('whats', 'up')).toEqual({
        hey: 'whats',
        dude: 'up'
      })
    })
  })
})