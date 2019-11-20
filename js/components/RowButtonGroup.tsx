import React, {FC} from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import {useStyles, makeStyleCreator} from '../lib/withStyles';
import Text from './BaseText';
import Style from '../style';
import PressableView from './PressableView';
import {Theme} from '../style/themes';

interface RowButtonProps {
  style: StyleProp<ViewStyle>;
  buttons: {
    label: string;
    action: () => void;
  }[];
}

const RowButtonGroup: FC<RowButtonProps> = props => {
  const {styles} = useStyles(getStyles);
  const {style, buttons} = props;

  return (
    <View style={[styles.container, style]}>
      {buttons &&
        buttons.map(b => {
          return (
            <PressableView
              key={b.label}
              style={styles.button}
              activeStyle={styles.buttonActive}
              onPress={b.action}
            >
              <Text>{b.label}</Text>
            </PressableView>
          );
        })}
    </View>
  );
};

const getStyles = makeStyleCreator((theme: Theme) => ({
  container: {
    borderBottomWidth: Style.values.borderWidth,
    borderBottomColor: theme.secondaryBorderColor,
  },
  button: {
    borderTopWidth: Style.values.borderWidth,
    borderTopColor: theme.secondaryBorderColor,
    height: Style.values.rowHeight,
    padding: Style.values.outerPadding,
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: theme.highlightColor,
  },
  buttonText: {},
}));

export default RowButtonGroup;
