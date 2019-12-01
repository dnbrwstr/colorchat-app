import firebase, {RNFirebase} from 'react-native-firebase';
import {MiddlewareAPI, Dispatch, AnyAction, Action} from 'redux';
import {saveDeviceToken} from '../notifications/actions';
import {getUnreadCount} from '../../lib/DatabaseUtils';
import {receiveMessage} from '../messages/actions';
import {updateUserInfo} from '../user/actions';
import {navigateToConversation} from '../navigation/actions';
import NavigationService from '../../lib/NavigationService';
import {ThunkMiddleware, ThunkDispatch, ThunkAction} from 'redux-thunk';
import {AppState} from '../createStore';
import {
  TRIGGER_PERMISSIONS_DIALOG,
  CHECK_FOR_INITIAL_NOTIFICATION,
} from '../notifications/types';
import {UPDATE_CONVERSATION_UI} from '../ui/types';
import {MARK_CONVERSATION_READ} from '../conversations/types';

const CHANNEL_ID = 'colorchat-channel';

const notificationMiddleware = (
  store: MiddlewareAPI<ThunkDispatch<AppState, undefined, Action<string>>>,
) => {
  const channel = new firebase.notifications.Android.Channel(
    CHANNEL_ID,
    'Color Chat Channel',
    firebase.notifications.Android.Importance.Max,
  ).setDescription('Notification channel for Color Chat');
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

  const markConversationRead = () => {
    return updateUnreadCount();
  };

  const updateUnreadCount = async () => {
    const userId = store.getState().user.id;
    const count = await getUnreadCount(userId);
    store.dispatch(updateUserInfo({unreadCount: count}));
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

  const handleDeviceRegistered = (token: string) => {
    store.dispatch(saveDeviceToken(token));
  };

  const handleNotificationReceived = async (
    notification: RNFirebase.notifications.Notification,
  ) => {
    if (notification.data.type !== 'message') return;

    const messageData = JSON.parse(notification.data.message);

    store.dispatch(receiveMessage(messageData));

    const state = store.getState();
    const currentRoute = NavigationService.getCurrentRoute();

    // Present notification only if we're not already in the conversation with that contact
    if (
      currentRoute?.routeName !== 'conversation' ||
      state.ui.conversation.contactId != messageData.senderId
    ) {
      const localNotification = new firebase.notifications.Notification()
        .setTitle(notification.title)
        .setBody(notification.body)
        .setData(notification.data)
        .setSound('default');

      localNotification.android.setSmallIcon('ic_notification');
      localNotification.android.setChannelId(CHANNEL_ID);
      firebase.notifications().displayNotification(localNotification);
    }
  };

  const handleNotificationOpened = (
    notificationOpen: RNFirebase.notifications.NotificationOpen,
  ) => {
    const notification = notificationOpen.notification;
    const message = JSON.parse(notification.data.message);
    // Handle message + navigate to conversation with sender
    store.dispatch(receiveMessage(message));
    store.dispatch(navigateToConversation(message.senderId));
  };

  return (next: Dispatch) => (action: AnyAction) => {
    next(action);

    if (action.type === 'init') {
      init();
    } else if (action.type === TRIGGER_PERMISSIONS_DIALOG) {
      requestPermissions();
    } else if (action.type === UPDATE_CONVERSATION_UI) {
      updateUnreadCount();
    } else if (action.type === MARK_CONVERSATION_READ) {
      markConversationRead();
    } else if (action.type === CHECK_FOR_INITIAL_NOTIFICATION) {
      checkForInitialNotification();
    }
  };
};

export default notificationMiddleware;
