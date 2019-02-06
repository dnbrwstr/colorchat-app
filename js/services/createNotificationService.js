import { Platform } from "react-native";
import firebase from "react-native-firebase";
import { saveDeviceToken } from "../actions/NotificationActions";
import { presentInternalAlert } from "../actions/AppActions";
import createService from "./createService";
import { getUnreadCount } from "../lib/DatabaseUtils";
import { receiveMessage } from "../actions/MessageActions";
import { updateUserInfo } from "../actions/AppActions";

let notificationServiceBase = {
  onDidInitialize: function() {
    firebase.messaging().onTokenRefresh(this.onRegister);
    firebase
      .messaging()
      .getToken()
      .then(this.onRegister);
    firebase.messaging().onMessage(this.onReceiveNotification);
    firebase
      .notifications()
      .onNotificationDisplayed(this.onReceiveNotification);
    firebase.notifications().onNotification(this.onReceiveNotification);
    this.updateUnreadCount();
  },

  checkForInitialNotification: async function() {
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      // App was opened by notification
      const action = notificationOpen.action;
      const notification = notificationOpen.notification;
      // Handle message + navigate to conversation with sender
      this.props.dispatch(receiveMessage(notification.data.message));
      this.props.dispatch(
        navigateToConversation(notification.data.message.senderId)
      );
    }
  },

  onDidUpdate: function(prevProps) {
    if (!prevProps.requestPermissions && this.props.requestPermissions) {
      firebase.messaging().requestPermission();
      firebase
        .messaging()
        .getToken()
        .then(this.onRegister);
    }

    if (!prevProps.appActive && this.props.appActive) {
      this.updateUnreadCount();
    }

    if (
      prevProps.route !== this.props.route &&
      (this.props.route.title === "conversation" ||
        this.props.route.title === "inbox")
    ) {
      // Delay before updating to prevent this
      // coinciding with navigation animation
      setTimeout(this.updateUnreadCount, 500);
    }
  },

  updateUnreadCount: async function() {
    let count = await getUnreadCount();
    this.props.dispatch(updateUserInfo({ unreadCount: count }));
    firebase.notifications().setBadge(count);
  },

  onRegister: function(token) {
    console.log("Saving device token", token);
    this.props.dispatch(saveDeviceToken(token));
  },

  onReceiveNotification: function(notification) {
    if (notification.data.type !== "message") return;

    console.log("Got notification", notification);

    const messageData = notification.data.message;

    this.props.dispatch(receiveMessage(messageData));

    if (!this.props.appActive) return;

    this.props.dispatch(
      presentInternalAlert({
        type: "message",
        message: notification.body,
        senderId: messageData.senderId
      })
    );
  }
};

let notificationServiceSelector = state => {
  return {
    localNotifications: state.ui.alerts,
    requestPermissions: state.notifications.requestPermissions
  };
};

export default (createNotificationService = store => {
  return createService(store)(
    notificationServiceBase,
    notificationServiceSelector
  );
});
