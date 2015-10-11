import { AppStateIOS } from 'react-native';
import { changeAppState, triggerMemoryWarning } from '../actions/AppActions';

let appStateServiceSelector = state => {
  return {};
}

let appStateServiceBase = {
  onDidInitialize: function () {
    AppStateIOS.addEventListener('change', this.onAppStateChange);
    AppStateIOS.addEventListener('memoryWarning', this.onMemoryWarning);
  },

  onAppStateChange: function (state) {
    this.props.dispatch(changeAppState(state))
  },

  onMemoryWarning: function () {
    this.props.dispatch(triggerMemoryWarning())
  }
};

export default createAppStateService = store => {
  return createService(store)(appStateServiceBase, appStateServiceSelector);
};
