import { AsyncStorage } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import saveStateMiddleware from './saveStateMiddleware';
import * as reducers from '../reducers';
import { rehydrate, rehydrateBlacklist } from '../config';

let createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  saveStateMiddleware
)(createStore);

export default finalCreateStore = async () => {
  let store = createStoreWithMiddleware(combineReducers(reducers));

  if (rehydrate) {
    let appStateString = await AsyncStorage.getItem('appState');
    let appState = JSON.parse(appStateString);

    if (rehydrateBlacklist) {
      rehydrateBlacklist.forEach(key => {
        appState[key] && delete appState[key]
      });
    }

    store.dispatch({
      type: 'init',
      appState: appState
    });
  } else {
    store.dispatch({
      type: 'init',
      appState: {}
    });
  }

  return store;
}
