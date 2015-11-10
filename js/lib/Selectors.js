import { merge, find, propEq, filter, reduce, concat } from 'ramda';
import { createSelector } from 'reselect';

// Selector creaters

export let selectMessages = createSelector([
  state => state.messages.working,
  state => state.messages.placeholder,
  state => state.messages.enqueued,
  state => state.messages.sending,
  state => state.messages.static
], (...args) => reduce(concat, [], args))

export let createContactSelector = contactId => state =>
  state.contacts.filter(c => c.id === contactId)[0];

// Selectors

export let conversationScreenSelector = createSelector([
    state => state.ui.conversation,
    state => state.user,
    (state, ownProps) => createContactSelector(ownProps.contactId)(state),
    selectMessages
  ],
  (ui, user, contact, messages) => {
    return {
      ...ui,
      user: user,
      contact: contact,
      messages: messages
    }
  }
);

export let inboxScreenSelector = (state, ownProps) => {
  let conversations = [];
  state.conversations.forEach(c => {
    let contact = find(propEq('id', c.recipientId), state.contacts);

    if (contact) conversations.push({
      ...c,
      contact
    });
  });

  return {
    conversations: conversations
  }
};

export let socketServiceSelector = state => {
  return {
    enqueuedMessages: state.messages.enqueued,
    composingMessages: state.messages.working,
    token: state.user.token
  }
};

let selectSignupUIData = state => state.ui.signup;
let selectSignupData = state => state.signup;
let mergeArgs = (...args) => merge.apply(null, args);

export let signupScreenSelector = createSelector([
  selectSignupData,
  selectSignupUIData
], mergeArgs);

let selectConfirmationCodeUIData = state => state.ui.confirmationCode;

export let confirmationCodeScreenSelector = createSelector([
  selectSignupData,
  selectConfirmationCodeUIData
], mergeArgs);

export let mainScreenSelector = state => ({
  ...state.ui.main,
  user: state.user
});
