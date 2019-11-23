import {Message} from '../messages/types';

export interface Conversation {
  recipientId: number;
  recipientName?: string;
  lastMessage?: Message;
  unread: boolean;
  partnerIsComposing?: boolean;
}

export interface ComposeEventData {
  senderId: number;
}

export type ConversationState = Conversation[];

export const DELETE_CONVERSATION = 'deleteConversation';
export const MARK_CONVERSATION_READ = 'markConversationRead';
export const RECEIVE_COMPOSE_EVENT = 'receiveComposeEvent';
export const EXPIRE_COMPOSE_EVENT = 'expireComposeEvent';
export const RESET_COMPOSE_EVENTS = 'resetComposeEvents';

export interface DeleteConversationAction {
  type: typeof DELETE_CONVERSATION;
  conversation: Conversation;
}

export interface MarkConversationReadAction {
  type: typeof MARK_CONVERSATION_READ;
  contactId: number;
}

export interface ReceiveComposeEventAction {
  type: typeof RECEIVE_COMPOSE_EVENT;
  data: ComposeEventData;
}

export interface ExpireComposeEventAction {
  type: typeof EXPIRE_COMPOSE_EVENT;
  data: ComposeEventData;
}

export interface ResetComposeEventsAction {
  type: typeof RESET_COMPOSE_EVENTS;
}

export type ConversationActionTypes =
  | DeleteConversationAction
  | MarkConversationReadAction
  | ReceiveComposeEventAction
  | ExpireComposeEventAction
  | ResetComposeEventsAction;
