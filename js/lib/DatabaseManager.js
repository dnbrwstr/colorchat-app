import SQLite from 'react-native-sqlite-storage';
import config from '../config';

SQLite.enablePromise(true);

const ChatMessageSchema = {
  name: 'ChatMessages',
  primaryKey: 'id',
  properties: {
    id: {type: 'string', optional: true, primaryKey: true},
    senderId: {type: 'integer', optional: true},
    recipientId: {type: 'integer', optional: true},
    createdAt: {type: 'string', optional: true},
    color: {type: 'string', optional: true},
    width: {type: 'integer', optional: true},
    height: {type: 'integer', optional: true},
    state: {type: 'string', optional: true},
    colorName: {type: 'string', optional: true},
    type: {type: 'string', optional: true},
  },
};

const MigrationSchema = {
  name: 'Migrations',
  primaryKey: 'id',
  properties: {
    id: {type: 'string', optional: true, primaryKey: true},
    name: {type: 'string', optional: true},
    done: {type: 'integer', optional: true},
  },
};

const typeMigration = {
  name: 'type',
  run: _db => {
    const query = `ALTER TABLE ${ChatMessageSchema.name} ADD 'type' string`;
    return _db.executeSql(query);
  },
};

let _db;

const getDb = async () => {
  if (!_db) {
    _db = await SQLite.openDatabase({
      name: 'colorchat.db',
    });

    await _db.executeSql(getCreateTableQuery(ChatMessageSchema));
    await _db.executeSql(getCreateTableQuery(MigrationSchema));
    await runMigration(typeMigration, _db);
  }
  return _db;
};

const runMigration = async (migration, _db) => {
  const query = `
    SELECT * FROM ${MigrationSchema.name} 
    WHERE name='${migration.name}'
  `;
  const result = await _db.executeSql(query);
  if (result[0].rows.length === 0) {
    try {
      await migration.run(_db);
      const saveMigrationQuery = `
        INSERT OR REPLACE INTO ${MigrationSchema.name}('name', 'done')
        VALUES('${migration.name}', 1)
      `;
      return _db.executeSql(saveMigrationQuery);
    } catch (e) {
      console.log('Unable to run migration :(');
    }
  }
};

const getSqlForProperty = prop => {
  let sql = `${prop.name} ${prop.type}`;
  if (prop.primaryKey) sql += ' primary key';
  if (!prop.optional) sql += ' not null';
  return sql;
};

const getCreateTableQuery = schema => {
  const {name, properties} = schema;
  const props = Object.keys(properties).map(k => ({
    name: k,
    ...properties[k],
  }));

  return `create table if not exists ${name}(${props
    .map(getSqlForProperty)
    .join(',\n')})`;
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
  return results[0].rows.item(0)['count(*)'];
};

const getConversationQuery = (userId, contactId) => {
  if (userId === contactId)
    return `
      WHERE senderId=${contactId} 
      AND recipientId=${contactId}
      `;
  else
    return `
      WHERE senderId='${contactId}'
      OR recipientId='${contactId}'
    `;
};

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
      total: totalCount,
    };
  },

  async storeMessage(message) {
    const props = ChatMessageSchema.properties;

    const columns = Object.keys(ChatMessageSchema.properties).filter(
      k => typeof message[k] !== 'undefined',
    );

    const values = columns.map(c => {
      if (c === 'createdAt') return `'${new Date(message[c]).toISOString()}'`;
      else return `'${message[c]}'`;
    });

    const db = await getDb();

    await db.executeSql(`
      INSERT OR REPLACE INTO ChatMessages(${columns.join(',')})
      VALUES(${values.join(',')})
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
    return executeSql(`DELETE FROM ChatMessages`);
  },
};

export default DatabaseManager;
