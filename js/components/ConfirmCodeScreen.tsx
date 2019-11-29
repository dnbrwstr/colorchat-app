import React, {FC, useCallback} from 'react';
import {View, Keyboard, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import LoaderButton from './LoaderButton';
import ErrorMessage from './ErrorMessage';
import SignupScreen from './SignupScreen';
import BaseTextInput from './BaseTextInput';
import {navigateTo} from '../store/navigation/actions';
import {
  submitConfirmationCode,
  updateData,
  clearConfirmCodeError,
} from '../store/signup/actions';
import {confirmationCodeScreenSelector} from '../store/Selectors';
import withStyles, {useStyles, makeStyleCreator} from '../lib/withStyles';
import {Theme} from '../style/themes';

interface ConfirmCodeScreenProps {}

const ConfirmCodeScreen: FC<ConfirmCodeScreenProps> = props => {
  const dispatch = useDispatch();
  const {styles, theme} = useStyles(getStyles);
  const {error, loading, confirmationCode} = useSelector(
    confirmationCodeScreenSelector,
  );

  const handleSubmit = useCallback(() => {
    Keyboard.dismiss();
    dispatch(submitConfirmationCode());
  }, []);

  const renderNextButton = () => (
    <LoaderButton loading={loading} onPress={handleSubmit} message="Confirm" />
  );

  return (
    <SignupScreen
      title="Confirm code"
      showBackButton={true}
      renderNextButton={renderNextButton}
    >
      {error ? (
        <ErrorMessage
          message={error.toString()}
          onRemove={() => dispatch(clearConfirmCodeError())}
        />
      ) : null}

      <View style={styles.inputWrapper}>
        <BaseTextInput
          placeholder="SMS Code"
          value={confirmationCode}
          onChangeText={confirmationCode => {
            dispatch(updateData({confirmationCode}));
          }}
          keyboardType="phone-pad"
          placeholderTextColor={theme.secondaryTextColor}
        />
      </View>
    </SignupScreen>
  );
};

const getStyles = makeStyleCreator((theme: Theme) => ({
  inputWrapper: {
    borderColor: theme.primaryBorderColor,
    borderWidth: StyleSheet.hairlineWidth,
  },
}));

export default ConfirmCodeScreen;
