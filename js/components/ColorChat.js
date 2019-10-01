import React from 'react';
import {View, StatusBar, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {GatewayProvider} from 'react-gateway';
import App from './App';
import config from '../config';
import {seedMessages} from '../lib/DatabaseUtils';
import {seedAddressBook} from '../lib/ContactUtils';
import createStore from '../store/createStore';
import createSocketService from '../services/createSocketService';
import createAppStateService from '../services/createAppStateService';
import createNetworkService from '../services/createNetworkService';

class ColorChat extends React.Component {
  state = {
    store: null,
  };

  async componentDidMount() {
    let store = await createStore();

    if (config.seedAddressBook) {
      seedAddressBook();
    }

    if (config.seedMessages) {
      seedMessages(config.seedMessageCount);
    }

    this.setState({
      store: store,
      networkService: createNetworkService(store),
      socketService: createSocketService(store),
      appStateService: createAppStateService(store),
    });
  }

  render() {
    if (!this.state.store) {
      return <View style={{backgroundColor: '#EFEFEF'}} />;
    } else {
      return (
        <GatewayProvider>
          <View style={styles.container}>
            <StatusBar animated={true} />
            <Provider store={this.state.store}>
              <App />
            </Provider>
          </View>
        </GatewayProvider>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {flex: 1},
});

export default ColorChat;
