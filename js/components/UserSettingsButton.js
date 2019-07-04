import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import PressableView from "./PressableView";
import Style from "../style";

const UserSettingsButton = props => {
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
          borderRadius: 100
        }}
      />
    </PressableView>
  );
};

const selector = state => {
  return {
    avatarColor: state.user.avatar
  };
};

export default connect(selector)(UserSettingsButton);
