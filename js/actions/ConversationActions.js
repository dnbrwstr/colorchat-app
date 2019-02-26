import NavigationService from "../lib/NavigationService";

const COMPOSE_EVENT_TIMEOUT = 5000;

export let deleteConversation = conversation => {
  return {
    type: "deleteConversation",
    conversation
  };
};

export const markConversationRead = contactId => {
  return {
    type: "markConversationRead",
    contactId
  };
};

let composeTimeout;

export let receiveComposeEvent = data => (dispatch, getState) => {
  let { contactId } = getState().ui.conversation;

  if (
    NavigationService.getCurrentRoute().routeName !== "conversation" ||
    contactId !== data.senderId
  ) {
    return;
  }

  dispatch({
    type: "receiveComposeEvent",
    ...data
  });

  clearTimeout(composeTimeout);

  composeTimeout = setTimeout(() => {
    dispatch({
      type: "composeEventExpire",
      ...data
    });
  }, COMPOSE_EVENT_TIMEOUT);
};

export let resetComposeEvents = () => ({
  type: "resetComposeEvents"
});
