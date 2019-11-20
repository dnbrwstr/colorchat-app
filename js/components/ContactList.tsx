import React, {FC} from 'react';
import {FlatList, StyleSheet, ListRenderItemInfo} from 'react-native';
import Style from '../style';
import ContactListItem from './ContactListItem';
import {Contact} from '../store/contacts/types';

interface ContactListProps {
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
}

const ContactList: FC<ContactListProps> = props => {
  const renderContact = ({index, item}: ListRenderItemInfo<Contact>) => {
    return (
      <ContactListItem
        contact={item}
        itemIndex={index}
        onPress={props.onSelect}
      />
    );
  };

  return (
    <FlatList
      contentContainerStyle={styles.contentContainer}
      data={props.contacts}
      renderItem={renderContact}
      keyExtractor={c => c.phoneNumber}
      getItemLayout={(data, index) => ({
        length: Style.values.rowHeight,
        offset: Style.values.rowHeight * index,
        index,
      })}
      initialNumToRender={12}
      maxToRenderPerBatch={16}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {},
});

export default ContactList;
