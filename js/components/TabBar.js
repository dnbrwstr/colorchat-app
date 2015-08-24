import React from 'react-native';
import invariant from 'invariant';
import Style from '../style';
import PressableView from './PressableView'
import { SlideFromLeft, SlideFromRight} from '../lib/SceneConfigs';

let {
  Navigator,
  View,
  Text
} = React;

export default TabBar = React.createClass({

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.currentItemId !== this.props.currentItemId) {
      this.refs.navigator.jumpTo(this.getRouteForId(nextProps.currentItemId));
    }
  },

  getRouteForId: function (id) {
    let res = this.props.items.filter(route => route.id == id);

    invariant(
      res.length,
      'Tried to find a nonexistant route'
    );

    return res[0];
  },

  render: function () {
    let initialRouteStack = this.props.items;

    return (
      <View style={style.outerContainer}>
        <View style={style.container}>
          <Navigator
            ref="navigator"
            initialRoute={this.getRouteForId(this.props.currentItemId)}
            initialRouteStack={initialRouteStack}
            configureScene={this.configureScene}
            renderScene={this.renderScene} />
        </View>

        <View style={style.navBar}>
          { this.props.items.map((item) =>
            <PressableView
              onPress={()=> { this.onSelectItem(item) }}
              style={style.navBarItem}
            >
              <Text style={[
                style.navBarText,
                ( item.id == this.props.currentItemId &&
                  style.navBarTextActive )
              ]}>{item.title}</Text>
            </PressableView>
          ) }
        </View>
      </View>
    );
  },

  onSelectItem: function (item) {
    if (this.props.onSelectItem) this.props.onSelectItem(item);
  },

  configureScene: function (route) {
    let routeIndex = this.props.items.indexOf(route);
    let routeCount = this.props.items.length;

    let isFirst = routeIndex == 0;

    if (isFirst) {
      return SlideFromLeft;
    } else {
      return SlideFromRight;
    }
  },

  renderScene: function (route) {
    let Component = route.component;

    return (
      <Component />
    );
  }
});

let style = Style.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1
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
  navBarTextActive: {
    color: 'black'
  }
});
