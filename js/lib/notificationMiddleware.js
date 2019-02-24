import firebase from "react-native-firebase";
import { saveDeviceToken } from "../actions/NotificationActions";
import { presentInternalAlert } from "../actions/AppActions";
import { getUnreadCount } from "../lib/DatabaseUtils";
import { receiveMessage } from "../actions/MessageActions";
import { updateUserInfo } from "../actions/AppActions";
import { navigateToConversation } from "../actions/NavigationActions";

export default (notificationMiddleware = store => {
  const init = () => {
    firebase.messaging().onTokenRefresh(handleDeviceRegistered);
    firebase
      .messaging()
      .getToken()
      .then(handleDeviceRegistered);
    firebase.messaging().onMessage(handleNotificationReceived);
    firebase
      .notifications()
      .onNotificationDisplayed(handleNotificationReceived);
    firebase.notifications().onNotification(handleNotificationReceived);
    firebase.notifications().onNotificationOpened(handleNotificationOpened);
    updateUnreadCount();
    checkForInitialNotification();
  };

  const checkForInitialNotification = async () => {
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      // App was opened by notification
      handleNotificationOpened(notificationOpen);
    }
  };

  const updateUnreadCount = async () => {
    let count = await getUnreadCount();
    store.dispatch(updateUserInfo({ unreadCount: count }));
    firebase.notifications().setBadge(count);
  };

  const requestPermissions = () => {
    firebase.messaging().requestPermission();
    firebase
      .messaging()
      .getToken()
      .then(handleDeviceRegistered);
  };

  const handleDeviceRegistered = token => {
    store.dispatch(saveDeviceToken(token));
  };

  const handleNotificationReceived = notification => {
    if (notification.data.type !== "message") return;

    const messageData = JSON.parse(notification.data.message);

    store.dispatch(receiveMessage(messageData));

    store.dispatch(
      presentInternalAlert({
        type: "message",
        message: notification.body,
        senderId: messageData.senderId
      })
    );
  };

  const handleNotificationOpened = function(notificationOpen) {
    const notification = notificationOpen.notification;
    const message = JSON.parse(notification.data.message);
    // Handle message + navigate to conversation with sender
    store.dispatch(receiveMessage(message));
    store.dispatch(navigateToConversation(message.senderId));
  };

  return next => action => {
    next(action);

    if (action.type === "init") {
      init();
    }

    if (action.type === "triggerPermissionsDialog") {
      requestPermissions();
    }

    if (action.type === "updateUnreadCount") {
      updateUnreadCount();
    }
  };
});
