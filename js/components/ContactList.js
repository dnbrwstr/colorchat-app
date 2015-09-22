import React from 'react-native';
import Color from 'color';
import PressableView from './PressableView';
import Style from '../style';
import BaseText from './BaseText';

let {
  View,
  ListView,
  Text
} = React;

export default ContactList = React.createClass({
  getInitialState: function () {
    return {
      dataSource: this.getDataSource()
    }
  },

  render: function () {
    return (
      <ListView
        removeClippedSubviews={true}
        automaticallyAdjustContentInsets={false}
        dataSource={this.state.dataSource}
        renderRow={this.renderContact}
        renderSeperator={this.renderSeperator} />
    );
  },

  getDataSource: function () {
    let source = new ListView.DataSource({
      sectionHeaderHasChanged: (s1, s2) => false,
      rowHasChanged: (r1, r2) => false,
      getSectionHeaderData: (data, id) => id
    });

    return source.cloneWithRows(this.props.contacts);
  },

  renderContact: function (contact) {
    return (
      <PressableView
        onPress={() => this.onSelectContact(contact) }
        style={style.contact}
        activeStyle={style.contactActive}
      >
        <View style={{flex: 1, paddingRight: 10}}>
          <BaseText numberOfLines={1}>{contact.firstName} {contact.lastName}</BaseText>
        </View>
        { !contact.matched &&
          <BaseText style={style.inviteButton}>Invite</BaseText>}
      </PressableView>
    )
  },

  renderSeperator: function () {
    return (<View style={style.separator} />)
  },

  onSelectContact: function (contact) {
    if (this.props.onSelect) {
      this.props.onSelect(contact);
    }
  }
});

let { midGray } = Style.values;

let style = Style.create({
  contact: {
    backgroundColor: 'white',
    borderBottomColor: '#EFEFEF',
    borderBottomWidth: 1,
    height: Style.values.rowHeight,
    paddingHorizontal: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contactActive: {
    backgroundColor: '#EFEFEF'
  },
  contactMatched: {
    backgroundColor: 'green'
  },
  inviteButton: {
    backgroundColor: midGray,
    color: 'white',
    fontSize: 12,
    padding: 4,
    flex: 0
  }
});
