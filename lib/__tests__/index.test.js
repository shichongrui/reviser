const main = require('../index')

describe('main', () => {
  it('exports reviser', () => expect(main.reviser).not.toBeUndefined())
  it('exports createActions', () => expect(main.createActions).not.toBeUndefined())
  it('exports the actions', () => expect(main.actions).not.toBeUndefined())
  it('exports the store', () => expect(main.store).not.toBeUndefined())
})