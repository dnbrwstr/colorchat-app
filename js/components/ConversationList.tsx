import React, {FC, useState, useCallback} from 'react';
import {FlatList, ListRenderItemInfo, StyleSheet, View} from 'react-native';
import Style from '../style';
import ConversationListItem from './ConversationListItem';
import {Conversation} from '../store/conversations/types';
import {Contact} from '../store/contacts/types';
import {useStyles, makeStyleCreator} from '../lib/withStyles';
import {Theme} from '../style/themes';

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
      ItemSeparatorComponent={MemoizedSeparator}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      initialNumToRender={12}
      maxToRenderPerBatch={16}
    />
  );
};

const Separator = () => {
  const {styles} = useStyles(getSeparatorStyles);
  return <View style={styles.separator} />;
};

const MemoizedSeparator = React.memo(Separator);

const getSeparatorStyles = makeStyleCreator((theme: Theme) => {
  return {
    separator: {
      borderBottomColor: theme.secondaryBorderColor,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  };
});

export default ConversationList;
