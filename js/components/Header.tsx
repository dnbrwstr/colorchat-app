import React, {ReactNode, FC} from 'react';
import {View, StyleSheet} from 'react-native';
import Style from '../style';
import PressableView from './PressableView';
import {makeStyleCreator, useStyles} from '../lib/withStyles';
import Text from './BaseText';
import {Theme} from '../style/themes';

interface HeaderProps {
  showBorder: boolean;
  title: string;
  onPressBack?: () => void;
  onPressSettings?: () => void;
  renderTitle?: () => ReactNode;
  renderSettingsButton?: () => ReactNode;
}

const HeaderFn: FC<HeaderProps> = props => {
  const {styles} = useStyles(getStyles);

  const barStyles = [styles.bar, props.showBorder && styles.borderBar];

  return (
    <View style={barStyles}>
      <View style={styles.background} />

      <View style={styles.buttonContainer}>
        {props.onPressBack && (
          <PressableView
            onPress={props.onPressBack}
            style={styles.button}
            activeStyle={[styles.buttonActive]}
          >
            <Text style={[styles.buttonText]}>Back</Text>
          </PressableView>
        )}
      </View>

      <View style={styles.title}>
        {props.renderTitle ? (
          props.renderTitle()
        ) : (
          <Text style={styles.titleText}>{props.title}</Text>
        )}
      </View>

      <View style={[styles.buttonContainer, styles.rightButtonContainer]}>
        {props.onPressSettings && (
          <PressableView
            onPress={props.onPressSettings}
            style={styles.button}
            activeStyle={styles.buttonActive}
          >
            {props.renderSettingsButton ? (
              props.renderSettingsButton()
            ) : (
              <Text style={[styles.buttonText]}>Settings</Text>
            )}
          </PressableView>
        )}
      </View>
    </View>
  );
};

const getStyles = makeStyleCreator((theme: Theme) => ({
  bar: {
    height: Style.values.rowHeight,
    alignItems: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 0,
    backgroundColor: 'transparent',
  },
  borderBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.secondaryBorderColor,
  },
  background: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    textAlign: 'center',
  },
  buttonContainer: {
    width: 80,
    alignItems: 'flex-start',
  },
  rightButtonContainer: {
    alignItems: 'flex-end',
  },
  button: {
    justifyContent: 'center',
    paddingHorizontal: Style.values.outerPadding,
    height: '100%',
  },
  buttonActive: {
    backgroundColor: theme.highlightColor,
  },
  buttonText: {},
  buttonSecondText: {
    textAlign: 'right',
  },
}));

export default Header;
