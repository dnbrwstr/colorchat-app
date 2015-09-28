import invariant from 'invariant';
import SignupStartScreen from '../components/SignupStartScreen';
import CountryPickerScreen from '../components/CountryPickerScreen';
import ConfirmCodeScreen from '../components/ConfirmCodeScreen';
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
      main: 'reset'
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
  invariant(
    AppRoutes[fromTitle] && AppRoutes[fromTitle].links[toTitle],
    `No link exists between ${fromTitle} and ${toTitle}`
  );

  return AppRoutes[fromTitle].links[toTitle];
};