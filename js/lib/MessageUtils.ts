import {Dimensions} from 'react-native';
import {rand} from './Utils';
import {
  Message,
  WorkingMessage,
  FinishedMessage,
  RawMessageData,
  MessageType,
  ConvertedMessageData,
} from '../store/messages/types';
import {User} from '../store/user/types';
import {StoredMessage} from './DatabaseManager';

export const getReferenceDate = (message: Message) => {
  return new Date(getTimestamp(message));
};

export const getTimestamp = (message: Message): string => {
  return (
    (message as FinishedMessage).createdAt ||
    (message as WorkingMessage).clientTimestamp
  );
};

export const getId = (message: Message): string => {
  return (
    (message as FinishedMessage).id || (message as WorkingMessage).clientId
  );
};

export const isExpanded = (message: Message) => {
  return !!(message as FinishedMessage).expanded;
};

const isDefined = <T>(n: T) => typeof n !== 'undefined';

export const isFromUser = (user: User, message: Message) => {
  return (
    isDefined(user.id) && (message as FinishedMessage).recipientId !== user.id
  );
};

export const generateId = () =>
  Math.floor(Math.random() * Math.pow(10, 10)).toString(16);

export const createMessage = (
  data: {recipientId: number} & Partial<WorkingMessage>,
): WorkingMessage => {
  return {
    state: 'working',
    clientId: generateId(),
    clientTimestamp: new Date().toJSON(),
    color: '#CCC',
    width: 240,
    height: 150,
    type: MessageType.Default,
    ...data,
  };
};

export const createSeedMessage = (): StoredMessage => {
  const senderId = Math.floor(Math.random() * 2) + 1;
  const recipientId = senderId === 1 ? 2 : 1;
  const size = Dimensions.get('window');
  const relativeWidth = Math.random() * 0.8 + 0.3;
  const relativeHeight = Math.random() / 2 + 0.05;
  return {
    id: generateId(),
    state: 'static',
    createdAt: new Date().toJSON(),
    senderId: senderId,
    recipientId: recipientId,
    width: relativeWidth * size.width,
    height: relativeHeight * size.height,
    color: `hsl(${rand(360)}, 75%, ${rand(100)}%)`,
    colorName: 'Fake Color',
    type: MessageType.Default,
  };
};

export const convertToRelativeSize = (message: Message) => {
  const relativeWidth = message.width / Dimensions.get('window').width;
  const relativeHeight = (relativeWidth / message.width) * message.height;
  return {
    ...message,
    relativeWidth: relativeWidth.toFixed(4),
    relativeHeight: relativeHeight.toFixed(4),
  };
};

export const convertFromRelativeSize = (
  message: RawMessageData,
): ConvertedMessageData => {
  const {relativeWidth, relativeHeight} = message;
  const width = Dimensions.get('window').width * relativeWidth;
  const height = Dimensions.get('window').width * relativeHeight;
  return {
    ...message,
    width: Math.round(width),
    height: Math.round(height),
  };
};

export const getAbsoluteSize = ({
  relativeWidth,
  relativeHeight,
}: {
  relativeWidth: number;
  relativeHeight: number;
}): {width: number; height: number} => {
  const width = Dimensions.get('window').width * relativeWidth;
  const height = Dimensions.get('window').width * relativeHeight;
  return {
    width,
    height,
  };
};
