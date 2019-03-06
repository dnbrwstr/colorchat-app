import firebase from "react-native-firebase";
import { saveDeviceToken } from "../actions/NotificationActions";
import { getUnreadCount } from "../lib/DatabaseUtils";
import { receiveMessage } from "../actions/MessageActions";
import { updateUserInfo } from "../actions/AppActions";
import { navigateToConversation } from "../actions/NavigationActions";
import NavigationService from "./NavigationService";
import DatabaseManager from "./DatabaseManager";

const CHANNEL_ID = "colorchat-channel";

export default (notificationMiddleware = store => {
  const channel = new firebase.notifications.Android.Channel(
    CHANNEL_ID,
    "Color Chat Channel",
    firebase.notifications.Android.Importance.Max
  ).setDescription("Notification channel for Color Chat");
  firebase.notifications().android.createChannel(channel);

  const init = async () => {
    firebase.messaging().onTokenRefresh(handleDeviceRegistered);
    firebase.messaging().onMessage(handleNotificationReceived);
    firebase.notifications().onNotification(handleNotificationReceived);
    firebase.notifications().onNotificationOpened(handleNotificationOpened);
    updateUnreadCount();
    const hasPermission = await firebase.messaging().hasPermission();
    if (hasPermission) saveToken();
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

  const markConversationRead = async contactId => {
    await DatabaseManager.markConversationRead(contactId);
    return updateUnreadCount();
  };

  const updateUnreadCount = async () => {
    const userId = store.getState().user.id;
    const count = await getUnreadCount(userId);
    store.dispatch(updateUserInfo({ unreadCount: count }));
    firebase.notifications().setBadge(count);
  };

  const requestPermissions = () => {
    firebase.messaging().requestPermission();
    saveToken();
  };

  const saveToken = () => {
    firebase
      .messaging()
      .getToken()
      .then(handleDeviceRegistered);
  };

  const handleDeviceRegistered = token => {
    store.dispatch(saveDeviceToken(token));
  };

  const handleNotificationReceived = async notification => {
    if (notification.data.type !== "message") return;

    const messageData = JSON.parse(notification.data.message);

    store.dispatch(receiveMessage(messageData));

    const state = store.getState();
    const currentRoute = NavigationService.getCurrentRoute();

    // Present notification only if we're not already in the conversation with that contact
    if (
      currentRoute.routeName !== "conversation" ||
      state.ui.conversation.contactId != messageData.senderId
    ) {
      const localNotification = new firebase.notifications.Notification()
        .setTitle(notification._title)
        .setBody(notification._body)
        .setData(notification._data)
        .setSound("default");

      localNotification.android.setSmallIcon("ic_notification");
      localNotification.android.setChannelId(CHANNEL_ID);
      firebase.notifications().displayNotification(localNotification);
    }
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
    } else if (action.type === "triggerPermissionsDialog") {
      requestPermissions();
    } else if (action.type === "updateUnreadCount") {
      updateUnreadCount();
    } else if (action.type === "markConversationRead") {
      markConversationRead(action.contactId);
    } else if (action.type === "checkForInitialNotification") {
      checkForInitialNotification();
    }
  };
});
