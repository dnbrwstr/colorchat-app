/**
 * Note: enabling seedAddressBook here will trigger
 * a contacts permissions request on app startup
 */
export default {
  serverRoot: 'http://192.168.1.5:3000',
  logState: false,
  saveState: true,
  rehydrate: true,
  rehydrateBlacklist: [],
  seedAddressBook: true,
  seedMessages: false
};
