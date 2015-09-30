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
    if (nextProps.currentItemTitle !== this.props.currentItemTitle) {
      this.refs.navigator.jumpTo(this.getRouteForTitle(nextProps.currentItemTitle));
    }
  },

  getRouteForTitle: function (title) {
    let res = this.props.items.filter(route => route.title == title);

    invariant(
      res.length,
      'Tried to find a nonexistant tab'
    );

    return res[0];
  },

  componentDidMount: function () {
    let ctx = this.refs.navigator.navigationContext;
    ctx.addListener('didfocus', (e) => {
      this.onSelectItem(e.target.currentRoute);
    });
  },

  render: function () {
    let initialRouteStack = this.props.items;

    return (
      <View style={style.outerContainer}>
        <View style={style.container}>
          <Navigator
            ref="navigator"
            initialRoute={this.getRouteForTitle(this.props.currentItemTitle)}
            initialRouteStack={initialRouteStack}
            configureScene={this.configureScene}
            renderScene={this.renderScene} />
        </View>

        <View style={style.navBar}>
          { this.props.items.map(this.renderItem) }
        </View>
      </View>
    );
  },

  renderItem: function (item) {
    let selected = item.title == this.props.currentItemTitle;

    let wrapperStyle = [
      style.navBarItem,
      selected && style.navBarItemSelected
    ];

    let textStyle = [
      style.navBarText,
      selected && style.navBarTextSelected
    ];

    return (
      <PressableView
        key={item.title}
        style={wrapperStyle}
        onPress={() => this.onSelectItem(item)}
        activeStyle={style.navBarItemActive}
      >
        <Text style={textStyle}>{item.title}</Text>
      </PressableView>
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

let {
  textBase,
  outerWrapperBase
} = Style.mixins;

let style = Style.create({
  outerContainer: {
    ...outerWrapperBase,
    flex: 1,
  },
  container: {
    flex: 1
  },
  navBar: {
    flex: 0,
    height: 60,
    backgroundColor: '#E0E0E0',
    flexDirection: 'row',
  },
  navBarItem: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  navBarItemSelected: {
  },
  navBarText: {
    ...textBase,
    textAlign: 'center'
  },
  navBarTextSelected: {
    color: 'black'
  }
});
