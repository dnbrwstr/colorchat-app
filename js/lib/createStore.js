import { AsyncStorage } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import saveStateMiddleware from './saveStateMiddleware';
import registration from '../reducers/registration';
import navigation from '../reducers/navigation';
import auth from '../reducers/auth';
import { rehydrate } from '../config';

let reducers = {
  registration,
  navigation,
  auth
};

let createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  saveStateMiddleware
)(createStore);

export default finalCreateStore = async () => {
  let appState = {};

  if (rehydrate) {
    let appStateString = await AsyncStorage.getItem('appState');
    appState = JSON.parse(appStateString);
    let { history } = appState.navigation;
    appState.navigation.route = history[history.length - 1];
  }

  return createStoreWithMiddleware(combineReducers(reducers), appState);
}
