import {createSelector} from 'reselect';
import {AppState} from './createStore';
import {Message, FinishedMessage} from './messages/types';
import {MatchedContact} from './contacts/types';
import {getReferenceDate} from '../lib/MessageUtils';

export const selectMessages = createSelector(
  (state: AppState) => state.messages.working,
  (state: AppState) => state.messages.enqueued,
  (state: AppState) => state.messages.sending,
  (state: AppState) => state.messages.static,
  (...messageTypes: Message[][]) =>
    messageTypes.reduce((memo, messages) => memo.concat(messages)),
);

export const selectMatchedContacts = createSelector(
  (state: AppState) => state.contacts,
  contacts => contacts.filter(c => c.matched),
);

export const createContactSelector = (contactId: number | null) =>
  createSelector(
    (state: AppState) => state.contacts,
    contacts => {
      if (!contactId) return [];
      contacts.filter(c => c.matched && c.id === contactId)[0];
    },
  );

export const createConversationSelector = (contactId: number | null) =>
  createSelector(
    (state: AppState) => state.conversations,
    conversations => {
      if (!contactId) return [];
      conversations.filter(c => c.recipientId === contactId)[0];
    },
  );

export const selectConversationContact = createSelector(
  (state: AppState) => state.ui.conversation?.contactId,
  (state: AppState) => state.contacts,
  (contactId, contacts): MatchedContact => {
    return contacts.filter(
      c => c.matched && c.id === contactId,
    )[0] as MatchedContact;
  },
);

export const selectConversation = createSelector(
  (state: AppState) => state.ui.conversation?.contactId,
  (state: AppState) => state.conversations,
  (contactId, conversations) => {
    return conversations.filter(c => c.recipientId === contactId)[0];
  },
);

// Selectors

export let conversationScreenSelector = createSelector(
  (state: AppState) => state.ui.conversation,
  (state: AppState) => state.user,
  selectConversationContact,
  selectMessages,
  (state: AppState) => state.messages.total,
  selectConversation,
  (ui, user, contact, messages, totalMessages, conversation) => {
    const expanded = messages.some(m => (m as FinishedMessage).expanded);
    conversation = conversation || {};
    return {
      ...ui,
      user,
      contact,
      recipientId: conversation.recipientId,
      recipientName: conversation.recipientName,
      recipientAvatar: conversation.recipientAvatar,
      partnerIsComposing: conversation.partnerIsComposing,
      messages,
      totalMessages,
      hasExpandedMessages: expanded,
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

const selectSignupUIData = (state: AppState) => state.ui.signup;
const selectSignupData = (state: AppState) => state.signup;

export const signupScreenSelector = createSelector(
  selectSignupData,
  selectSignupUIData,
  (signupData, signupUiData) => {
    return {...signupData, ...signupUiData};
  },
);

const selectConfirmationCodeUIData = (state: AppState) =>
  state.ui.confirmationCode;

export const confirmationCodeScreenSelector = createSelector(
  selectSignupData,
  selectConfirmationCodeUIData,
  (signupData, confirmationCodeUiData) => {
    return {...signupData, ...confirmationCodeUiData};
  },
);
