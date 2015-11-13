import React from 'react-native';
import Style from '../style';
import BaseText from './BaseText';
import ConversationListItem from './ConversationListItem';

let {
  View,
  ListView
} = React;

let ConversationList = React.createClass({
  getDefaultProps: function () {
    return {
      onSelect: () => {},
      onDelete: () => {}
    };
  },

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
    return (
      <ConversationListItem
        {...conversation}
        onPress={() => this.onSelect(conversation)}
        onInteractionStart={this.lockScroll}
        onInteractionEnd={this.unlockScroll}
        onDelete={() => this.onDelete(conversation)}
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
