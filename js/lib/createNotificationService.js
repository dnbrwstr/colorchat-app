import React from 'react-native';
import { saveDeviceToken } from '../actions/AppActions';
import createService from './createService';

let {
  PushNotificationIOS
} = React;

let notificationServiceSelector = state => state.navigation;

let notificationServiceBase = {
  onDidInitialize: function () {
    PushNotificationIOS.addEventListener('register', this.onRegister);
    PushNotificationIOS.addEventListener('notification', this.onReceiveNotification);
    PushNotificationIOS.addEventListener('error', this.onError);
  },

  onDidUpdate: function (prevProps) {
    PushNotificationIOS.requestPermissions();
  },

  onRegister: function () {
    this.props.dispatch(saveDeviceToken(token));
  },

  onReceiveNotification: function () {

  },

  onError: function () {
    console.log(e);
  }
}

export default createSocketService = store => {
  return createService(store)(notificationServiceBase, notificationServiceSelector);
}