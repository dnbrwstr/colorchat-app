import { AsyncStorage } from "react-native";
import DatabaseManager from "./DatabaseManager";

const ChatMessageSchema = {
  name: "ChatMessage",
  primaryKey: "id",
  properties: {
    id: { type: "string", optional: true },
    senderId: { type: "int", optional: true },
    recipientId: { type: "int", optional: true },
    createdAt: { type: "date", optional: true },
    color: { type: "string", optional: true },
    width: { type: "int", optional: true },
    height: { type: "int", optional: true },
    state: { type: "string", optional: true }
  }
};

export const tryConvertToSql = async () => {
  const convertedToSql = await AsyncStorage.getItem("convertedToSql");
  if (convertedToSql) return;

  const Realm = require("realm");
  const realm = await Realm.open({ schema: [ChatMessageSchema] });
  const messages = realm.objects("ChatMessage");

  messages.forEach(async m => {
    const messageData = toPlainObject(m);
    await DatabaseManager.storeMessage(messageData);
  });

  await AsyncStorage.setItem("convertedToSql", "true");
};

const toPlainObject = message => {
  return Object.keys(ChatMessageSchema.properties).reduce((memo, k) => {
    if (ChatMessageSchema.properties[k].type === "date") {
      memo[k] = message[k].toString();
    } else {
      memo[k] = message[k];
    }
    return memo;
  }, {});
};
