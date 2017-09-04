/**
 * Note: enabling seedAddressBook here will trigger
 * a contacts permissions request on app startup
 */
export default {
  appName: 'ColorChat',
  inviteLink: 'http://appstore.com/colorchatbysoft',
  serverRoot: 'http://10.0.2.2:3000',
  logState: false,
  logActions: false,
  saveState: true,
  rehydrate: true,
  rehydrateBlacklist: ['ui', 'navigation', 'notifications', 'messages'],
  seedAddressBook: true,
  seedMessages: false,
  seedMessageCount: 10
};
