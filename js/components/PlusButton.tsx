import React, {FC} from 'react';
import RoundButton, {RoundButtonProps} from './RoundButton';
import {useStyles, makeStyleCreator} from '../lib/withStyles';
import PlusIcon from './PlusIcon';
import {StyleProp, TextStyle} from 'react-native';
import {Theme} from '../style/themes';

interface PlusButtonProps extends RoundButtonProps {
  textStyle: StyleProp<TextStyle>;
}

const PlusButton: FC<PlusButtonProps> = props => {
  const {styles, theme} = useStyles(getStyles);
  const {textStyle, style, ...rest} = props;
  return (
    <RoundButton contentStyle={[styles.button, style]} {...rest}>
      <PlusIcon
        style={styles.plusIcon}
        strokeColor={theme.primaryButtonTextColor}
        strokeWidth={7}
      />
    </RoundButton>
  );
};

const getStyles = makeStyleCreator((theme: Theme) => ({
  button: {
    backgroundColor: theme.primaryButtonColor,
    padding: 12,
  },
  plusIcon: {
    width: 16,
    height: 16,
  },
}));

const MemoizedPlusButton = React.memo(PlusButton);

export default MemoizedPlusButton;
