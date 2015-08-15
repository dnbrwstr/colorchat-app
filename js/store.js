import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import registration from './reducers/registration'
import navigation from './reducers/navigation';

let reducers = {
  registration,
  navigation
};

let createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

// Initial state set here will override initial state
// set in individual reducers, mostly makes sense to use
// for rehydration etc.
let initialState = {
  auth: {
    token: null
  }
};

export default store = createStoreWithMiddleware(combineReducers(reducers), initialState);
