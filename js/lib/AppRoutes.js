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
      confirmCode: 'push'
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
      inbox: 'pop'
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
      inbox: 'pop'
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