import React from 'react-native';
import { connect } from 'react-redux/native';
import ContactsScreen from './ContactsScreen';
import MessagesScreen from './MessagesScreen';
import Style from '../style';
import TabBar from './TabBar';

let {
  View,
  Text,
  Navigator
} = React;

let tabBarItems = [{
  title: 'Contacts',
  component: ContactsScreen
}, {
  title: 'Messages',
  component: MessagesScreen
}];

let MainScreen = React.createClass({
  getInitialState: () => ({
    selectedTab: 'Contacts'
  }),

  render: function () {
    return (
      <View style={style.container}>
        <TabBar
          items={tabBarItems}
          currentItem={this.state.selectedTab}
          onSelectItem={(item)=> this.setState({selectedTab: item.title})} />
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

export default connect(state => ({
  route: state.navigation.route,
  contacts: state.contacts,
  conversation: state.conversations
}))(MainScreen);