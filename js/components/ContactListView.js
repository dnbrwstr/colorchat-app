import React from 'react-native';
import Pressable from './Pressable';
import Style from '../style';

let {
  View,
  ListView,
  Text
} = React;

export default ContactListView = React.createClass({
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
      <View>
        <Text>{contact.firstName} {contact.lastName}</Text>
      </View>
    )
  },

  renderSeperator: function () {
    return (<View style={style.separator} />)
  }
});

let style = Style.create({

});