import { NativeModules } from "react-native";
import invariant from "invariant";
import { merge, partialRight, evolve, pick, __, times, compose } from "ramda";
import { createSeedMessage } from "../lib/MessageUtils";
import DatabaseManager from "./DatabaseManager";

let DEFAULT_PAGE_NUMBER = 0;
let DEFAULT_MESSAGES_PER_PAGE = 50;
let ALLOWED_MESSAGE_PROPS = [
  "id",
  "senderId",
  "recipientId",
  "createdAt",
  "color",
  "width",
  "height",
  "state"
];

export let loadMessages = async _options => {
  let defaults = {
    page: DEFAULT_PAGE_NUMBER,
    per: DEFAULT_MESSAGES_PER_PAGE
  };

  let options = merge(defaults, _options);

  invariant(
    typeof options.contactId === "number",
    "Attempt to load messages with contactId of invalid type " +
      typeof options.contactId
  );

  return DatabaseManager.loadMessagesForContact(
    options.contactId,
    options.page,
    options.per
  );
};

export let storeMessage = _message => {
  let message = pick(ALLOWED_MESSAGE_PROPS, _message);
  return DatabaseManager.storeMessage(message);
};

export let getUnreadCount = userId => {
  return DatabaseManager.getUnreadCount(userId);
};

export const markConversationRead = contactId => {
  return DatabaseManager.markConversationRead(contactId);
};

export let purgeMessages = () => {
  return DatabaseManager.purgeMessages();
};

export let seedMessages = messageCount => {
  times(
    compose(
      storeMessage,
      createSeedMessage
    ),
    messageCount
  );
};
