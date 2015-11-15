import React from 'react-native';
import Color from 'color';
import PressableView from './PressableView';
import Style from '../style';
import BaseText from './BaseText';
import ContactListItem from './ContactListItem';

let {
  View,
  ListView,
  Text,
  PixelRatio,
  ScrollView
} = React;

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
        renderHeader={this.renderHeader}
        renderRow={this.renderContact}
        renderSeperator={this.renderSeperator}
        initialListSize={12}
        scrollRenderAheadDistance={12}
        pageSize={1}
      />
    );
  },

  renderScrollComponent: function (props) {
    let inset = [Style.values.rowHeight, 0, 0, 0];
    let offset = [0, -Style.values.rowHeight];
    return (
      <ScrollView {...props} contentInset={inset} contentOffset={offset} />
    )
  },

  renderHeader: function () {
    let viewStyle = {
      padding: 20,
      paddingVertical: 30
    };

    let textStyle = {
      textAlign: 'center'
    };

    return (
      <View style={viewStyle}>
        <BaseText style={textStyle}>Select a contact to start{BR}a conversation</BaseText>
      </View>
    );
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

