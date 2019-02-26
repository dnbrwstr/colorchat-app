import Realm from "realm";

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

let _realm;

const toPlainObjects = messageArray => messageArray.map(toPlainObject);

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

const DatabaseManager = {
  async loadMessagesForContact(contactId, page, per) {
    const realm = await this.getRealm();
    const allMessages = await this.getChatMessages();
    const messages = allMessages
      .filtered(`senderId=${contactId} OR recipientId=${contactId}`)
      .sorted("createdAt", true)
      .slice(page * per, per);

    realm.write(() => {
      messages.forEach(m => {
        if (m.state === "fresh") m.state === "complete";
      });
    });

    return {
      messages: toPlainObjects(messages),
      total: allMessages.length
    };
  },

  async storeMessage(message) {
    const realm = await this.getRealm();
    return realm.write(() => {
      realm.create(
        "ChatMessage",
        {
          ...message,
          createdAt: new Date(message.createdAt)
        },
        true
      );
    });
  },

  async markConversationRead(contactId) {
    const realm = await this.getRealm();
    const allMessages = await this.getChatMessages();
    const unreadMessages = allMessages.filtered(
      `senderId=${contactId} AND state="fresh"`
    );
    return Promise.all(
      unreadMessages.map(m => realm.write(() => (m.state = "complete")))
    );
  },

  async getUnreadCount(userId) {
    const allMessages = await this.getChatMessages();
    return allMessages.filtered(`recipientId=${userId} AND state="fresh"`)
      .length;
  },

  async purgeMessages() {
    const realm = await this.getRealm();
    const allMessages = await this.getChatMessages();
    return realm.write(() => {
      realm.delete(allMessages);
    });
  },

  async getChatMessages() {
    const realm = await this.getRealm();
    return realm.objects("ChatMessage");
  },

  async getRealm() {
    if (_realm) return Promise.resolve(_realm);
    else
      return Realm.open({ schema: [ChatMessageSchema] }).then(openedRealm => {
        _realm = openedRealm;
        return _realm;
      });
  }
};

export default DatabaseManager;
