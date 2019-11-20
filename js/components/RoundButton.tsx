import React, {Component, FC} from 'react';
import Style from '../style';
import SpringButton, {SpringButtonProps} from './SpringButton';

const BUTTON_SIZE = 50;

export interface RoundButtonProps extends SpringButtonProps {}

const RoundButton: FC<RoundButtonProps> = props => {
  const style = [styles.button, props.style];
  const contentStyle = [styles.content, props.contentStyle];
  return <SpringButton {...props} style={style} contentStyle={contentStyle} />;
};

const styles = Style.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
  },
  content: {
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    backgroundColor: Style.values.almostBlack,
    justifyContent: 'center',
  },
});

export default RoundButton;
