export let deleteConversation = conversation => {
  return {
    type: 'deleteConversation',
    conversation
  }
};