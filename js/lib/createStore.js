import AsyncStorage from "@react-native-community/async-storage";
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import saveStateMiddleware from "./saveStateMiddleware";
import navigationMiddleware from "./navigationMiddleware";
import notificationMiddleware from "./notificationMiddleware";
import * as reducers from "../reducers";
import config from "../config";
import createScreenshotState from "./createScreenshotState";

let { rehydrate, rehydrateBlacklist, screenshotMode } = config;

let createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  saveStateMiddleware,
  navigationMiddleware,
  notificationMiddleware
)(createStore);

export default finalCreateStore = async () => {
  let store = createStoreWithMiddleware(
    combineReducers(reducers),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  let appState = {};
  let appStateString = await AsyncStorage.getItem("appState");

  if (screenshotMode) {
    appState = createScreenshotState();
  } else if (rehydrate && appStateString) {
    try {
      appState = JSON.parse(appStateString);
    } catch (e) {
      console.log("Unable to rehydrate app state");
    }
  }

  if (rehydrateBlacklist) {
    rehydrateBlacklist.forEach(key => {
      appState[key] && delete appState[key];
    });
  }

  store.dispatch({
    type: "init",
    appState: appState
  });

  return store;
};
