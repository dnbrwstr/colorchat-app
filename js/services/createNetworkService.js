import { NetInfo } from 'react-native';
import { changeNetwork } from '../actions/AppActions';
import createService from './createService';

let networkServiceSelector = state => {
  return {};
}

let networkServiceBase = {
  onDidInitialize: async function () {
    NetInfo.addEventListener('change', this.onNetworkChange);
    let initialState = await NetInfo.fetch();
    this.onNetworkChange(initialState);
  },

  onNetworkChange: function (state) {
    console.log(state);
    this.props.dispatch(changeNetwork(state))
  }
};

export default createnetworkService = store => {
  return createService(store)(networkServiceBase, networkServiceSelector);
};
