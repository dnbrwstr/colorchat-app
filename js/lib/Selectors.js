import { merge, find, propEq, filter, reduce, concat } from "ramda";
import { createSelector } from "reselect";
import { formatName } from "./Utils";

// Selector creaters

export let selectMessages = createSelector(
  [
    state => state.messages.working,
    state => state.messages.placeholder,
    state => state.messages.enqueued,
    state => state.messages.sending,
    state => state.messages.static
  ],
  (...args) => reduce(concat, [], args)
);

export let createContactSelector = contactId => state =>
  state.contacts.filter(c => c.id === contactId)[0];

let createConversationSelector = contactId => state =>
  state.conversations.filter(c => c.recipientId === contactId)[0];

// Selectors

export let conversationScreenSelector = createSelector(
  [
    state => state.ui.conversation,
    state => state.user,
    (state, ownProps) =>
      createContactSelector(state.ui.conversation.contactId)(state),
    selectMessages,
    (state, ownProps) =>
      createConversationSelector(state.ui.conversation.contactId)(state)
  ],
  (ui, user, contact, messages, conversation) => {
    let contactId = contact ? contact.id : conversation.recipientId;

    let contactName = contact
      ? formatName(contact.givenName, contact.familyName)
      : conversation.recipientName;

    return {
      ...ui,
      user: user,
      contact: {
        id: contactId,
        name: contactName
      },
      messages: messages
    };
  }
);

let sortedConversationsSelector = createSelector(
  [state => state.conversations],
  conversations => {
    return conversations.sort(function(a, b) {
      if (!a.lastMessage) return 1;
      else if (!b.lastMessage) return -1;

      var dateA = new Date(
        a.lastMessage.createdAt || a.lastMessage.clientTimestamp
      );
      var dateB = new Date(
        b.lastMessage.createdAt || b.lastMessage.clientTimestamp
      );

      if (dateA < dateB) return 1;
      else if (dateA > dateB) return -1;
      else return 0;
    });
  }
);

let contactsByIdSelector = createSelector(
  [state => state.contacts],
  contacts => {
    return contacts.reduce(
      (memo, contact) => {
        if (contact.id) memo[contact.id] = contact;
        return memo;
      },
      {},
      contacts
    );
  }
);

export let inboxScreenSelector = createSelector(
  [sortedConversationsSelector, contactsByIdSelector],
  (conversations, contacts) => {
    return {
      conversations,
      contacts
    };
  }
);

export let socketServiceSelector = state => {
  return {
    enqueuedMessages: state.messages.enqueued,
    composingMessages: state.messages.working,
    token: state.user.token
  };
};

let selectSignupUIData = state => state.ui.signup;
let selectSignupData = state => state.signup;
let mergeArgs = (...args) => merge.apply(null, args);

export let signupScreenSelector = createSelector(
  [selectSignupData, selectSignupUIData],
  mergeArgs
);

let selectConfirmationCodeUIData = state => state.ui.confirmationCode;

export let confirmationCodeScreenSelector = createSelector(
  [selectSignupData, selectConfirmationCodeUIData],
  mergeArgs
);

export let mainScreenSelector = state => ({
  ...state.ui.main,
  user: state.user
});
