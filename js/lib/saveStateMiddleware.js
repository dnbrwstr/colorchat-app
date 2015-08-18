import { AsyncStorage } from 'react-native';
import { logState, saveState } from '../config';

export default saveStateMiddleware = store => next => action => {
  let result = next(action);
  let nextState = store.getState();

  if (logState) {
    console.log('Saving state: ', nextState, action);
  }

  if (saveState) {
    AsyncStorage.setItem('appState', JSON.stringify(nextState));
  }

  return result;
};
