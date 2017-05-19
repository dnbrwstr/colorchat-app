import { AppState } from 'react-native';
import { changeAppState, triggerMemoryWarning } from '../actions/AppActions';
import createService from './createService';

let appStateServiceSelector = state => {
  return {};
};

let appStateServiceBase = {
  onDidInitialize: function () {
    AppState.addEventListener('change', this.onAppStateChange);
    AppState.addEventListener('memoryWarning', this.onMemoryWarning);
  },

  onAppStateChange: function (state) {
    this.props.dispatch(changeAppState(state));
  },

  onMemoryWarning: function () {
    this.props.dispatch(triggerMemoryWarning());
  }
};

export default createAppStateService = store => {
  return createService(store)(appStateServiceBase, appStateServiceSelector);
};
