import React, {ReactNode, FC, useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import Style from '../style';
import PressableView from './PressableView';
import {makeStyleCreator, useStyles} from '../lib/withStyles';
import Text from './BaseText';
import {Theme} from '../style/themes';
import {isUndefined} from '../lib/Utils';
import {useFocusEffect} from 'react-navigation-hooks';
import {useDispatch} from 'react-redux';
import {navigateBack} from '../store/navigation/actions';
import {isExpanded} from '../lib/MessageUtils';

interface HeaderProps {
  hideBackButton?: boolean;
  showBorder?: boolean;
  onPressBack?: () => void;
  onPressSettings?: () => void;
  renderTitle?: () => ReactNode;
  renderSettingsButton?: () => ReactNode;
}

const useBack = (cb?: () => void) => {
  const dispatch = useDispatch();
  const [canNavigateBack, setCanNavigateBack] = useState(false);

  useFocusEffect(() => {
    setCanNavigateBack(true);
  });

  return useCallback(() => {
    if (!canNavigateBack) return;
    dispatch(navigateBack());
    cb && cb();
    setCanNavigateBack(false);
  }, [canNavigateBack, cb]);
};

const Header: FC<HeaderProps> = props => {
  const {styles} = useStyles(getStyles);
  const goBack = useBack(props.onPressBack);
  const showBorder = isUndefined(props.showBorder) ? true : props.showBorder;
  const barStyles = [styles.bar, showBorder && styles.borderBar];

  return (
    <View style={barStyles}>
      <View style={styles.background} />

      <View style={styles.buttonContainer}>
        {!props.hideBackButton && (
          <PressableView
            onPress={goBack}
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
          <Text style={styles.titleText}>{props.children}</Text>
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
