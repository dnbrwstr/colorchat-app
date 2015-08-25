import React from 'react-native';
import { connect } from 'react-redux/native';
import ContactsScreen from './ContactsScreen';
import MessagesScreen from './MessagesScreen';
import Style from '../style';
import TabBar from './TabBar';
import { changeMainTab } from '../actions/AppActions';
import { mainScreenSelector } from '../lib/Selectors';
import { init as initSocketUtils } from '../lib/SocketUtils';

let {
  View,
  Text,
  Navigator
} = React;

let tabBarItems = [{
  id: 0,
  title: 'Contacts',
  component: ContactsScreen
}, {
  id: 1,
  title: 'Messages',
  component: MessagesScreen
}];

let MainScreen = React.createClass({
  componentDidMount: function () {
    initSocketUtils(this.props.user.token, this.props.dispatch);
  },

  render: function () {
    let { dispatch } = this.props;

    return (
      <View style={style.container}>
        <TabBar
          items={tabBarItems}
          currentItemId={this.props.currentTabId}
          onSelectItem={ item => dispatch(changeMainTab(item)) } />
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