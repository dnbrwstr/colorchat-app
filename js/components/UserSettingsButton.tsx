import React, {FC} from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import {useSelector} from 'react-redux';
import PressableView from './PressableView';
import Style from '../style';
import {AppState} from '../store/createStore';

interface UserSettingsButtonProps {
  style: StyleProp<ViewStyle>;
  activeStyle: StyleProp<ViewStyle>;
  avatarColor: string;
  onPress: () => void;
}

const UserSettingsButton: FC<UserSettingsButtonProps> = props => {
  const avatarColor = useSelector((state: AppState) => {
    return state.user.avatar || '#CCC';
  });

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
