import * as Api from '../../lib/ChatApi';
import {
  SignupData,
  UpdateDataAction,
  ClearSignupErrorAction,
  CLEAR_SIGNUP_ERROR,
  ClearConfirmCodeErrorAction,
  CLEAR_CONFIRM_CODE_ERROR,
  REGISTER_PHONE_NUMBER,
  RegisterPhoneNumberBaseAction,
  SUBMIT_CONFIRMATION_CODE,
  RegisterPhoneNumberAction,
  SubmitConfirmationCodeBaseAction,
  SubmitConfirmationCodeAction,
} from './types';
import {ThunkResult} from '../createStore';
import {dispatchAsyncActions} from '../../lib/AsyncAction';

const sanitizeNumber = (number: string) => number.replace(/[^0-9]/g, '');

const formatPhoneNumber = (countryCode: string, baseNumber: string) =>
  `+${[countryCode, baseNumber].map(sanitizeNumber).join('')}`;

export let updateData = (newData: Partial<SignupData>): UpdateDataAction => {
  return {
    type: 'updateData',
    data: newData,
  };
};

export let registerPhoneNumber = (): ThunkResult<Promise<void>> => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const {countryCode, baseNumber} = state.signup;
  const operation = Api.registerPhoneNumber(countryCode, baseNumber);
  const baseAction = createRegisterPhoneNumberBaseAction();
  dispatchAsyncActions<RegisterPhoneNumberAction>(
    baseAction,
    operation,
    dispatch,
  );
};

export const createRegisterPhoneNumberBaseAction = (): RegisterPhoneNumberBaseAction => {
  return {
    type: REGISTER_PHONE_NUMBER,
  };
};

export const submitConfirmationCode = (): ThunkResult<Promise<void>> => async (
  dispatch,
  getState,
) => {
  const {baseNumber, countryCode, confirmationCode} = getState().signup;
  const phoneNumber = formatPhoneNumber(countryCode, baseNumber);
  const operation = Api.submitConfirmationCode(phoneNumber, confirmationCode);
  const baseAction = createSubmitConfirmationCodeBaseAction();
  dispatchAsyncActions<SubmitConfirmationCodeAction>(
    baseAction,
    operation,
    dispatch,
  );
};

export const createSubmitConfirmationCodeBaseAction = (): SubmitConfirmationCodeBaseAction => {
  return {
    type: SUBMIT_CONFIRMATION_CODE,
  };
};

export let clearSignupError = (): ClearSignupErrorAction => ({
  type: CLEAR_SIGNUP_ERROR,
});

export let clearConfirmCodeError = (): ClearConfirmCodeErrorAction => ({
  type: CLEAR_CONFIRM_CODE_ERROR,
});
