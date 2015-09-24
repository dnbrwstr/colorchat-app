import { merge, find, propEq, filter } from 'ramda';
import { createSelector } from 'reselect';

// Selector creaters

export let createConversationSelector = userId => state =>
  state.messages.filter(m =>
    (m.recipientId === userId || m.senderId === userId) &&
    m.state !== 'enqueued'
  ).sort((a, b) => {
    let timeA = new Date(a.clientTimestamp || a.createdAt);
    let timeB = new Date(b.clientTimestamp || b.createdAt);

    if (timeA > timeB) return -1;
    else if (timeA < timeB) return 1;
    else return 0;
  }).slice(0, 20)

export let createContactSelector = contactId => state =>
  state.contacts.filter(c => c.id === contactId)[0];

// Selectors

export let conversationScreenSelector = createSelector([
    state => state.ui.conversation,
    state => state.user,
    (state, ownProps) => createContactSelector(ownProps.contactId)(state),
    (state, ownProps) => createConversationSelector(ownProps.contactId)(state)
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

export let messagesScreenSelector = (state, ownProps) => {
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
  let messages = filter(propEq('state', 'enqueued'), state.messages);
  return {
    messages: messages,
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
