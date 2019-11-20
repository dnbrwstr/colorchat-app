import React, {FC} from 'react';
import {View, Keyboard, StyleSheet} from 'react-native';
import BaseTextInput from './BaseTextInput';
import {connect, useDispatch, useSelector} from 'react-redux';
import Style from '../style';
import LoaderButton from './LoaderButton';
import ErrorMessage from './ErrorMessage';
import PressableView from './PressableView';
import BaseText from './BaseText';
import {signupScreenSelector} from '../store/Selectors';
import {
  updateData,
  registerPhoneNumber,
  clearSignupError,
} from '../store/signup/actions';
import {navigateTo} from '../store/navigation/actions';
import SignupScreen from './SignupScreen';
import withStyles, {useStyles, makeStyleCreator} from '../lib/withStyles';
import {Theme} from '../style/themes';

interface SignupStartScreenProps {
  loading: boolean;
  countryCode: string;
  baseNumber: string;
}

const SignupStartScreen: FC<SignupStartScreenProps> = props => {
  const dispatch = useDispatch();
  const {theme, styles} = useStyles(getStyles);
  const {error} = useSelector(signupScreenSelector);

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleUsageInfoLinkPress = () => {
    dispatch(navigateTo('numberInfo'));
  };

  const showCountryPicker = () => {
    hideKeyboard();
    dispatch(navigateTo('countryPicker'));
  };

  const onSubmitNumber = () => {
    hideKeyboard();
    dispatch(registerPhoneNumber());
  };

  const updateBaseNumber = (baseNumber: string) => {
    dispatch(updateData({baseNumber}));
  };

  const renderNextButton = () => {
    return (
      <LoaderButton
        loading={props.loading}
        onPress={onSubmitNumber}
        message="Send message"
      />
    );
  };

  return (
    <SignupScreen
      scrollEnabled={false}
      title="Setup"
      renderNextButton={renderNextButton}
    >
      <BaseText style={styles.welcomeMessage}>
        Color Chat will send you an SMS message to verify your phone number.
      </BaseText>

      {error && (
        <ErrorMessage
          message={error.toString()}
          onRemove={() => dispatch(clearSignupError())}
        />
      )}

      <View style={styles.numberInputContainer}>
        <PressableView
          style={styles.countryCodeWrapper}
          activeStyle={styles.countryCodeWrapperActive}
          onPress={showCountryPicker}
        >
          <BaseText style={styles.countryCode}>+{props.countryCode}</BaseText>
        </PressableView>

        <View style={styles.baseNumberInputWrapper}>
          <BaseTextInput
            style={styles.baseNumberInput}
            value={props.baseNumber}
            onChangeText={updateBaseNumber}
            placeholder="Phone Number"
            placeholderTextColor={theme.secondaryTextColor}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <PressableView
        style={styles.usageInfoLink}
        onPress={handleUsageInfoLinkPress}
      >
        <BaseText style={styles.usageInfoText}>
          How Color Chat uses your number
        </BaseText>
      </PressableView>
    </SignupScreen>
  );
};

const getStyles = makeStyleCreator((theme: Theme) => ({
  welcomeMessage: {
    marginTop: 0,
    marginBottom: 20,
  },
  numberInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginBottom: 8,
    height: Style.values.buttonHeight,
  },
  countryCodeWrapper: {
    borderColor: theme.primaryBorderColor,
    borderWidth: StyleSheet.hairlineWidth,
    width: Style.values.buttonHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryCodeWrapperActive: {
    backgroundColor: theme.highlightColor,
  },
  countryCode: {
    textAlign: 'center',
    paddingVertical: 10,
  },
  baseNumberInputWrapper: {
    borderColor: theme.primaryBorderColor,
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 0,
    alignSelf: 'stretch',
    flex: 1,
  },
  baseNumberInput: {},
  usageInfoLink: {
    marginTop: 0,
  },
  usageInfoText: {
    fontSize: Style.values.smallFontSize,
    textAlign: 'center',
    color: theme.secondaryTextColor,
    textDecorationLine: 'underline',
  },
}));

export default withStyles(getStyles)(
  connect(signupScreenSelector)(SignupStartScreen),
);
