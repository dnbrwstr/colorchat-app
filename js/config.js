/**
 * Note: enabling seedAddressBook here will trigger
 * a contacts permissions request on app startup
 */
const config = {
  development: {
    appName: "Color Chat",
    inviteLink: "http://soft.works/colorchat",
    // serverRoot: "http://192.168.86.247:3000",
    // serverRoot: "http://192.168.1.11:3000",
    serverRoot: "https://colorchat-core.soft.works",
    logState: false,
    logActions: false,
    saveState: true,
    rehydrate: true,
    rehydrateBlacklist: [
      "ui",
      "notifications",
      "messages",
      // "theme",
      "signup",
      // "user",
      "contacts"
    ],
    seedAddressBook: false,
    seedMessages: false,
    seedMessageCount: 10
  },
  production: {
    appName: "Color Chat",
    inviteLink: "https://soft.works/colorchat",
    serverRoot: "https://colorchat-core.soft.works",
    logState: false,
    logActions: false,
    saveState: true,
    rehydrate: true,
    rehydrateBlacklist: [
      "ui",
      "navigation",
      "notifications",
      "messages",
      "signup"
    ],
    seedAddressBook: false,
    seedMessages: false,
    seedMessageCount: 10
  }
};

const key = __DEV__ ? "development" : "production";

export default config[key];
