import React from 'react';
import {
  View,
  FlatList
} from 'react-native';
import Style from '../style';
import BaseText from './BaseText';
import ConversationListItem from './ConversationListItem';

let ConversationList = React.createClass({
  getDefaultProps: function () {
    return {
      onSelect: () => {},
      onDelete: () => {}
    };
  },

  getInitialState: function () {
    return {
      scrollLocked: false
    };
  },

  render: function () {    
    return (
      <FlatList
        scrollEnabled={!this.state.scrollLocked}
        removeClippedSubviews={true}
        data={this.props.conversations}
        renderItem={this.renderConversation}
        keyExtractor={c => c.recipientId}
        getItemLayout={(data, index) => (
          {length: Style.values.rowHeight, offset: Style.values.rowHeight * index, index}
        )}
        initialNumToRender={12}
        maxToRenderPerBatch={16}
        pageSize={1}
      />
    );
  },

  renderConversation: function ({ index, item }) {
    return (
      <ConversationListItem
        {...item}
        itemIndex={index}
        onPress={() => this.onSelect(item)}
        onInteractionStart={this.lockScroll}
        onInteractionEnd={this.unlockScroll}
        onDelete={() => this.onDelete(item)}
      />
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
    this.props.onSelect(conversation);
  },

  onDelete: function (conversation) {
    this.props.onDelete(conversation);
  }
});

export default ConversationList;
