import React from 'react';
import {
  View,
  FlatList,
  Text,
  PixelRatio,
  ScrollView
} from 'react-native';
import Color from 'color';
import PressableView from './PressableView';
import Style from '../style';
import BaseText from './BaseText';
import ContactListItem from './ContactListItem';

const BR = "\n";

export default ContactList = React.createClass({
  getDefaultProps: function () {
    onSelect: () => {}
  },

  render: function () {
    return (
      <FlatList
        data={this.props.contacts}
        renderScrollComponent={this.renderScrollComponent}
        renderItem={this.renderContact}
        renderSeperator={this.renderSeperator}
        keyExtractor={c => c.recordID}
        getItemLayout={(data, index) => (
          {length: Style.values.rowHeight, offset: Style.values.rowHeight * index, index}
        )}
        initialNumToRender={12}
        maxToRenderPerBatch={16}
        pageSize={1}
      />
    );
  },

  renderScrollComponent: function (props) {
    let inset = {
      top: Style.values.rowHeight,
      right: 0,
      bottom: 0,
      left: 0
    };

    let offset = {
      x: 0,
      y: -Style.values.rowHeight
    };

    return (
      <ScrollView {...props} contentInset={inset} contentOffset={offset} />
    )
  },

  renderContact: function ({ index, item }) {
    return (
      <ContactListItem
        {...item}
        itemIndex={index}
        onPress={ () => this.onSelectContact(item) }
      />
    );
  },

  renderSeperator: function () {
    return (<View style={style.separator} />)
  },

  onSelectContact: function (contact) {
    this.props.onSelect(contact);
  }
});

