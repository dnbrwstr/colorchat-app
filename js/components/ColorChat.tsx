import React, {FC, useEffect} from 'react';
import {View, StatusBar, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {GatewayProvider} from 'react-gateway';
import App from './App';
import config from '../config';
import {seedMessages} from '../lib/DatabaseUtils';
import {seedAddressBook} from '../lib/ContactUtils';
import createStore from '../store/createStore';

const ColorChat: FC<{}> = () => {
  const store = createStore();

  useEffect(() => {
    if (config.seedAddressBook) {
      seedAddressBook();
    }

    if (config.seedMessages) {
      seedMessages(config.seedMessageCount);
    }
  });

  return (
    <GatewayProvider>
      <View style={styles.container}>
        <StatusBar animated={true} />
        <Provider store={store}>
          <App />
        </Provider>
      </View>
    </GatewayProvider>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
});

export default ColorChat;
