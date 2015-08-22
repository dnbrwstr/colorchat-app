import { createSelector } from 'reselect';

// Selector creaters

export let createConversationSelector = userId => state =>
  state.messages.filter(m => m.to === userId || m.from === userId);

export let createContactSelector = contactId => state =>
  state.contacts.data.filter(c => c.recordID === contactId)[0];

export let conversationScreenSelector = (state, ownProps) => ({
  contact: createContactSelector(ownProps.contactId)(state),
  messages: createConversationSelector(ownProps.contactId)(state)
});

// Selectors

let selectRegistrationData = state => state.registration;

export let selectRegistrationState = createSelector(
  selectRegistrationData,
  (registration) => registration
);
