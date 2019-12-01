import React, {FC, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import TextScreen from './TextScreen';
import TextLink from './TextLink';
import BaseText from './BaseText';
import {StyleSheet} from 'react-native';

const ContactsInfoScreen: FC<{}> = () => {
  return (
    <TextScreen title="Contacts usage">
      <BaseText>
        Color Chat uses your contacts to show you which of your friends are
        already using ColorChat{'\n\n'}
      </BaseText>
      <BaseText>
        Color Chat does not store your contacts, and does not have the ability
        to share them with other users or with third parties.{'\n\n'}
      </BaseText>
      <BaseText>
        If you have any questions, please contact{' '}
        <TextLink href="mailto:info@soft.works" style={style.link}>
          info@soft.works
        </TextLink>
        .
      </BaseText>
    </TextScreen>
  );
};

const style = StyleSheet.create({
  container: {},
  link: {
    textDecorationLine: 'underline',
  },
});

export default ContactsInfoScreen;
