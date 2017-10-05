/**
 * Note: enabling seedAddressBook here will trigger
 * a contacts permissions request on app startup
 */
export default {
  appName: 'ColorChat',
  inviteLink: 'http://soft.works/colorchat',
  serverRoot: 'http://colorchat-server.color.slow.so',
  logState: false,
  logActions: false,
  saveState: true,
  rehydrate: true,
  rehydrateBlacklist: ['ui', 'navigation', 'notifications', 'messages'],
  seedAddressBook: true,
  seedMessages: false,
  seedMessageCount: 10
};
