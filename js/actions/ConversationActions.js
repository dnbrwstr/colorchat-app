import NavigationService from "../lib/NavigationService";

const COMPOSE_EVENT_TIMEOUT = 5000;

export let deleteConversation = conversation => {
  return {
    type: "deleteConversation",
    conversation
  };
};

let composeTimeout;

export let receiveComposeEvent = data => (dispatch, getState) => {
  let { contactId } = getState().ui.conversation;

  if (
    NavigationService.getCurrentRoute() !== "conversation" ||
    contactId !== data.senderId
  ) {
    return;
  }

  dispatch({
    type: "receiveComposeEvent",
    ...data
  });

  console.log("receive compose event");

  clearTimeout(composeTimeout);

  composeTimeout = setTimeout(() => {
    console.log("timeout compose event");
    dispatch({
      type: "composeEventExpire",
      ...data
    });
  }, COMPOSE_EVENT_TIMEOUT);
};

export let resetComposeEvents = () => ({
  type: "resetComposeEvents"
});
