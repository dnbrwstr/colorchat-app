import React, {FC} from 'react';
import TextScreen from './TextScreen';
import BaseText from './BaseText';
import TextLink from './TextLink';
import {StyleSheet} from 'react-native';

const NumberInfoScreen: FC<{}> = props => {
  return (
    <TextScreen title="Your Phone Number">
      <BaseText>
        Color Chat uses your phone number to authenticate you and to connect you
        with friends already on Color Chat.{'\n\n'}
      </BaseText>
      <BaseText>
        Color Chat does not share your phone number with other users, but will
        allow them to message you if you're already listed in their contacts.
        {'\n\n'}
      </BaseText>
      <BaseText>
        Color Chat does not, and will never, share your phone number with third
        parties for any reason except to comply with the law or protect the
        rights, property, or safety of you or others.{'\n\n'}
      </BaseText>
      <BaseText>
        If you have any questions, please contact{' '}
        <TextLink href="mailto:hello@soft.works" style={style.link}>
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

export default NumberInfoScreen;
