import invariant from 'invariant';
import SignupStartScreen from '../components/SignupStartScreen';
import CountryPickerScreen from '../components/CountryPickerScreen';
import ConfirmCodeScreen from '../components/ConfirmCodeScreen';
import SignupNotificationsScreen from '../components/SignupNotificationsScreen';
import ConversationScreen from '../components/ConversationScreen';
import MainScreen from '../components/MainScreen';

let AppRoutes = {
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
  main: {
    component: MainScreen,
    links: {
      conversation: 'push'
    }
  },
  conversation: {
    component: ConversationScreen,
    links: {
      main: 'pop'
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