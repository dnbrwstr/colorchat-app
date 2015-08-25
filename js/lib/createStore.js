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
  let appState = {};

  if (rehydrate) {
    let appStateString = await AsyncStorage.getItem('appState');
    appState = JSON.parse(appStateString);

    if (rehydrateBlacklist) {
      rehydrateBlacklist.forEach(key => delete appState[key]);
    }

    if (appState.navigation) {
      let { history } = appState.navigation;
      appState.navigation.route = history[history.length - 1];
    }
  }

  return createStoreWithMiddleware(combineReducers(reducers), appState);
}
