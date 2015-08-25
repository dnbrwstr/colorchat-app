import { merge, find, propEq } from 'ramda';
import { createSelector } from 'reselect';


// Selector creaters

export let createConversationSelector = userId => state =>
  state.messages.filter(m => m.recipientId === userId || m.senderId === userId);

export let createContactSelector = contactId => state =>
  state.contacts.data.filter(c => c.id === contactId)[0];

// Selectors

export let conversationScreenSelector = (state, ownProps) => ({
  ...state.ui.conversation,
  user: state.user,
  contact: createContactSelector(ownProps.contactId)(state),
  messages: createConversationSelector(ownProps.contactId)(state)
});

export let messagesScreenSelector = (state, ownProps) => {
  let conversations = state.conversations.map(c => {
    let contact = find(propEq('id', c.recipientId), state.contacts.data);

    return {
      ...c,
      contact
    };
  });

  return {
    conversations: conversations
  }
};

let selectSignupData = state => state.signup;
let mergeArgs = (...args) => merge.apply(null, [{}].concat(args))

export let signupScreenSelector = createSelector([
  selectSignupData,
  state => state.ui.signup
], mergeArgs);

export let confirmationCodeScreenSelector = createSelector([
  selectSignupData,
  state => state.ui.confirmPhoneNumber
], mergeArgs);

export let mainScreenSelector = state => ({
  ...state.ui.main,
  user: state.user
});
