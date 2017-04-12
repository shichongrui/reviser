# Reviser

A simple way to do global app state in a React app.

## TL;DR
```
import { createActions, reviser } from 'reviser'

createActions({
  fetchData: async (store, id) => {
    store.set({
      fetching: true
    })

    try {
      let data = await api.fetch(id)
      store.set({
        fetching: false,
        text: data.text
      })
    } catch (err) {
      store.set({
        fetching: false,
        error: err
      })
    }
  }
})

class MyComponent extends React.Component {
  componentDidMount () {
    this.props.fetchData(this.props.id)
  }

  render () {
    return (
      <div>{this.props.text}</div>
    )
  }
}

const WrappedComponent = reviser(
  (state) => {
    return {
      text: state.text || ''
    }
  },
  (actions) => {
    return {
      fetchData: actions.fetchData
    }
  }
)(MyComponent)

<WrappedComponent id='1' />
```

There are only 3 things to know. Actions, Store, and the `reviser` higher order component.

## Actions
Just create some actions. Actions always get passed an instance of the store so the action can modify the store in it's body.

```
import { createActions } from 'reviser'

createActions({
  login: async (store, username, password) => {
    store.set({
      login: {
        pending: true,
        loggedIn: false
      }
    })

    try {
      await api.login(username, password)
      store.set({
        login: {
          pending: false,
          loggedIn: true
        }
      })
    } catch (err) {
      store.set({
        login: {
          pending: false,
          error: err
        }
      })
    }
  }
})
```
Whatever your action returns will be returned when your action is called. Need to `await` an action? Just make sure it's an async function or it returns a promise. There are no hidden layers or indirection between how the store gets updated. It always happens in an action.

## Store
The store is an instance of a [simmutable](https://github.com/shichongrui/simmutable) store. Simmutable ensures that when you set a value in the store, it doesn't modify the existing store. It will merge the provided change into the existing store, overwriting values provided in the change, and leaving other existing values in the store.

```
store.set({
  a: {
    b: 1,
    c: 2
  }
})
/*
  {
    a: {
      b: 1,
      c: 2
    }
  }
*/

store.set({
  a: {
    b: 2
  }
})
/*
  {
    a: {
      b: 2,
      c: 2
    }
  }
*/
```

The store is frozen at all times by default to ensure that you do not modify it in development. To turn this off simply do this in your app entry point
```
import { store } from 'reviser'
store.config.shouldFreeze = false
```

## Reviser Higher Order Component
The Reviser HOC acts very similar to the `connect` HOC from `react-redux`

```
import { reviser } from 'reviser'

class MyComponent extends React.Component {
  componentDidMount () {
    this.props.fetchData()
  }

  render () {
    return (
      <div>{this.props.username}</div>
    )
  }
}

export default reviser(
  (state) => {
    return {
      username: state.login.username
    }
  },
  (actions) => {
    return {
      fetchData: actions.fetchUserData
    }
  }
)(MyComponent)
```
`reviser` takes two parameters. The first is a function that gets the current app state and then returns a subset of that state to pass in as props to the component. The second is also a function that does the same but for a list of all actions that have been created. `reviser` then returns a function that you pass in the component that you would like wrapped. A `reviser` component will also listen for changes in the store and then rerender itself when it detects a change in the store.