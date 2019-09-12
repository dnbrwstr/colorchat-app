import { Dimensions } from "react-native";
import { merge } from "ramda";
import { rand } from "./Utils";

export const MessageType = {
  Picture: "picture"
};

export let generateId = () =>
  Math.floor(Math.random() * Math.pow(10, 10)).toString(16);

export let createMessage = data => {
  return merge(
    {
      clientId: generateId(),
      clientTimestamp: new Date().toJSON(),
      state: "composing",
      expanded: false,
      color: "#CCC",
      width: 240,
      height: 150
    },
    data
  );
};

export let createSeedMessage = () => {
  let senderId = Math.floor(Math.random() * 2) + 1;
  let recipientId = senderId === 1 ? 2 : 1;

  return createMessage({
    id: generateId(),
    createdAt: new Date().toJSON(),
    senderId: senderId,
    relativeWidth: Math.random() * 0.8 + 0.3,
    relativeHeight: Math.random() / 2 + 0.05,
    recipientId: recipientId,
    color: `hsl(${rand(360)}, 75%, ${rand(100)}%)`,
    state: "complete"
  });
};

export let getTimestamp = message =>
  message.createdAt || message.clientTimestamp;

export const convertToRelativeSize = message => {
  const relativeWidth = message.width / Dimensions.get("window").width;
  const relativeHeight = (relativeWidth / message.width) * message.height;
  return {
    ...message,
    relativeWidth: relativeWidth.toFixed(4),
    relativeHeight: relativeHeight.toFixed(4)
  };
};

export const convertFromRelativeSize = message => {
  const { relativeWidth, relativeHeight } = message;
  if (!relativeWidth || !relativeHeight) return message;
  const width = Dimensions.get("window").width * relativeWidth;
  const height = Dimensions.get("window").width * relativeHeight;
  return {
    ...message,
    width,
    height
  };
};
