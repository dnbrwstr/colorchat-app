import merge from 'merge';
import { createSelector } from 'reselect';

// Selector creaters

export let createConversationSelector = userId => state =>
  state.messages.filter(m => m.recipientId === userId || m.senderId === userId);

export let createContactSelector = contactId => state =>
  state.contacts.data.filter(c => c.id === contactId)[0];

export let conversationScreenSelector = (state, ownProps) => ({
  ...state.ui.conversation,
  user: state.user,
  contact: createContactSelector(ownProps.contactId)(state),
  messages: createConversationSelector(ownProps.contactId)(state)
});

// Selectors

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
