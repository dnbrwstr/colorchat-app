import React from 'react-native';
import Color from 'color';
import Style from '../style';
import InteractiveView from './InteractiveView';
import BaseText from './BaseText';
import { shortHumanDate } from '../lib/Utils';
import { getTimestamp } from '../lib/MessageUtils';

let {
  Animated
} = React;

const DEFAULT_BG_COLOR = '#EFEFEF';

let ConversationListItem = React.createClass({
  getDefaultProps: function () {
    return {
      onPress: () => {},
      onInteractionStart: () => {},
      onInteractionEnd: () => {},
      onDelete: () => {}
    };
  },

  getActiveBackgroundColor: function () {
    let color = this.getColor();
    let isLight = Color(color).luminosity() > .5;
    let colorFn = isLight ? 'darken' : 'lighten';
    return Color(color)[colorFn](.2).hexString()
  },

  getColor: function () {
    if (this.props.lastMessage && this.props.lastMessage.color) {
      return this.props.lastMessage.color;
    } else {
      return DEFAULT_BG_COLOR;
    }
  },

  render: function () {
    let { contact, lastMessage } = this.props;

    let conversationStyles = [
      { backgroundColor: this.getColor() },
      style.item
    ];

    let conversationActiveStyle = {
      backgroundColor: this.getActiveBackgroundColor()
    };

    let textStyles = [this.props.unread && {
      fontWeight: '500'
    }];

    return (
      <InteractiveView
        style={conversationStyles}
        swipeEnabled={true}
        deleteEnabled={true}
        activeStyle={conversationActiveStyle}
        onPress={this.props.onPress}
        onInteractionStart={this.props.onInteractionStart}
        onInteractionEnd={this.props.onInteractionEnd}
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}
        onDelete={this.props.onDelete}
      >
        <BaseText visibleOn={this.getColor()} style={textStyles}>
          {contact.firstName} {contact.lastName}
        </BaseText>
        { this.props.lastMessage &&
          <BaseText visibleOn={this.getColor()} style={textStyles}>
            { shortHumanDate(getTimestamp(this.props.lastMessage)) }
          </BaseText> }
      </InteractiveView>
    );
  }
});

export default ConversationListItem;

let style = Style.create({
  item: {
    paddingHorizontal: Style.values.horizontalPadding,
    height: Style.values.rowHeight,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  }
});
