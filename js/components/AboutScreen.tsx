import React, {FC} from 'react';
import TextScreen from './TextScreen';
import BaseText from './BaseText';
import TextLink from './TextLink';
import {StyleSheet} from 'react-native';

const AboutScreen: FC = () => {
  return (
    <TextScreen title="About">
      <BaseText>
        Color Chat is a color-based messaging application, built by Dan Brewster
        under the auspices of{' '}
        <TextLink style={style.link} href="https://soft.works">
          Soft
        </TextLink>
        .{'\n\n'}
      </BaseText>
      <BaseText>
        Please contact{' '}
        <TextLink style={style.link} href="mailto:info@soft.works">
          info@soft.works
        </TextLink>{' '}
        with any questions.
      </BaseText>
    </TextScreen>
  );
};

const style = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
  },
});

export default AboutScreen;
