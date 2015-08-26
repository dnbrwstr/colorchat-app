import React from 'react-native';
import PressableView from './PressableView';
import Style from '../style';

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
    let contactStyle = [
      style.contact,
      contact.matched && style.contactMatched
    ];

    return (
      <PressableView
        onPress={() => this.onSelectContact(contact) }
        style={contactStyle}>
        <Text>{contact.firstName} {contact.lastName}</Text>
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

let style = Style.create({
  contact: {
    backgroundColor: 'white',
    padding: 10,
    flex: 1
  },
  contactMatched: {
    backgroundColor: 'green'
  }
});
