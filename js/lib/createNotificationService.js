import React from 'react-native';
import { saveDeviceToken } from '../actions/NotificationActions';
import { presentInternalAlert } from '../actions/AppActions';
import createService from './createService';

let {
  PushNotificationIOS
} = React;

let notificationServiceBase = {
  onDidInitialize: function () {
    PushNotificationIOS.addEventListener('register', this.onRegister);
    PushNotificationIOS.addEventListener('notification', this.onReceiveNotification);
    PushNotificationIOS.setApplicationIconBadgeNumber(this.props.unreadCount);
  },

  onDidUpdate: function (prevProps) {
    if (!prevProps.requestPermissions && this.props.requestPermissions) {
      PushNotificationIOS.requestPermissions();
    }

    if (prevProps.unreadCount !== this.props.unreadCount) {
      PushNotificationIOS.setApplicationIconBadgeNumber(this.props.unreadCount);
    }
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
    let { title, data } = this.props.currentRoute;
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
    requestPermissions: state.notifications.requestPermissions,
    currentRoute: state.navigation.route,
    unreadCount: state.messages.static.filter(m => m.state === 'fresh').length
  };
};

export default createSocketService = store => {
  return createService(store)(notificationServiceBase, notificationServiceSelector);
};
