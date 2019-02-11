import { createStackNavigator, createSwitchNavigator, createAppContainer } from "react-navigation";
import SignupStartScreen from "../components/SignupStartScreen";
import CountryPickerScreen from "../components/CountryPickerScreen";
import ConfirmCodeScreen from "../components/ConfirmCodeScreen";
import SignupNotificationsScreen from "../components/SignupNotificationsScreen";
import ConversationScreen from "../components/ConversationScreen";
import WelcomeScreen from "../components/WelcomeScreen";
import InboxScreen from "../components/InboxScreen";
import ContactsScreen from "../components/ContactsScreen";
import SettingsScreen from "../components/SettingsScreen";
import AboutScreen from "../components/AboutScreen";
import NumberInfoScreen from "../components/NumberInfoScreen";
import ContactsInfoScreen from "../components/ContactsInfoScreen";
import AuthCheckScreen from "./AuthCheckScreen";

const defaultStackOptions = {
  headerMode: "none"
};

const AppStack = createStackNavigator(
  {
    inbox: {
      screen: InboxScreen
    },
    contacts: {
      screen: ContactsScreen
    },
    contactsInfo: {
      screen: ContactsInfoScreen
    },
    conversation: {
      screen: ConversationScreen
    },
    settings: {
      screen: SettingsScreen
    },
    about: {
      screen: AboutScreen
    }
  },
  {
    ...defaultStackOptions,
    initialRouteName: "inbox"
  }
);

const AuthStack = createStackNavigator(
  {
    welcome: {
      screen: WelcomeScreen
    },
    signup: {
      screen: SignupStartScreen
    },
    numberInfo: {
      screen: NumberInfoScreen
    },
    countryPicker: {
      screen: CountryPickerScreen
    },
    confirmCode: {
      screen: ConfirmCodeScreen
    },
    notifications: {
      screen: SignupNotificationsScreen
    }
  },
  {
    ...defaultStackOptions,
    initialRouteName: "welcome"
  }
);

const Navigator = createSwitchNavigator(
  {
    authCheck: AuthCheckScreen,
    mainApp: createStackNavigator(
      {
        app: AppStack,
        auth: AuthStack
      },
      {
        ...defaultStackOptions
      }
    )
  },
  {
    initialRouteName: "authCheck",
    ...defaultStackOptions
  }
);

export default createAppContainer(Navigator);
