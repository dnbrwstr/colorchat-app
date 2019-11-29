import {__, times, compose} from 'ramda';
import {createSeedMessage} from './MessageUtils';
import DatabaseManager, {StoredMessage} from './DatabaseManager';
import {FinishedMessage} from '../store/messages/types';

const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_MESSAGES_PER_PAGE = 20;

interface LoadMessagesOptions {
  userId: number;
  contactId: number;
  page: number;
  per: number;
}

export const loadMessages = async (options: LoadMessagesOptions) => {
  const defaults = {
    page: DEFAULT_PAGE_NUMBER,
    per: DEFAULT_MESSAGES_PER_PAGE,
  };

  const config = {
    ...defaults,
    ...options,
  };

  return DatabaseManager.loadMessagesForContact(
    config.userId,
    config.contactId,
    config.page,
    config.per,
  );
};

export const storeMessage = (message: StoredMessage) => {
  return DatabaseManager.storeMessage(message);
};

export const getUnreadCount = (userId: number) => {
  return DatabaseManager.getUnreadCount(userId);
};

export const markConversationRead = (userId: number, contactId: number) => {
  return DatabaseManager.markConversationRead(userId, contactId);
};

export const purgeMessages = () => {
  return DatabaseManager.purgeMessages();
};

export const seedMessages = (messageCount: number) => {
  for (let i = 0; i < messageCount; ++i) {
    storeMessage(createSeedMessage());
  }
};
