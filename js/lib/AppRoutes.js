import invariant from 'invariant';
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
    component: WelcomeScreen,
    links: {
      signup: 'push'
    }
  },
  signup: {
    component: SignupStartScreen,
    links: {
      countryPicker: 'push',
      confirmCode: 'push',
      numberInfo: 'push'
    }
  },
  numberInfo: {
    component: NumberInfoScreen,
    links: {
      'signup': 'pop'
    }
  },
  countryPicker: {
    component: CountryPickerScreen,
    links: {
      signup: 'pop'
    }
  },
  confirmCode: {
    component: ConfirmCodeScreen,
    links: {
      notifications: 'push',
      signup: 'pop'
    }
  },
  notifications: {
    component: SignupNotificationsScreen,
    links: {
      main: 'reset',
      'confirmCode': 'pop'
    }
  },
  inbox: {
    component: InboxScreen,
    links: {
      conversation: 'push',
      contacts: 'push',
      'settings': 'push'
    }
  },
  contacts: {
    component: ContactsScreen,
    links: {
      conversation: 'push',
      contactsInfo: 'push',
      inbox: 'pop'
    }
  },
  contactsInfo: {
    component: ContactsInfoScreen,
    links: {
      contacts: 'pop'
    }
  },
  conversation: {
    component: ConversationScreen,
    links: {
      inbox: 'pop'
    }
  },
  settings: {
    component: SettingsScreen,
    links: {
      inbox: 'pop',
      about: 'push'
    }
  },
  about: {
    component: AboutScreen,
    links: {
      settings: 'pop'
    }
  }
};

export default AppRoutes;

export let getTransitionMethod = (fromTitle, toTitle) => {
  let method;

  if (!AppRoutes[fromTitle] || !AppRoutes[fromTitle].links[toTitle]) {
    method = 'reset';
  } else {
    method = AppRoutes[fromTitle].links[toTitle];
  }

  return method;
};