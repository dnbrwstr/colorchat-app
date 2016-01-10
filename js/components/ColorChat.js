import React, { View, StatusBarIOS } from 'react-native';
import { Provider } from 'react-redux/native';
import App from './App';
import config from '../config';
import { seedMessages } from '../lib/DatabaseUtils';
import { receiveMessage } from '../actions/MessageActions';
import { seedAddressBook as shouldSeedAddressBook } from '../config';
import { seedAddressBook } from '../lib/ContactUtils';
import createStore from '../lib/createStore';
import createSocketService from '../services/createSocketService';
import createNotificationService from '../services/createNotificationService';
import createAppStateService from '../services/createAppStateService';
import createNetworkService from '../services/createNetworkService';

let ColorChat = React.createClass({
  getInitialState: () => ({
    store: null
  }),

  componentDidMount: async function () {
    let store = await createStore();

    if (shouldSeedAddressBook) {
      seedAddressBook();
    }

    if (config.seedMessages) {
      seedMessages(config.seedMessageCount)
    }

    this.setState({
      store: store,
      networkService: createNetworkService(store),
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
