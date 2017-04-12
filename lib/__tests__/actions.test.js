const actions = require('../actions')

describe('actions', () => {
  beforeEach(() => actions.actions = {})
  describe('createActions', () => {
    it('adds actions to the actions object', () => {
      actions.createActions({
        anAction: () => {},
        anotherAction: () => {}
      })

      expect(actions.actions).toHaveProperty('anAction')
      expect(actions.actions).toHaveProperty('anotherAction')

      actions.createActions({
        yetAnother: () => {}
      })

      expect(actions.actions).toHaveProperty('yetAnother')
    })

    it('wraps each action so that the action has access to the store', () => {
      actions.createActions({
        anAction: (store) => {
          expect(store).not.toBeNull()
        }
      })
      actions.actions.anAction()
    })

    it('returns the return value of the wrapped action', () => {
      actions.createActions({
        anAction: () => {
          return 'yo'
        }
      })

      expect(actions.actions.anAction()).toEqual('yo')
    })

    it('passes all arguments to the wrapped action', () => {
      actions.createActions({
        anAction: (store, hey, dude) => {
          return { hey, dude }
        }
      })

      expect(actions.actions.anAction('whats', 'up')).toEqual({
        hey: 'whats',
        dude: 'up'
      })
    })
  })
})