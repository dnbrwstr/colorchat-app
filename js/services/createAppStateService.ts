import {AppState as ReduxAppState} from '../store/createStore';
import {AppState, AppStateStatus} from 'react-native';
import {changeAppState, triggerMemoryWarning} from '../store/ui/actions';
import createService from './createService';

let appStateServiceSelector = (state: ReduxAppState) => {
  return {};
};

let appStateServiceBase = {
  onDidInitialize: function() {
    AppState.addEventListener('change', this.onAppStateChange);
    AppState.addEventListener('memoryWarning', this.onMemoryWarning);
  },

  onAppStateChange: function(state: AppStateStatus) {
    this.props.dispatch(changeAppState(state));
  },

  onMemoryWarning: function() {
    this.props.dispatch(triggerMemoryWarning());
  },
};

export default createAppStateService = store => {
  return createService(store)(appStateServiceBase, appStateServiceSelector);
};
