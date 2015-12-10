import React from 'react-native';
import { saveDeviceToken } from '../actions/NotificationActions';
import { presentInternalAlert } from '../actions/AppActions';
import createService from './createService';
import { getUnreadCount } from './DatabaseUtils';

let {
  PushNotificationIOS,
  NativeModules
} = React;

let { ParseBridge } = NativeModules;

let notificationServiceBase = {
  onDidInitialize: function () {
    PushNotificationIOS.addEventListener('register', this.onRegister);
    PushNotificationIOS.addEventListener('notification', this.onReceiveNotification);
    this.updateUnreadCount();
  },

  onDidUpdate: function (prevProps) {
    if (!prevProps.requestPermissions && this.props.requestPermissions) {
      PushNotificationIOS.requestPermissions();
    }

    if (!prevProps.appActive && this.props.appActive) {
      this.updateUnreadCount();
    }

    if (prevProps.route !== this.props.route &&
        (this.props.route.title === 'conversation' ||
        this.props.route.title === 'inbox')) {
      // Delay before updating to prevent this
      // coinciding with navigation animation
      setTimeout(this.updateUnreadCount, 500);
    }
  },

  updateUnreadCount: async function () {
    let count = await getUnreadCount();
    ParseBridge.setBadgeCount(count);
  },

  onRegister: function (token) {
    this.props.dispatch(saveDeviceToken(token));
  },

  onReceiveNotification: function (notification) {
    if (notification._data.type === 'message') {
      return this.onReceiveMessage(notification);
    }
  },

  onReceiveMessage: function (message) {
    let { title, data } = this.props.route;
    let senderId = message._data.senderId;
    if (title === 'conversation' && data.contactId === senderId) return;

    this.props.dispatch(presentInternalAlert({
      type: 'message',
      message: message._alert,
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

export default createSocketService = store => {
  return createService(store)(notificationServiceBase, notificationServiceSelector);
};
