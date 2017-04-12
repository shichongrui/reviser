const store = require('../store')

describe('store', () => {
  it('store is a simmutable store', () => {
    expect(store).toHaveProperty('get')
    expect(store).toHaveProperty('set')
    expect(store).toHaveProperty('storeValue')
  })
})