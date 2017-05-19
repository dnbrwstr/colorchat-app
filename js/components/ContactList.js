import React from 'react';
import {
  View,
  ListView,
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

  getInitialState: function () {
    let source = new ListView.DataSource({
      sectionHeaderHasChanged: (s1, s2) => false,
      rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.recordID !== r2.recordID,
      getSectionHeaderData: (data, id) => id
    });

    return {
      dataSource: source.cloneWithRows(this.props.contacts)
    }
  },

  componentDidUpdate: function (prevProps) {
    if (this.props.contacts !== prevProps.contacts) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.props.contacts)
      });
    }
  },

  render: function () {
    return (
      <ListView
        removeClippedSubviews={true}
        automaticallyAdjustContentInsets={false}
        dataSource={this.state.dataSource}
        renderScrollComponent={this.renderScrollComponent}
        renderRow={this.renderContact}
        renderSeperator={this.renderSeperator}
        initialListSize={12}
        scrollRenderAheadDistance={12}
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

  renderContact: function (contact, section, row) {
    return (
      <ContactListItem
        {...contact}
        itemIndex={parseInt(row)}
        onPress={ () => this.onSelectContact(contact) }
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

