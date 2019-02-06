import { AsyncStorage, AlertIOS } from "react-native";
import config from "../config";
import {
  putAuthenticatedJSON,
  getAuthenticated,
  deleteAuthenticated
} from "../lib/RequestHelpers";
import * as DatabaseUtils from "../lib/DatabaseUtils";
import send from "../lib/send";

let { serverRoot } = config;

export let setMainTab = tabTitle => {
  return {
    type: "setMainTab",
    tabTitle: tabTitle
  };
};

export let startComposingMessage = () => {
  return {
    type: "toggleComposingMessage",
    value: true
  };
};

export let stopComposingMessage = () => {
  return {
    type: "toggleComposingMessage",
    value: false
  };
};

export let selectColorPicker = picker => {
  return {
    type: "selectColorPicker",
    value: picker
  };
};

export let updateConversationUi = newData => {
  return {
    type: "updateConversationUi",
    data: newData
  };
};

export let presentInternalAlert = data => {
  return {
    type: "presentInternalAlert",
    data: data
  };
};

export let dismissInternalAlert = id => {
  return {
    type: "dismissInternalAlert",
    alertId: id
  };
};

export let changeAppState = newState => {
  return {
    type: "changeAppState",
    newState
  };
};

export let changeNetwork = network => {
  return {
    type: "changeNetwork",
    network
  };
};

export let triggerMemoryWarning = () => {
  return {
    type: "memoryWarning"
  };
};

export let loadUserInfo = () => async (dispatch, getState) => {
  let url = serverRoot + "/account";
  let authToken = getState().user.token;

  send({
    dispatch,
    actionType: "loadUserInfo",
    getRequest: () => getAuthenticated(url, authToken)
  });
};

export let updateUserInfo = data => async (dispatch, getState) => {
  let url = serverRoot + "/account";
  let authToken = getState().user.token;

  send({
    dispatch,
    actionType: "updateUserInfo",
    baseAction: { data },
    getRequest: () => putAuthenticatedJSON(url, data, authToken)
  });
};

export let logout = () => ({ type: "logout" });

export let deleteAccount = data => async (dispatch, getState) => {
  let url = serverRoot + "/account";
  let authToken = getState().user.token;

  await send({
    dispatch,
    actionType: "deleteAccount",
    getRequest: () => deleteAuthenticated(url, authToken)
  });

  await DatabaseUtils.purgeMessages();

  AlertIOS.alert("Your account has been deleted! Enjoy your day :)");
};
