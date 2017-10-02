import { Platform } from 'react-native';
import FCM, { FCMEvent } from 'react-native-fcm';
import { saveDeviceToken } from '../actions/NotificationActions';
import { presentInternalAlert } from '../actions/AppActions';
import createService from './createService';
import { getUnreadCount } from '../lib/DatabaseUtils';
import { receiveMessage } from '../actions/MessageActions';
import { updateUserInfo } from '../actions/AppActions';

// Notification format:

// {
//   apn: { /* ... */ },
//   fcm: { /* ... */ },
//   finish: function () {},
//   collapse_key: '',
//   google.*: 'google stuff',
//   any: '1',
//   other: 'hello',
//   keys: ''
// }

// FCM format: 

// {
//   "action": '',
//   "body": '',
//   "color": '',
//   "icon": '',
//   "tag": '',
//   "title", ''
// }

// APN format: 

// {
//   "action": '',
//   "body": '',
//   "color": '',
//   "icon": '',
//   "tag": '',
//   "title", ''
// }

let notificationServiceBase = {
  onDidInitialize: function () {
    FCM.on(FCMEvent.RefreshToken, this.onRegister);
    FCM.on(FCMEvent.Notification, this.onReceiveNotification);
    FCM.getFCMToken().then(this.onRegister);
    this.updateUnreadCount();
  },

  onDidUpdate: function (prevProps) {
    if (
      !prevProps.requestPermissions &&
      this.props.requestPermissions
    ) {
      FCM.requestPermissions();
      FCM.getFCMToken().then(this.onRegister);
    }

    if (!prevProps.appActive && this.props.appActive) {
      this.updateUnreadCount();
    }

    if (
      prevProps.route !== this.props.route &&
      (this.props.route.title === 'conversation' ||
      this.props.route.title === 'inbox')
    ) {
      // Delay before updating to prevent this
      // coinciding with navigation animation
      setTimeout(this.updateUnreadCount, 500);
    }
  },

  updateUnreadCount: async function () {
    let count = await getUnreadCount();
    this.props.dispatch(updateUserInfo({ unreadCount: count }));
    FCM.setBadgeNumber(count);
  },

  onRegister: function (token) {
    console.log('Saving device token', token);
    this.props.dispatch(saveDeviceToken(token));
  },

  onReceiveNotification: function (notification) {
    if (notification.type === 'message') {
      return this.onReceiveMessage(notification);
    }
  },

  onReceiveMessage: function (messageData) {
    let { title, data } = this.props.route;
    let { senderId } = messageData;

    if (message) {
      this.props.dispatch(receiveMessage(messageData));
    }

    if (title === 'conversation' && data.contactId === senderId) return;
    if (!this.props.appActive) return;

    let body = Platform.OS === 'ios' ?
      messageData.apn.body : messageData.fcm.body;

    this.props.dispatch(presentInternalAlert({
      type: 'message',
      message: body,
      senderId
    }));
  }
};

let notificationServiceSelector = state => {
  return {
    localNotifications: state.ui.alerts,
    appActive: state.ui.appState === 'active',
    requestPermissions: state.notifications.requestPermissions,
    route: state.navigation.route
  };
};

export default createNotificationService = store => {
  return createService(store)(notificationServiceBase, notificationServiceSelector);
};
