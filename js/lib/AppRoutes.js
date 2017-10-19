import SignupStartScreen from '../components/SignupStartScreen';
import CountryPickerScreen from '../components/CountryPickerScreen';
import ConfirmCodeScreen from '../components/ConfirmCodeScreen';
import SignupNotificationsScreen from '../components/SignupNotificationsScreen';
import ConversationScreen from '../components/ConversationScreen';
import WelcomeScreen from '../components/WelcomeScreen';
import InboxScreen from '../components/InboxScreen';
import ContactsScreen from '../components/ContactsScreen';
import SettingsScreen from '../components/SettingsScreen';
import AboutScreen from '../components/AboutScreen';
import NumberInfoScreen from '../components/NumberInfoScreen';
import ContactsInfoScreen from '../components/ContactsInfoScreen';

let AppRoutes = {
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
  },
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
};

export default AppRoutes;
