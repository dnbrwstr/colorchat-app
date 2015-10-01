import React from 'react-native';
import { connect } from 'react-redux/native';
import ContactsScreen from './ContactsScreen';
import MessagesScreen from './MessagesScreen';
import Style from '../style';
import TabBar from './TabBar';
import { setMainTab } from '../actions/AppActions';
import { mainScreenSelector } from '../lib/Selectors';

let {
  View,
  Text,
  Navigator,
  PushNotificationIOS
} = React;

let tabBarItems = [{
  id: 0,
  title: 'Contacts',
  component: ContactsScreen
}, {
  id: 1,
  title: 'Inbox',
  component: MessagesScreen
}];

let MainScreen = React.createClass({
  componentDidMount: function () {
    PushNotificationIOS.requestPermissions();
  },

  render: function () {
    let { dispatch } = this.props;

    return (
      <View style={style.container}>
        <TabBar
          items={tabBarItems}
          currentItemTitle={this.props.currentTabTitle}
          onSelectItem={ item => dispatch(setMainTab(item.title)) } />
      </View>
    );
  }
});

let style = Style.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  }
});

export default connect(mainScreenSelector)(MainScreen);