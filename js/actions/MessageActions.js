import { Dimensions } from "react-native";
import { merge, mergeAll, map, zipWith } from "ramda";
import NavigationService from "../lib/NavigationService";
import * as DatabaseUtils from "../lib/DatabaseUtils";

export let receiveMessage = message => async (dispatch, getState) => {
  let { ui } = getState();

  // Treat incoming messages as fresh by default
  message.state = "fresh";

  await DatabaseUtils.storeMessage(message);

  let inCurrentConversation =
    NavigationService.getCurrentRoute().routeName === "conversation" &&
    ui.conversation.contactId === message.senderId;

  dispatch({
    type: "receiveMessage",
    inCurrentConversation,
    message
  });
};

export let startComposingMessage = message => {
  return {
    type: "startComposingMessage",
    message
  };
};

export let cancelComposingMessage = message => {
  return {
    type: "cancelComposingMessage",
    message
  };
};

export let destroyWorkingMessage = message => {
  return {
    type: "destroyWorkingMessage",
    message
  };
};

export let updateWorkingMessage = (message, messageData) => (
  dispatch,
  getState
) => {
  let data = merge(messageData, {
    senderId: getState().user.id
  });

  dispatch({
    type: "updateWorkingMessage",
    message,
    messageData: data
  });
};

export let sendWorkingMessage = message => {
  return {
    type: "sendWorkingMessage",
    message
  };
};

export let sendMessages = (messages, state, data) => async (
  dispatch,
  getState
) => {
  if (state === "complete") {
    map(
      DatabaseUtils.storeMessage,
      zipWith(
        (a, b) => mergeAll([a, b, { state: "complete" }]),
        messages,
        data.responseMessages
      )
    );
  }

  dispatch({
    type: "sendMessages",
    messages,
    state,
    ...data
  });
};

export let resendMessage = message => {
  return {
    type: "resendMessage",
    message
  };
};

export let toggleMessageExpansion = message => {
  return {
    type: "toggleMessageExpansion",
    message
  };
};

export let loadMessages = (contactId, page = 1) => async (
  dispatch,
  getState
) => {
  let per = 20;

  dispatch({
    type: "loadMessages",
    state: "started",
    contactId
  });

  const state = getState();
  const userId = state.user.id;

  let { messages, total } = await DatabaseUtils.loadMessages({
    contactId,
    userId,
    page,
    per
  });

  dispatch({
    type: "loadMessages",
    state: "complete",
    messages,
    total
  });
};

export let unloadOldMessages = () => {
  return {
    type: "unloadOldMessages"
  };
};
