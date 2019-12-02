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
  importError: string | null;
  onPressImport: () => void;
  onRequestInfo: () => void;
}

const ContactsImportPrompt: FC<ContactsImportPromptProps> = props => {
  const {importError} = props;
  const {styles} = useStyles(getStyles);

  const states = {
    default: {
      info: `${config.appName} uses your contacts to\ndetermine who you can chat with`,
      button: 'Import contacts',
    },
    needsPermission: {
      info: `${config.appName} uses your contacts to\ndetermine who you can chat with`,
      button: 'Allow access',
    },
    serverError: {
      info: importError,
      button: 'Retry',
    },
  };

  let state: keyof typeof states = 'default';
  if (props.importError) {
    if (props.importError && props.importError === 'Permission denied') {
      state = 'needsPermission';
    } else {
      state = 'serverError';
    }
  }

  const strings = states[state];

  return (
    <View style={styles.container}>
      <BaseText style={styles.messageText}>{strings.info}</BaseText>

      <SquareButton
        label={strings.button}
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
    marginTop: 24,
  },
  infoLinkText: {
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontSize: Style.values.smallFontSize,
    lineHeight: Style.values.smallFontLeading,
  },
}));

export default ContactsImportPrompt;
