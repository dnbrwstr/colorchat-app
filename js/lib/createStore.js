import { AsyncStorage } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import saveStateMiddleware from './saveStateMiddleware';
import * as reducers from '../reducers';
import config from '../config';

let { rehydrate, rehydrateBlacklist } = config;

let createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  saveStateMiddleware
)(createStore);

export default finalCreateStore = async () => {
  let store = createStoreWithMiddleware(combineReducers(reducers));
  let appState = {};
  let appStateString = await AsyncStorage.getItem('appState');

  if (rehydrate && appStateString) {
    try {
      appState = JSON.parse(appStateString);
    } catch (e) {
      console.log('Unable to rehydrate app state');
    }
  }

  if (rehydrateBlacklist) {
    rehydrateBlacklist.forEach(key => {
      appState[key] && delete appState[key]
    });
  }

  store.dispatch({
    type: 'init',
    appState: appState
  });

  return store;
};
