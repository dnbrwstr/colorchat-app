import Color from 'color';
import React from 'react-native';
import Style from '../style';
import PressableView from './PressableView';
import InteractiveView from './InteractiveView';
import BaseText from './BaseText';

let {
  View,
  ListView
} = React;

export default ConversationList = React.createClass({
  getInitialState: function () {
    return {
      dataSource: this.getDataSource(),
      scrollLocked: false
    };
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (prevProps.conversations !== this.props.conversations) {
      this.setState({
        dataSource: this.getDataSource()
      });
    }
  },

  getDataSource: function () {
    let source;

    if (this.state && this.state.dateSource) {
      source = this.state.dataSource;
    } else {
      source = this.createDataSource();
    }

    return source.cloneWithRows(this.props.conversations);
  },

  createDataSource: function () {
    return new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        return r1 !== r2
      }
    });
  },

  render: function () {
    return (
      <ListView
        scrollEnabled={!this.state.scrollLocked}
        removeClippedSubviews={true}
        automaticallyAdjustsContentInsets={false}
        dataSource={this.state.dataSource}
        renderRow={this.renderConversation} />
    );
  },

  renderConversation: function (conversation) {
    let { contact, lastMessage } = conversation;
    let color = lastMessage ? lastMessage.color : 'white';
    let isLight = Color(color).luminosity() > .5;

    let textColor = isLight ?
      'black' : 'white'

    let textStyle = {
      color: textColor
    };

    let conversationStyles = [{
        backgroundColor: color
      },
      style.conversation
    ];

    let colorFn = isLight ? 'darken' : 'lighten';

    let conversationActiveStyle = {
      backgroundColor: Color(color)[colorFn](.2).hexString()
    };

    return (
      <InteractiveView
        style={conversationStyles}
        swipeEnabled={true}
        deleteEnabled={true}
        activeStyle={conversationActiveStyle}
        onPress={() => this.onSelect(conversation)}
        onInteractionStart={this.lockScroll}
        onInteractionEnd={this.unlockScroll}
      >
        <BaseText style={textStyle}>{contact.firstName} {contact.lastName}</BaseText>
      </InteractiveView>
    );
  },

  lockScroll: function () {
    this.setState({
      scrollLocked: true
    });
  },

  unlockScroll: function () {
    this.setState({
      scrollLocked: false
    });
  },

  onSelect: function (conversation) {
    if (this.props.onSelect) this.props.onSelect(conversation)
  }
})

let style = Style.create({
  conversation: {
    paddingHorizontal: Style.values.horizontalPadding,
    height: Style.values.rowHeight,
    flex: 1,
    justifyContent: 'center'
  }
});
