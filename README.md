![](logo.png)

Redux Hive is an extensible Redux-system that helps you work with Redux faster and cleaner by providing centralized management of Redux-things (such as reducers, middlewares or sagas) and a addon-system.

Redux Hive has built-in support for ImmerJS, there is no need to install it explicitly. Though, ImmerJS can also be deactivated in some specific handlers if needed. 
# Getting started
## Install
```
npm install redux-hive
```
## Basic usage
You just need to create the store by using `createStore`. 
`store` is a native redux store; therefore, it can be use as usual.

```javascript
import {createStore} from "redux-hive";

const store = createStore({
  reducers: {
    todos: {
      initialState: {
        myTodos: [],
      }
      handlers: {
        'ADD_TODO': (state, action) => {
          state.myTodos.push(action.payload);
        }
      }
    }
  }
})
```
