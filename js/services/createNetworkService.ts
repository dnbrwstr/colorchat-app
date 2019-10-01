import NetInfo from '@react-native-community/netinfo';
import {changeNetwork} from '../store/ui/actions';
import createService from './createService';

let networkServiceSelector = state => {
  return {};
};

let networkServiceBase = {
  onDidInitialize: async function() {
    NetInfo.addEventListener(this.onNetworkChange);
    const {state} = await NetInfo.fetch();
    this.onNetworkChange(state);
  },

  onNetworkChange: function(state) {
    if (state) {
      this.props.dispatch(changeNetwork(state.type));
    }
  },
};

export default createnNetworkService = store => {
  return createService(store)(networkServiceBase, networkServiceSelector);
};
