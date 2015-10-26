export let deleteConversation = conversation => {
  return {
    type: 'deleteConversation',
    conversation
  };
};

export let receiveComposeEvent = data => {
  return {
    type: 'receiveComposeEvent',
    ...data
  };
};
