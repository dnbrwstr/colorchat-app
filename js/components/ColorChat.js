import React, { View, StatusBarIOS } from 'react-native';
import { Provider } from 'react-redux/native';
import App from './App';
import createStore from '../lib/createStore';
import createSocketService from '../lib/createSocketService';
import createNotificationService from '../lib/createNotificationService';
import createAppStateService from '../lib/createAppStateService';

let ColorChat = React.createClass({
  getInitialState: () => ({
    store: null
  }),

  componentDidMount: async function () {
    let store = await createStore();

    this.setState({
      store: store,
      socketService: createSocketService(store),
      notificationService: createNotificationService(store),
      appStateService: createAppStateService(store)
    });

    StatusBarIOS.setHidden(true);
  },

  render: function () {
    if (!this.state.store) {
      return (
        <View style={{backgroundColor: '#EFEFEF'}}></View>
      );
    } else {
      return (
        <Provider store={this.state.store}>
          { () => <App /> }
        </Provider>
      );
    }
  }
});

export default ColorChat;
