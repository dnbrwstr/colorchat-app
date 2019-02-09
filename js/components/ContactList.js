import React, { Component } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import Style from "../style";
import ContactListItem from "./ContactListItem";

const ContactList = class extends Component {
  static defaultProps = (function() {
    onSelect: () => {};
  })();

  render() {
    return (
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={this.props.contacts}
        renderItem={this.renderContact}
        renderSeperator={this.renderSeperator}
        keyExtractor={c => c.recordID}
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

  renderContact = ({ index, item }) => {
    return (
      <ContactListItem
        {...item}
        itemIndex={index}
        onPress={() => this.onSelectContact(item)}
      />
    );
  };

  renderSeperator = () => {
    return <View style={style.separator} />;
  };

  onSelectContact = contact => {
    this.props.onSelect(contact);
  };
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: Style.values.rowHeight
  }
});

export default ContactList;
