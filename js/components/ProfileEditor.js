import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import withStyles from "../lib/withStyles";
import AvatarEditor from "./AvatarEditor";
import BaseText from "./BaseText";
import BaseTextInput from "./BaseTextInput";
import ErrorMessage from "./ErrorMessage";

const avatarDescription = `Touch and drag to change\nyour avatar color`;
const nameDescription = `Your friends will see this in push notifications when you message them`;

class ProfileEditor extends Component {
  state = {
    showNameError: false
  };

  render() {
    return (
      <View style={this.props.style}>
        {this.renderAvatarField()}
        {this.renderNameField()}
      </View>
    );
  }

  renderAvatarField = () => {
    const { styles } = this.props;

    return (
      <View style={styles.avatarInputWrapper}>
        <View style={styles.fieldMeta}>
          <BaseText style={styles.fieldLabel}>Avatar</BaseText>
        </View>

        <View style={styles.avatarInputContent}>
          <AvatarEditor
            style={styles.avatarEditor}
            onInteractionStart={this.props.onColorPickerInteractionStart}
            onInteractionEnd={this.props.onColorPickerInteractionEnd}
            onChange={this.handleAvatarChange}
            scaleAxis="x"
            initialValue={this.props.value.avatar}
          />
        </View>

        {this.renderDescription(avatarDescription)}
      </View>
    );
  };

  renderNameField = () => {
    const { styles, theme } = this.props;

    return (
      <View style={styles.nameInputWrapper}>
        <View style={styles.fieldMeta}>
          <BaseText style={styles.fieldLabel}>Name</BaseText>
        </View>

        {this.state.showNameError && (
          <ErrorMessage
            message="Please enter a name"
            onRemove={this.handleDismissNameError}
          />
        )}

        <View style={styles.nameInput}>
          <BaseTextInput
            placeholder="Your Name"
            value={this.props.value.name}
            placeholderTextColor={theme.secondaryTextColor}
            onChangeText={this.handleNameChange}
          />
        </View>

        {this.renderDescription(nameDescription)}
      </View>
    );
  };

  renderDescription(text) {
    const { styles } = this.props;
    return <BaseText style={styles.fieldDescription}>{text}</BaseText>;
  }

  handleAvatarChange = newAvatar => {
    this.props.onChange &&
      this.props.onChange({
        avatar: newAvatar,
        name: this.props.value.name
      });
  };

  handleNameChange = newName => {
    console.log("name change", newName);
    this.props.onChange &&
      this.props.onChange({
        avatar: this.props.value.avatar,
        name: newName
      });
  };

  handleDismissNameError = () => {
    this.setState({ showNameError: false });
  };
}

var getStyles = theme => ({
  fieldMeta: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10
  },
  fieldLabel: {
    marginRight: 36
  },
  fieldDescription: {
    fontSize: 13,
    width: 250,
    color: theme.secondaryTextColor,
    marginTop: 10
  },
  avatarInputWrapper: {
    marginBottom: 36
  },
  avatarEditor: {
    width: "100%",
    height: 125,
    borderRadius: 0
  },
  nameInputWrapper: {},
  nameInput: {
    borderColor: theme.primaryBorderColor,
    borderWidth: StyleSheet.hairlineWidth,
    paddingLeft: 12
  }
});

export default withStyles(getStyles)(ProfileEditor);
