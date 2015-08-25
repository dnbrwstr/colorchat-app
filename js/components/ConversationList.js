import React from 'react-native';
import Style from '../style';
import PressableView from './PressableView';

let {
  View,
  ListView,
  Text
} = React;

export default ConversationList = React.createClass({
  getInitialState: function () {
    return {
      dataSource: this.getDataSource()
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
        removeClippedSubviews={true}
        automaticallyAdjustsContentInsets={false}
        dataSource={this.state.dataSource}
        renderRow={this.renderConversation} />
    );
  },

  renderConversation: function (conversation) {
    let { contact, lastMessage } = conversation;
    let color = lastMessage ? lastMessage.color : null;

    let conversationStyles = [{
        backgroundColor: color
      },
      style.conversation
    ];

    return (
      <PressableView
        style={conversationStyles}
        onPress={() => this.onSelect(conversation)}
      >
        <Text>{contact.firstName} {contact.lastName}</Text>
      </PressableView>
    );
  },

  onSelect: function (conversation) {
    if (this.props.onSelect) this.props.onSelect(conversation)
  }
})

let style = Style.create({
  conversation: {
    padding: 12,
    flex: 1
  }
});
