import React from 'react-native';
import { connect } from 'react-redux/native';
import ContactsScreen from './ContactsScreen';
import MessagesScreen from './MessagesScreen';
import Pressable from './Pressable';
import Style from '../style';
import { SlideFromLeft, SlideFromRight} from '../lib/SceneConfigs';

let {
  View,
  Text,
  Navigator
} = React;

let initialRouteStack = [
  {
    title: 'contacts',
    data: {}
  },
  {
    title: 'messages',
    data: {}
  },
];

let MainScreen = React.createClass({
  getInitialState: () => ({
    route: {
      title: 'contacts',
      data: {}
    }
  }),

  componentWillUpdate: function (nextProps, nextState) {
    if (nextState.route.title != this.state.route.title) {
      this.refs.navigator.jumpTo(nextState.route);
    }
  },

  render: function () {
    return (
      <View style={style.container}>
        <View style={style.contentContainer}>
          <Navigator
            ref="navigator"
            initialRoute={initialRouteStack[0]}
            initialRouteStack={initialRouteStack}
            configureScene={this.configureScene}
            renderScene={this.renderScene} />
        </View>

        <View style={style.navBar}>
          <Pressable onPress={()=> this.setState({
            route: initialRouteStack[0]
          })}>
            <View style={[style.navBarItem, style.redBg]}>
              <Text style={style.navBarText}>Contacts</Text>
            </View>
          </Pressable>

          <Pressable onPress={()=> this.setState({
            route: initialRouteStack[1]
          })}>
            <View style={style.navBarItem}>
              <Text style={style.navBarText}>Messages</Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  },

  configureScene: function (route) {
    return {
      contacts: SlideFromLeft,
      messages: SlideFromRight
    }[route.title];
  },

  renderScene: function (route) {
    let pageComponents = {
      contacts: ContactsScreen,
      messages: MessagesScreen
    }

    let Component = pageComponents[route.title];

    return (
      <Component {...route.data} />
    )
  }
});

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'purple'
  },
  navBar: {
    height: 80,
    backgroundColor: '#EFEFEF',
    flexDirection: 'row',
  },
  navBarItem: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  navBarText: {
    mixins: [Style.mixins.textBase],
    textAlign: 'center'
  },
  redBg: {
    backgroundColor: 'red'
  }
})

export default connect(state => ({
  route: state.navigation.route,
  contacts: state.contacts,
  conversation: state.conversations
}))(MainScreen);