
const COMPOSE_EVENT_TIMEOUT = 3000;

export let deleteConversation = conversation => {
  return {
    type: 'deleteConversation',
    conversation
  };
};

let composeTimeout;

export let receiveComposeEvent = data => (dispatch, getState) => {
  dispatch({
    type: 'receiveComposeEvent',
    ...data
  });

  clearTimeout(composeTimeout);

  composeTimeout = setTimeout(() => dispatch({
    type: 'composeEventExpire',
    ...data
  }), COMPOSE_EVENT_TIMEOUT)
};

export let resetComposeEvents = () => ({
  type: 'resetComposeEvents'
});