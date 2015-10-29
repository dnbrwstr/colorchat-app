import React from 'react-native';
import Color from 'color';
import PressableView from './PressableView';
import Style from '../style';
import BaseText from './BaseText';

let {
  View,
  ListView,
  Text,
  PixelRatio
} = React;

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
        renderRow={this.renderContact}
        renderSeperator={this.renderSeperator} />
    );
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
    this.props.onSelect(contact);
  }
});

let { midGray } = Style.values;

let style = Style.create({
  contact: {
    backgroundColor: 'white',
    borderBottomColor: '#DFDFDF',
    borderBottomWidth: 1 / PixelRatio.get(),
    height: Style.values.rowHeight,
    paddingHorizontal: Style.values.horizontalPadding,
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
