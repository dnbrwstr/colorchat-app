import React, { View, StatusBarIOS } from 'react-native';
import { Provider } from 'react-redux/native';
import Router from './Router';
import createStore from '../lib/createStore';
import createSocketService from '../lib/createSocketService';
// import createConnectivityService from '../lib/createConnectivityService';

let ColorChat = React.createClass({
  getInitialState: () => ({
    store: null
  }),

  componentDidMount: async function () {
    let store = await createStore();

    this.setState({
      store: store,
      socketService: createSocketService(store)
    });

    StatusBarIOS.setStyle('light-content');
  },

  render: function () {
    if (!this.state.store) {
      return (
        <View></View>
      );
    } else {
      return (
        <Provider store={this.state.store}>
          { () => <Router /> }
        </Provider>
      );
    }
  }
});

export default ColorChat;
