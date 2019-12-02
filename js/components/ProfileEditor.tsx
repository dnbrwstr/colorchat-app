import React, {Component} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import withStyles, {InjectedStyles, makeStyleCreator} from '../lib/withStyles';
import AvatarEditor from './AvatarEditor';
import BaseText from './BaseText';
import BaseTextInput from './BaseTextInput';
import {Theme} from '../style/themes';

const avatarDescription = `Touch and drag to change\nyour avatar color`;
const nameDescription = `Your friends will see this in push notifications when you message them`;

export interface ProfileData {
  avatar: string;
  name: string;
}

interface ProfileEditorProps {
  style?: StyleProp<ViewStyle>;
  styles: InjectedStyles<typeof getStyles>;
  theme: Theme;
  value: ProfileData;
  onColorPickerInteractionStart: () => void;
  onColorPickerInteractionEnd: () => void;
  onChange: (user: ProfileData) => void;
}

class ProfileEditor extends Component<ProfileEditorProps> {
  render() {
    return (
      <View style={this.props.style}>
        {this.renderAvatarField()}
        {this.renderNameField()}
      </View>
    );
  }

  renderAvatarField = () => {
    const {styles, theme} = this.props;
    const avatarColor = this.props.value.avatar || theme.defaultAvatarColor;

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
            scaleAxis="both"
            initialValue={avatarColor}
          />
        </View>

        {this.renderDescription(avatarDescription)}
      </View>
    );
  };

  renderNameField = () => {
    const {styles, theme} = this.props;

    return (
      <View style={styles.nameInputWrapper}>
        <View style={styles.fieldMeta}>
          <BaseText style={styles.fieldLabel}>Name</BaseText>
        </View>

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

  renderDescription(text: string) {
    const {styles} = this.props;
    return <BaseText style={styles.fieldDescription}>{text}</BaseText>;
  }

  handleAvatarChange = (newAvatar: string) => {
    this.props.onChange &&
      this.props.onChange({
        avatar: newAvatar,
        name: this.props.value.name || '',
      });
  };

  handleNameChange = (newName: string) => {
    const {theme} = this.props;
    this.props.onChange &&
      this.props.onChange({
        avatar: this.props.value.avatar || theme.defaultAvatarColor,
        name: newName,
      });
  };
}

var getStyles = makeStyleCreator((theme: Theme) => ({
  fieldMeta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  fieldLabel: {
    marginRight: 36,
  },
  fieldDescription: {
    fontSize: 13,
    lineHeight: 16,
    width: 250,
    color: theme.secondaryTextColor,
    marginTop: 10,
  },
  avatarInputWrapper: {
    marginBottom: 36,
  },
  avatarInputContent: {},
  avatarEditor: {
    width: '100%',
    height: 125,
    borderRadius: 0,
  },
  nameInputWrapper: {},
  nameInput: {
    borderColor: theme.primaryBorderColor,
    borderWidth: StyleSheet.hairlineWidth,
  },
}));

export default withStyles(getStyles)(ProfileEditor);
