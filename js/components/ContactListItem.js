import React from 'react-native';
import Style from '../style';
import PressableView from './PressableView';
import BaseText from './BaseText';

let {
  View,
  Animated,
  PixelRatio
} = React;

let ContactListItem = React.createClass({
  getDefaultProps: function () {
    return {
      onPress: () => {},
    }
  },

  getInitialState: function () {
    return {
      animatedOpacity: new Animated.Value(0)
    }
  },

  componentDidMount: function () {
    Animated.timing(this.state.animatedOpacity, {
      toValue: 1,
      duration: 100
    }).start();
  },

  render: function () {
    let contactStyles = [
      style.contact,
      { opacity: this.state.animatedOpacity }
    ];

    return (
      <PressableView
        onPress={() => this.props.onPress() }
        style={contactStyles}
        activeStyle={style.contactActive}
      >
        <View style={{flex: 1, paddingRight: 10}}>
          <BaseText numberOfLines={1}>{this.props.firstName} {this.props.lastName}</BaseText>
        </View>
        { !this.props.matched &&
          <BaseText style={style.inviteButton}>Invite</BaseText>}
      </PressableView>
    )
  }
});

let { midGray } = Style.values;

let style = Style.create({
  contact: {
    backgroundColor: 'white',
    borderTopColor: '#DFDFDF',
    borderTopWidth: 1 / PixelRatio.get(),
    height: Style.values.rowHeight,
    paddingHorizontal: Style.values.horizontalPadding,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contactActive: {
    backgroundColor: '#EFEFEF'
  },
  inviteButton: {
    backgroundColor: midGray,
    color: 'white',
    fontSize: 12,
    padding: 4,
    flex: 0
  }
});

export default ContactListItem;
