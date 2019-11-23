import React, {FC} from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import PressableView from './PressableView';
import Style from '../style';

interface UserSettingsButtonProps {
  style: StyleProp<ViewStyle>;
  activeStyle: StyleProp<ViewStyle>;
  avatarColor: string;
  onPress: () => void;
}

const UserSettingsButton: FC<UserSettingsButtonProps> = props => {
  return (
    <PressableView
      onPress={props.onPress}
      style={[props.style]}
      activeStyle={[props.activeStyle]}
    >
      <View
        style={{
          width: Style.values.avatarSize,
          height: Style.values.avatarSize,
          backgroundColor: props.avatarColor,
          borderRadius: 100,
        }}
      />
    </PressableView>
  );
};

export default UserSettingsButton;
