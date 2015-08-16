import { AsyncStorage } from 'react-native';
import logState from '../config';

export default saveStateMiddleware = store => next => action => {
  let result = next(action);
  let nextState = store.getState();

  if (logState) {
    console.log('Saving state: ', nextState, action);
  }

  AsyncStorage.setItem('appState', JSON.stringify(nextState));
  return result;
}