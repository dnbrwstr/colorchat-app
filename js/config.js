/**
 * Note: enabling seedAddressBook here will trigger
 * a contacts permissions request on app startup
 */
const config = {
  development: {
    appName: "Color Chat",
    inviteLink: "http://soft.works/colorchat",
    serverRoot: "http://192.168.1.3:3000",
    logState: false,
    logActions: false,
    saveState: true,
    rehydrate: true,
    rehydrateBlacklist: ["ui", "navigation", "notifications", "messages"],
    seedAddressBook: false,
    seedMessages: false,
    seedMessageCount: 10
  },
  production: {
    appName: "Color Chat",
    inviteLink: "http://soft.works/colorchat",
    serverRoot: "http://colorchat-server.color.slow.so",
    logState: false,
    logActions: false,
    saveState: true,
    rehydrate: true,
    rehydrateBlacklist: ["ui", "navigation", "notifications", "messages"],
    seedAddressBook: false,
    seedMessages: false,
    seedMessageCount: 10
  }
};

const key = __DEV__ ? "development" : "production";

export default config[key];
