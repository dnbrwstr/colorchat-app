import { AsyncStorage } from 'react-native';
import config from '../config';

let { logState, saveState, logActions } = config;

export default saveStateMiddleware = store => next => action => {
  if (logActions) {
    console.log(action.type, action);
  }

  let result = next(action);
  let nextState = store.getState();

  if (logState) {
    console.log('Saving state: ', nextState, action);
  }

  if (saveState) {
    AsyncStorage.setItem('appState', JSON.stringify(nextState));
  }

  if (action.type === 'deleteAccount' && action.state === 'complete') {
    AsyncStorage.removeItem('appState');
  }

  return result;
};
