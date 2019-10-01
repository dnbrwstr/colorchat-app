import {createSelector} from 'reselect';
import {formatName} from '../lib/Utils';
import {AppState} from './createStore';
import {Message} from './messages/types';
import {MatchedContact} from './contacts/types';
import {getReferenceDate} from '../lib/MessageUtils';

export let selectMessages = createSelector(
  (state: AppState) => state.messages.working,
  (state: AppState) => state.messages.placeholder,
  (state: AppState) => state.messages.enqueued,
  (state: AppState) => state.messages.sending,
  (state: AppState) => state.messages.static,
  (...messageTypes: Message[][]) =>
    messageTypes.reduce((memo, messages) => memo.concat(messages)),
);

export let createContactSelector = (contactId: number) => (state: AppState) =>
  state.contacts.filter(c => c.id === contactId)[0];

let createConversationSelector = (contactId: number) => (state: AppState) =>
  state.conversations.filter(c => c.recipientId === contactId)[0];

// Selectors

export let conversationScreenSelector = createSelector(
  (state: AppState) => state.ui.conversation,
  (state: AppState) => state.user,
  (state, ownProps) =>
    createContactSelector(state.ui.conversation.contactId)(state),
  selectMessages,
  (state: AppState) => state.messages.total,
  (state, ownProps) =>
    createConversationSelector(state.ui.conversation.contactId)(state),
  (ui, user, contact, messages, totalMessages, conversation) => {
    conversation = conversation || {};

    contact = contact || {
      id: conversation.recipientId,
      name: conversation.recipientName,
      avatar: '#CCC',
    };

    if (contact.givenName) {
      contact.name = formatName(contact.givenName, contact.familyName);
    }

    return {
      ...ui,
      user,
      contact,
      partnerIsComposing: conversation.partnerIsComposing,
      messages,
      totalMessages,
    };
  },
);

let sortedConversationsSelector = createSelector(
  (state: AppState) => state.conversations,
  conversations => {
    return conversations.sort(function(a, b) {
      if (!a.lastMessage) return 1;
      else if (!b.lastMessage) return -1;
      const dateA = getReferenceDate(a.lastMessage);
      const dateB = getReferenceDate(b.lastMessage);
      if (dateA < dateB) return 1;
      else if (dateA > dateB) return -1;
      else return 0;
    });
  },
);

let contactsByIdSelector = createSelector(
  (state: AppState) => state.contacts,
  contacts => {
    return contacts.reduce((memo: {[key: string]: MatchedContact}, contact) => {
      const matchedContact = contact as MatchedContact;
      if (typeof matchedContact.id !== 'undefined') {
        memo[matchedContact.id] = matchedContact;
      }
      return memo;
    }, {});
  },
);

export let inboxScreenSelector = createSelector(
  sortedConversationsSelector,
  contactsByIdSelector,
  (state: AppState) => state.user,
  (conversations, contacts, user) => {
    return {
      conversations,
      contacts,
      user,
    };
  },
);

export let socketServiceSelector = (state: AppState) => {
  return {
    enqueuedMessages: state.messages.enqueued,
    composingMessages: state.messages.working,
    token: state.user.token,
  };
};

const selectSignupUIData = (state: AppState) => state.ui.signup;
const selectSignupData = (state: AppState) => state.signup;
const mergeArgs = <T extends {}>(...args: T[]) =>
  args.reduce((memo, a) => ({
    ...memo,
    ...a,
  }));

export const signupScreenSelector = createSelector(
  selectSignupData,
  selectSignupUIData,
  mergeArgs,
);

const selectConfirmationCodeUIData = (state: AppState) =>
  state.ui.confirmationCode;

export const confirmationCodeScreenSelector = createSelector(
  selectSignupData,
  selectConfirmationCodeUIData,
  mergeArgs,
);
