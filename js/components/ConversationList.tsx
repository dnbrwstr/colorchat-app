import React, {FC, useState, useCallback} from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import Style from '../style';
import ConversationListItem from './ConversationListItem';
import {Conversation} from '../store/conversations/types';
import {Contact} from '../store/contacts/types';

type ConversationWithContact = Conversation & {contact: Contact};

interface ConversationListProps {
  conversations: ConversationWithContact[];
  onSelect: (conversation: ConversationWithContact) => void;
  onDelete: (conversation: ConversationWithContact) => void;
}

const ConversationList: FC<ConversationListProps> = props => {
  const [scrollLocked, setScrollLocked] = useState(false);
  const lockScroll = useCallback(() => setScrollLocked(true), []);
  const unlockScroll = useCallback(() => setScrollLocked(false), []);

  const renderConversation = useCallback(
    ({index, item}: ListRenderItemInfo<ConversationWithContact>) => {
      return (
        <ConversationListItem
          {...item}
          onPress={() => props.onSelect(item)}
          onInteractionStart={lockScroll}
          onInteractionEnd={unlockScroll}
          onDelete={() => props.onDelete(item)}
        />
      );
    },
    [props.onSelect, props.onDelete],
  );

  const keyExtractor = useCallback(
    (c: Conversation) => c.recipientId.toString(),
    [],
  );

  const getItemLayout = useCallback(
    (data: Conversation[] | null, index: number) => {
      return {
        length: Style.values.rowHeight,
        offset: Style.values.rowHeight * index,
        index,
      };
    },
    [],
  );

  return (
    <FlatList
      scrollEnabled={!scrollLocked}
      removeClippedSubviews={true}
      data={props.conversations}
      renderItem={renderConversation}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      initialNumToRender={12}
      maxToRenderPerBatch={16}
    />
  );
};

export default ConversationList;
