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
## Install add-ons
This should give you the feeling of using an addon in Redux Hive.

Install the API-Addon 
```
npm install redux-hive-addon-api
```

Register the addon in the store config

```javascript
import {createStore} from "redux-hive";
import {ApiAddon, ApiReduceAddon} from "redux-hive-addon-api";
import history from './history';

const store = createStore({
  reducers: {
    todos: {
      addons: [ApiReduceAddon({
        'FETCH_TODOS':{
          success: 'myTodos',
          defaultValue: [],
        }
      })]
    }
  },
  addons: [
    ApiAddon(),
  ]
})
```

That's it. Now you can fetch your Todos and automatically update your state like this
```javascript
import {createApiAction} from "redux-hive-addon-api";

store.dispatch(createApiAction('FETCH_TODOS',{
  url: "http://localhost:3000/api/v1/todos",
}))

// Your state after receiving response from server
{
  todos: {
    myTodos: [...],
    loading: false,
    error: null,
  }
}
```
