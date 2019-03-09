import SQLite from "react-native-sqlite-storage";
import config from "../config";

SQLite.enablePromise(true);

const ChatMessageSchema = {
  name: "ChatMessages",
  primaryKey: "id",
  properties: {
    id: { type: "string", optional: true, primaryKey: true },
    senderId: { type: "integer", optional: true },
    recipientId: { type: "integer", optional: true },
    createdAt: { type: "string", optional: true },
    color: { type: "string", optional: true },
    width: { type: "integer", optional: true },
    height: { type: "integer", optional: true },
    state: { type: "string", optional: true },
    colorName: { type: "string", optional: true }
  }
};

let _db;

const getDb = async () => {
  if (!_db) {
    _db = await SQLite.openDatabase({
      name: "colorchat.db"
    });

    await createMessageTable(_db);
  }
  return _db;
};

const getSqlForProperty = prop => {
  let sql = `${prop.name} ${prop.type}`;
  if (prop.primaryKey) sql += " primary key";
  if (!prop.optional) sql += " not null";
  return sql;
};

const createMessageTable = async db => {
  const { name, properties } = ChatMessageSchema;
  const props = Object.keys(properties).map(k => ({
    name: k,
    ...properties[k]
  }));

  const query = `create table if not exists ${name}(${props
    .map(getSqlForProperty)
    .join(",\n")})`;

  await db.executeSql(query);
};

const executeSql = async query => {
  const startTime = new Date();
  const db = await getDb();
  const results = await db.executeSql(query);
  if (config.logQueries) {
    const duration = new Date() - startTime;
    console.log(`Took ${duration}ms to execute${query}`);
  }
  return results;
};

const runQuery = async query => {
  const results = await executeSql(query);
  return results[0].rows.raw();
};

const runCountQuery = async query => {
  const results = await executeSql(query);
  return results[0].rows.item(0)["count(*)"];
};

const getConversationQuery = (userId, contactId) => `
  WHERE senderId='${contactId}'
  OR (senderId='${userId}' AND recipientId='${contactId}')
`;

const DatabaseManager = {
  async loadMessagesForContact(userId, contactId, page, per) {
    const results = await runQuery(`
      SELECT * from ChatMessages 
      ${getConversationQuery(userId, contactId)}
      ORDER BY datetime(createdAt) DESC
      LIMIT ${per}
      OFFSET ${page * per}
    `);

    const totalCount = await runCountQuery(`
      SELECT count(*) from ChatMessages 
      ${getConversationQuery(userId, contactId)}
    `);

    return {
      messages: results,
      total: totalCount
    };
  },

  async storeMessage(message) {
    const props = ChatMessageSchema.properties;

    const columns = Object.keys(ChatMessageSchema.properties).filter(
      k => typeof message[k] !== "undefined"
    );

    const values = columns.map(c => {
      if (c === "createdAt") return `'${new Date(message[c]).toISOString()}'`;
      else return `'${message[c]}'`;
    });

    const db = await getDb();

    await db.executeSql(`
      INSERT OR REPLACE INTO ChatMessages(${columns.join(",")})
      VALUES(${values.join(",")})
    `);

    return message;
  },

  async markConversationRead(userId, contactId) {
    return runQuery(`
      UPDATE ChatMessages 
      SET state='complete' 
      ${getConversationQuery(userId, contactId)} AND (state='fresh')
    `);
  },

  async getUnreadCount(userId) {
    return await runCountQuery(`
      SELECT count(*) from ChatMessages 
      WHERE recipientId=${userId} AND state="fresh"
    `);
  },

  async purgeMessages() {
    return db.executeSql(`TRUNCATE TABLE ChatMessages`);
  }
};

export default DatabaseManager;
