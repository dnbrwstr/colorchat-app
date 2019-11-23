import AsyncStorage from '@react-native-community/async-storage';
import config from '../config';
import {AppState} from '../store/createStore';
import createScreenshotState from '../store/createScreenshotState';

const {rehydrate, rehydrateBlacklist, screenshotMode} = config;

export const STATE_STORAGE_KEY = 'appState';

export const loadState = async (): Promise<Partial<AppState>> => {
  let appState: Partial<AppState> = {};
  if (screenshotMode) {
    appState = createScreenshotState();
  } else if (rehydrate) {
    const appStateString = await AsyncStorage.getItem(STATE_STORAGE_KEY);
    if (appStateString) {
      try {
        appState = JSON.parse(appStateString);
      } catch (e) {
        console.log('Unable to rehydrate app state');
      }
    }
  }

  if (rehydrateBlacklist) {
    rehydrateBlacklist.forEach(key => {
      appState[key] && delete appState[key];
    });
  }

  return appState;
};

export const saveState = (state: AppState) => {
  return AsyncStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
};

export default loadState;
