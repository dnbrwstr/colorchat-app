import {AppState} from './store/createStore';

/**
 * Note: enabling seedAddressBook here will trigger
 * a contacts permissions request on app startup
 */
export type AppConfig = {
  appName: string;
  screenshotMode: boolean;
  inviteLink: string;
  serverRoot: string;
  logState: boolean;
  logActions: boolean;
  logQueries: boolean;
  saveState: boolean;
  rehydrate: boolean;
  rehydrateBlacklist: (keyof AppState)[];
  seedAddressBook: boolean;
  seedMessages: boolean;
  seedMessageCount: number;
};

interface ConfigList {
  development: AppConfig;
  production: AppConfig;
}

const config: ConfigList = {
  development: {
    appName: 'Color Chat',
    screenshotMode: false,
    inviteLink: 'http://soft.works/colorchat',
    // serverRoot: 'http://192.168.86.247:3000',
    // serverRoot: "http://192.168.1.11:3000",
    serverRoot: 'https://colorchat-core.soft.works',
    logState: false,
    logActions: false,
    saveState: true,
    rehydrate: true,
    logQueries: false,
    rehydrateBlacklist: [
      // 'ui',
      'notifications',
      // "messages",
      'theme',
      'signup',
      // "user",
      // "contacts"
    ],
    seedAddressBook: false,
    seedMessages: false,
    seedMessageCount: 10,
  },
  production: {
    appName: 'Color Chat',
    screenshotMode: false,
    inviteLink: 'https://soft.works/colorchat',
    serverRoot: 'https://colorchat-core.soft.works',
    logState: false,
    logActions: false,
    logQueries: false,
    saveState: true,
    rehydrate: true,
    rehydrateBlacklist: ['ui', 'notifications', 'messages', 'signup'],
    seedAddressBook: false,
    seedMessages: false,
    seedMessageCount: 10,
  },
};

const key = __DEV__ ? 'development' : 'production';

export default config[key];
