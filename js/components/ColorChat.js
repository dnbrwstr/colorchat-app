import React, { View } from 'react-native';
import { Provider } from 'react-redux/native';
import Router from './Router';
import createStore from '../lib/createStore';
import * as SocketUtils from '../lib/SocketUtils';

let ColorChat = React.createClass({
  getInitialState: () => ({
    store: null
  }),

  componentDidMount: async function () {
    let store = await createStore();

    SocketUtils.init(store);

    this.setState({
      store: store
    });
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
