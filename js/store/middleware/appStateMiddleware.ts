import {AppState, AppStateStatus} from 'react-native';
import {MiddlewareAPI, Dispatch, AnyAction} from 'redux';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {AppState as StoreState} from '../createStore';
import {
  changeAppState,
  triggerMemoryWarning,
  changeNetwork,
} from '../ui/actions';

const appStateMiddleware = (store: MiddlewareAPI<Dispatch, StoreState>) => {
  const onAppStateChange = (state: AppStateStatus) => {
    store.dispatch(changeAppState(state));
  };

  const onMemoryWarning = () => {
    store.dispatch(triggerMemoryWarning());
  };

  const onNetworkChange = (state: NetInfoState) => {
    if (state) {
      store.dispatch(changeNetwork(state.type));
    }
  };

  const setInitialNetworkState = async () => {
    const state = await NetInfo.fetch();
    onNetworkChange(state);
  };

  setTimeout(() => {
    AppState.addEventListener('change', onAppStateChange);
    AppState.addEventListener('memoryWarning', onMemoryWarning);
    NetInfo.addEventListener(onNetworkChange);
    setInitialNetworkState();
  }, 0);

  return (next: Dispatch) => {
    return (action: AnyAction) => {
      return next(action);
    };
  };
};

export default appStateMiddleware;
