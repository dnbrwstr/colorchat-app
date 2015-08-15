import React from 'react-native';
import { Provider } from 'react-redux/native';
import Router from './Router';

let ColorChat = React.createClass({
  render: () =>
    <Provider store={store}>
      { () => <Router /> }
    </Provider>
});

export default ColorChat;
