import React, {FC} from 'react';
import {View} from 'react-native';
import BaseText from './BaseText';
import SquareButton from './SquareButton';
import PressableView from './PressableView';
import Style from '../style';
import {useStyles, makeStyleCreator} from '../lib/withStyles';
import config from '../config';
import {Theme} from '../style/themes';

interface ContactsImportPromptProps {
  onPressImport: () => void;
  onRequestInfo: () => void;
}

const ContactsImportPrompt: FC<ContactsImportPromptProps> = props => {
  const {styles} = useStyles(getStyles);

  return (
    <View style={styles.container}>
      <BaseText style={styles.messageText}>
        {config.appName} uses your{'\n'}contacts to determine{'\n'}who you can
        chat with
      </BaseText>

      <SquareButton
        label="Import Contacts"
        onPress={props.onPressImport}
        style={styles.button}
        textStyle={styles.buttonText}
      />

      <PressableView style={styles.infoLink} onPress={props.onRequestInfo}>
        <BaseText style={styles.infoLinkText}>
          More about how Color Chat{'\n'}uses your contacts
        </BaseText>
      </PressableView>
    </View>
  );
};

const getStyles = makeStyleCreator((theme: Theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.backgroundColor,
  },
  messageText: {
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.primaryButtonColor,
    borderWidth: 0,
  },
  buttonActive: {
    backgroundColor: theme.highlightColor,
  },
  buttonText: {
    color: theme.primaryButtonTextColor,
  },
  infoLink: {
    marginTop: 20,
  },
  infoLinkText: {
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontSize: Style.values.smallFontSize,
  },
}));

export default ContactsImportPrompt;