import React from "react";
import { View, StatusBar } from "react-native";
import { Provider } from "react-redux";
import { GatewayProvider } from "react-gateway";
import App from "./App";
import config from "../config";
import { seedMessages } from "../lib/DatabaseUtils";
import { receiveMessage } from "../actions/MessageActions";
import { seedAddressBook } from "../lib/ContactUtils";
import createStore from "../lib/createStore";
import Style from '../style';
import createSocketService from "../services/createSocketService";
import createNotificationService from "../services/createNotificationService";
import createAppStateService from "../services/createAppStateService";
import createNetworkService from "../services/createNetworkService";

class ColorChat extends React.Component {
  state = {
    store: null
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
      notificationService: createNotificationService(store),
      appStateService: createAppStateService(store)
    });
  }

  render() {
    if (!this.state.store) {
      return <View style={{ backgroundColor: "#EFEFEF" }} />;
    } else {
      return (
        <GatewayProvider>
          <StatusBar backgroundColor={Style.values.almostBlack} />
          <Provider store={this.state.store}>
            <App />
          </Provider>
        </GatewayProvider>
      );
    }
  }
}

export default ColorChat;
