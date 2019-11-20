import React, {FC, ReactNode, PropsWithChildren} from 'react';
import {View} from 'react-native';
import Style from '../style';
import Header from './Header';
import BaseText from './BaseText';
import withStyles, {useStyles, makeStyleCreator} from '../lib/withStyles';
import {Theme} from '../style/themes';

interface TextScreenProps {
  title: string;
  onNavigateBack: () => void;
  children?: ReactNode;
}

const TextScreen: FC<TextScreenProps> = props => {
  const {styles} = useStyles(getStyles);

  return (
    <View style={styles.container}>
      <Header
        title={props.title}
        onPressBack={props.onNavigateBack}
        showBorder={false}
      />
      <View style={styles.content}>
        <BaseText style={styles.text}>{props.children}</BaseText>
      </View>
    </View>
  );
};

const getStyles = makeStyleCreator((theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  content: {
    ...Style.mixins.contentWrapperBase,
    paddingTop: 20,
  },
  text: {
    lineHeight: 21,
  },
}));

export default TextScreen;
