import React, {FC, useMemo} from 'react';
import {Animated, TextProps} from 'react-native';
import Color from 'color';
import Style from '../style';
import {useStyles} from '../lib/withStyles';
import {Theme} from '../style/themes';

interface BaseTextProps extends TextProps {
  style?: any;
  visibleOn?: string;
}

export const BaseText: FC<BaseTextProps> = props => {
  const {visibleOn, ...textProps} = props;
  const {styles} = useStyles(getStyles);

  const style = useMemo(() => {
    const color = Color(visibleOn).luminosity() > 0.5 ? 'black' : 'white';
    return [styles.text, props.visibleOn && {color}, props.style];
  }, [visibleOn, textProps.style, styles]);

  return <Animated.Text {...textProps} style={style} />;
};

const getStyles = (theme: Theme) => ({
  text: {
    ...Style.mixins.textBase,
    color: theme.primaryTextColor,
  },
});

export default BaseText;
