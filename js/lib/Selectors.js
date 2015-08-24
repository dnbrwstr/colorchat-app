import merge from 'merge';
import { createSelector } from 'reselect';

// Selector creaters

export let createConversationSelector = userId => state =>
  state.messages.filter(m => m.to === userId || m.from === userId);

export let createContactSelector = contactId => state =>
  state.contacts.data.filter(c => c.recordID === contactId)[0];

export let conversationScreenSelector = (state, ownProps) => ({
  ...state.ui.conversation,
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
});
