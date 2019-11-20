import SQLite from 'react-native-sqlite-storage';
import config from '../config';
import {FinishedMessage} from '../store/messages/types';

SQLite.enablePromise(true);

interface SchemaProp {
  type: string;
  optional: boolean;
  primaryKey?: boolean;
}

interface Schema {
  name: string;
  primaryKey: string;
  properties: {
    [key: string]: SchemaProp;
  };
}

interface Migration {
  name: string;
  run: (db: SQLite.SQLiteDatabase) => void;
}

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
} as const;

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
  run: (_db: SQLite.SQLiteDatabase) => {
    const query = `ALTER TABLE ${ChatMessageSchema.name} ADD 'type' string`;
    return _db.executeSql(query);
  },
};

let _db: SQLite.SQLiteDatabase;

const getDb = async () => {
  if (!_db) {
    _db = await SQLite.openDatabase({
      name: 'colorchat.db',
      location: 'default',
    });

    await _db.executeSql(getCreateTableQuery(ChatMessageSchema));
    await _db.executeSql(getCreateTableQuery(MigrationSchema));
    await runMigration(typeMigration, _db);
  }
  return _db;
};

const runMigration = async (
  migration: Migration,
  _db: SQLite.SQLiteDatabase,
) => {
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

const getSqlForProperty = (prop: SchemaProp & {name: string}) => {
  let sql = `${prop.name} ${prop.type}`;
  if (prop.primaryKey) sql += ' primary key';
  if (!prop.optional) sql += ' not null';
  return sql;
};

const getCreateTableQuery = (schema: Schema) => {
  const {name, properties} = schema;
  const props = Object.keys(properties).map(k => ({
    name: k,
    ...properties[k],
  }));

  return `create table if not exists ${name}(${props
    .map(getSqlForProperty)
    .join(',\n')})`;
};

const executeSql = async (query: string) => {
  const startTime = new Date().getTime();
  const db = await getDb();
  const results = await db.executeSql(query);
  if (config.logQueries) {
    const duration = new Date().getTime() - startTime;
    console.log(`Took ${duration}ms to execute${query}`);
  }
  return results;
};

const runQuery = async (query: string) => {
  const results = await executeSql(query);
  // @ts-ignore Raw does exist!!!
  return results[0].rows.raw();
};

const runCountQuery = async (query: string) => {
  const results = await executeSql(query);
  return results[0].rows.item(0)['count(*)'];
};

const getConversationQuery = (userId: number, contactId: number) => {
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
  async loadMessagesForContact(
    userId: number,
    contactId: number,
    page: number,
    per: number,
  ) {
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

  async storeMessage(message: FinishedMessage) {
    const props = ChatMessageSchema.properties;
    const messageKeys = Object.keys(
      props,
    ) as (keyof typeof ChatMessageSchema.properties)[];

    const columns = messageKeys.filter(k => typeof message[k] !== 'undefined');

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

  async markConversationRead(userId: number, contactId: number) {
    return runQuery(`
      UPDATE ChatMessages 
      SET state='complete' 
      ${getConversationQuery(userId, contactId)} AND (state='fresh')
    `);
  },

  async getUnreadCount(userId: number) {
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
