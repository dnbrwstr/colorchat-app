import React from "react";
import { View, FlatList } from "react-native";
import Style from "../style";
import BaseText from "./BaseText";
import ConversationListItem from "./ConversationListItem";

class ConversationList extends React.Component {
  static defaultProps = {
    onSelect: () => {},
    onDelete: () => {}
  };

  state = {
    scrollLocked: false
  };

  render() {
    return (
      <FlatList
        scrollEnabled={!this.state.scrollLocked}
        removeClippedSubviews={true}
        data={this.props.conversations}
        renderItem={this.renderConversation}
        keyExtractor={c => c.recipientId.toString()}
        getItemLayout={(data, index) => ({
          length: Style.values.rowHeight,
          offset: Style.values.rowHeight * index,
          index
        })}
        initialNumToRender={12}
        maxToRenderPerBatch={16}
        pageSize={1}
      />
    );
  }

  renderConversation = ({ index, item }) => {
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
  };

  lockScroll = () => {
    this.setState({
      scrollLocked: true
    });
  };

  unlockScroll = () => {
    this.setState({
      scrollLocked: false
    });
  };

  onSelect = conversation => {
    this.props.onSelect(conversation);
  };

  onDelete = conversation => {
    this.props.onDelete(conversation);
  };
}

export default ConversationList;
