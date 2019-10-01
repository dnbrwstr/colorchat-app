export interface RawMessageData {
  id: string;
  senderId: number;
  recipientId: number;
  createdAt: string;
  type: MessageType;
  color: string;
  colorName: string;
  relativeWidth: number;
  relativeHeight: number;
}

export interface PendingMessage {
  state: 'enqueued';
  senderId: number;
  recipientId: number;
  createdAt: string;
  clientId: string;
  clientTimestamp: string;
  type: MessageType;
  color: string;
  width: number;
  height: number;
}

export interface WorkingMessage {
  state: 'working' | 'cancelling' | 'sending';
  recipientId: number;
  width: number;
  height: number;
  type: MessageType;
  color: string;
  clientId: string;
  clientTimestamp: string;
  expanded: boolean;
}

export type FinishedMessage = RawMessageData & {
  state: 'static' | 'fresh';
  width: number;
  height: number;
  animateEntry?: boolean;
  expanded: boolean;
};

export type Message = PendingMessage | WorkingMessage | FinishedMessage;

export interface MessageState {
  total: number;
  static: Message[];
  working: Message[];
  enqueued: Message[];
  sending: Message[];
  placeholder: Message[];
}

export type MessageSendState =
  | 'static'
  | 'working'
  | 'enqueued'
  | 'sending'
  | 'placeholder';

export enum MessageType {
  Default = 'default',
  Picture = 'picture',
}

export const START_COMPOSING_MESSAGE = 'startComposingMessage';
export const CANCEL_COMPOSING_MESSAGE = 'cancelComposingMessage';
export const DESTROY_WORKING_MESSAGE = 'destroyWorkingMessage';
export const UPDATE_WORKING_MESSAGE = 'updateWorkingMessage';
export const SEND_WORKING_MESSAGE = 'sendWorkingMessage';
export const SEND_MESSAGES = 'sendMessages';
export const HANDLE_SEND_MESSAGE_START = 'handleSendMessageStart';
export const HANDLE_SEND_MESSAGE_COMPLETION = 'handleSendMessageCompletion';
export const HANDLE_SEND_MESSAGE_FAILURE = 'handleSendMessageFailure';
export const RESEND_MESSAGE = 'resendMessage';
export const RECEIVE_MESSAGE = 'receiveMessage';
export const TOGGLE_MESSAGE_EXPANSION = 'toggleMessageExpansion';
export const LOAD_MESSAGES = 'loadMessages';
export const RESET_MESSAGES = 'resetMessages';
export const UNLOAD_OLD_MESSAGES = 'unloadOldMessages';

export interface UnloadOldMessagesAction {
  type: typeof UNLOAD_OLD_MESSAGES;
}

export interface ReceiveMessageAction {
  type: typeof RECEIVE_MESSAGE;
  inCurrentConversation: boolean;
  message: FinishedMessage;
}

export interface StartComposingMessageAction {
  type: typeof START_COMPOSING_MESSAGE;
  message: Message;
}

export interface CancelComposingMessageAction {
  type: typeof CANCEL_COMPOSING_MESSAGE;
  message: Message;
}

export interface UpdateWorkingMessageAction {
  type: typeof UPDATE_WORKING_MESSAGE;
  message: Message;
  messageData: Partial<Message>;
}

export interface DestroyWorkingMessageAction {
  type: typeof DESTROY_WORKING_MESSAGE;
  message: Message;
}

export interface SendWorkingMessageAction {
  type: typeof SEND_WORKING_MESSAGE;
  message: Message;
}

export interface LoadMessagesStartedAction {
  type: typeof LOAD_MESSAGES;
  state: 'started';
  contactId: number;
}

export interface LoadMessagesCompleteAction {
  type: typeof LOAD_MESSAGES;
  state: 'complete';
  messages: Message[];
  total: number;
}

export type LoadMessagesAction =
  | LoadMessagesStartedAction
  | LoadMessagesCompleteAction;

export interface UnloadOldMessagesAction {
  type: typeof UNLOAD_OLD_MESSAGES;
}

export interface SendMessagesStartedAction {
  type: typeof SEND_MESSAGES;
  messages: Message[];
  state: 'started';
}

export interface SendMessagesCompleteAction {
  type: typeof SEND_MESSAGES;
  messages: Message[];
  state: 'complete';
  responseMessages: Message[];
}

export interface SendMessagesFailedAction {
  type: typeof SEND_MESSAGES;
  messages: PendingMessage[];
  state: 'failed';
  error: string;
}

export type SendMessagesAction =
  | SendMessagesStartedAction
  | SendMessagesCompleteAction
  | SendMessagesFailedAction;

export interface ResendMessageAction {
  type: typeof RESEND_MESSAGE;
  message: Message;
}

export interface ToggleMessageExpansionAction {
  type: typeof TOGGLE_MESSAGE_EXPANSION;
  message: FinishedMessage;
}

export interface ResetMessagesAction {
  type: typeof RESET_MESSAGES;
  messages: Message[];
  total: number;
}

export interface SendMessageStart {
  state: 'started';
}

export interface SendMessageSuccess {
  state: 'complete';
  responseMessages: Message[];
}

export interface SendMessageFailure {
  state: 'failed';
  error: 'string';
}

export type SendMessageStatus =
  | SendMessageStart
  | SendMessageSuccess
  | SendMessageFailure;

export type MessageAction =
  | UnloadOldMessagesAction
  | ReceiveMessageAction
  | StartComposingMessageAction
  | CancelComposingMessageAction
  | UpdateWorkingMessageAction
  | DestroyWorkingMessageAction
  | SendWorkingMessageAction
  | SendMessagesAction
  | LoadMessagesStartedAction
  | LoadMessagesCompleteAction
  | ResetMessagesAction
  | UnloadOldMessagesAction
  | ResendMessageAction
  | ToggleMessageExpansionAction;
