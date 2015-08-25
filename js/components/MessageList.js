import React from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import Style from '../style';
import Message from './Message';

let {
  View,
  Text,
  ListView
} = React;

let MessageList = React.createClass({
  getInitialState: function () {
    let getRowData = (dataBlob, sectionId, rowId) => {
      return dataBlob[sectionId][rowId];
    }

    let dataSource = new ListView.DataSource({
      rowHasChanged: (a, b) => a.clientId !== b.clientId,
      getRowData
    });

    return {
      dataSource,
      workingData: this.cloneWithMessageData(dataSource)
    };
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.messages === prevProps.messages) return;

    this.setState({
      workingData: this.cloneWithMessageData(this.state.dataSource)
    });

    this.refs.list.getScrollResponder().scrollTo(0);
  },

  cloneWithMessageData: function (dataSource) {
    let messages = this.getMessages();
    let messageIds = this.getOrderedMessageIds();
    return dataSource.cloneWithRows(messages, messageIds);
  },

  getMessages: function () {
    return this.props.messages.reduce((memo, m) => {
      memo[m.id || m.clientId] = m;
      return memo;
    }, {});
  },

  getOrderedMessageIds: function () {
    return this.props.messages.sort((a, b) => {
      let timeA = new Date(a.clientTimestamp || a.createdAt);
      let timeB = new Date(b.clientTimestamp || b.createdAt);

      if (timeA > timeB) return -1;
      else if (timeA < timeB) return 1;
      else return 0;
    }).map(m => m.id || m.clientId);
  },

  render: function () {
    return (
      <ListView
        ref="list"
        style={{overflow: 'hidden'}}
        automaticallyAdjustContentInsets={false}
        renderScrollComponent={props => <InvertibleScrollView {...props} inverted ref="scrollView" />}
        dataSource={this.state.workingData}
        removeClippedSubviews={true}
        renderRow={this.renderMessage} />
    );
  },

  renderMessage: function (messageData, sectionId, rowId) {
    let fromCurrentUser = this.props.user.id === messageData.senderId;
     // if (!messageData.id && !messageData.clientId) {
     //  debugger;
     // }
     console.log(messageData.id)
    return (
      <Message
        fromCurrentUser={fromCurrentUser}
        key={messageData.id || messageData.clientId}
        { ...messageData } />
    );
  }
});

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'fuchsia'
  }
});

export default MessageList;
