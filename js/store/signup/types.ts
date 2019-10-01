import {AsyncAction} from '../../lib/AsyncAction';
import {ApiConfirmNumberResponse} from '../../lib/ChatApi';
export interface SignupData {
  country: string;
  countryCode: string;
  baseNumber: string;
  confirmationCode: string;
}

export type SignupState = SignupData;

export const UPDATE_DATA = 'updateData';
export const REGISTER_PHONE_NUMBER = 'registerPhoneNumber';
export const SUBMIT_CONFIRMATION_CODE = 'submitConfirmationCode';
export const CLEAR_SIGNUP_ERROR = 'clearSignupError';
export const CLEAR_CONFIRM_CODE_ERROR = 'clearConfirmCodeError';

export interface UpdateDataAction {
  type: typeof UPDATE_DATA;
  data: Partial<SignupData>;
}

export interface RegisterPhoneNumberBaseAction {
  type: typeof REGISTER_PHONE_NUMBER;
}

export type RegisterPhoneNumberAction = AsyncAction<
  RegisterPhoneNumberBaseAction
>;

export interface SubmitConfirmationCodeBaseAction {
  type: typeof SUBMIT_CONFIRMATION_CODE;
}

export type SubmitConfirmationCodeAction = AsyncAction<
  SubmitConfirmationCodeBaseAction,
  ApiConfirmNumberResponse
>;

export interface ClearSignupErrorAction {
  type: typeof CLEAR_SIGNUP_ERROR;
}

export interface ClearConfirmCodeErrorAction {
  type: typeof CLEAR_CONFIRM_CODE_ERROR;
}
