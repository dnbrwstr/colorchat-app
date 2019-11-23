import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {
  createStackNavigator,
  NavigationStackConfig,
} from 'react-navigation-stack';
import SignupStartScreen from './SignupStartScreen';
import CountryPickerScreen from './CountryPickerScreen';
import ConfirmCodeScreen from './ConfirmCodeScreen';
import SignupNotificationsScreen from './SignupNotificationsScreen';
import ConversationScreen from './ConversationScreen';
import WelcomeScreen from './WelcomeScreen';
import InboxScreen from './InboxScreen';
import ContactsScreen from './ContactsScreen';
import SettingsScreen from './SettingsScreen';
import AboutScreen from './AboutScreen';
import NumberInfoScreen from './NumberInfoScreen';
import ContactsInfoScreen from './ContactsInfoScreen';
import AuthCheckScreen from './AuthCheckScreen';
import CameraScreen from './CameraScreen';
import ConversationSettingsScreen from './ConversationSettingsScreen';
import BlockedUsersScreen from './BlockedUsersScreen';

const defaultStackOptions: NavigationStackConfig = {
  headerMode: 'none',
};

const AppStack = createStackNavigator(
  {
    inbox: {
      screen: InboxScreen,
    },
    contacts: {
      screen: ContactsScreen,
    },
    contactsInfo: {
      screen: ContactsInfoScreen,
    },
    conversation: {
      screen: ConversationScreen,
    },
    conversationSettings: {
      screen: ConversationSettingsScreen,
    },
    settings: {
      screen: SettingsScreen,
    },
    blockedUsers: {
      screen: BlockedUsersScreen,
    },
    about: {
      screen: AboutScreen,
    },
    camera: {
      screen: CameraScreen,
    },
  },
  {
    ...defaultStackOptions,
    initialRouteName: 'inbox',
  },
);

const AuthStack = createStackNavigator(
  {
    welcome: {
      screen: WelcomeScreen,
    },
    signup: {
      screen: SignupStartScreen,
    },
    numberInfo: {
      screen: NumberInfoScreen,
    },
    countryPicker: {
      screen: CountryPickerScreen,
    },
    confirmCode: {
      screen: ConfirmCodeScreen,
    },
    notifications: {
      screen: SignupNotificationsScreen,
    },
  },
  {
    ...defaultStackOptions,
    initialRouteName: 'welcome',
  },
);

const Navigator = createSwitchNavigator(
  {
    authCheck: AuthCheckScreen,
    mainApp: createStackNavigator(
      {
        app: AppStack,
        auth: AuthStack,
      },
      {
        initialRouteName: 'auth',
        ...defaultStackOptions,
        defaultNavigationOptions: {
          gesturesEnabled: false,
        },
      },
    ),
  },
  {
    initialRouteName: 'authCheck',
    ...defaultStackOptions,
  },
);

export default createAppContainer(Navigator);
