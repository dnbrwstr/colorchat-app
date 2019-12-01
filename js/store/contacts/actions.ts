import {Platform, PermissionsAndroid, NativeModules} from 'react-native';
import SendSMS, {AndroidSuccessTypes} from 'react-native-sms';
import {postAuthenticatedJSON} from '../../lib/RequestHelpers';
import config from '../../config';
import send from '../../lib/send';
import {
  checkPermission,
  requestPermission,
  getAll,
} from '../../lib/ContactUtils';
import {ThunkResult, AppState} from '../createStore';
import {
  ContactMatchData,
  UnmatchedContact,
  ContactImportOptions,
  ContactPermissionStatus,
  ImportContactsAction,
  IMPORT_CONTACTS,
  ContactMap,
  MatchedContact,
  ImportContactsBaseAction,
  RawContactWithNumber,
} from './types';
import {selectUserToken} from '../user/selectors';
import {AsyncActionState, dispatchAsyncActions} from '../../lib/AsyncAction';

const {SettingsApp} = NativeModules;

const {serverRoot, inviteLink} = config;

export const importContacts = ({
  askPermission,
}: ContactImportOptions): ThunkResult<Promise<void>> => async (
  dispatch,
  getState,
) => {
  const baseAction: ImportContactsBaseAction = {
    type: IMPORT_CONTACTS,
  };
  const operation = runContactImport(askPermission, getState());
  dispatchAsyncActions<ImportContactsAction>(baseAction, operation, dispatch);
};

const runContactImport = async (askPermission: boolean, state: AppState) => {
  const hasPermission = await getPermission(askPermission);
  if (!hasPermission) {
    throw new Error('Permission denied');
  }

  const token = selectUserToken(state);
  if (!token) {
    throw new Error('Unable to match contacts, no user token!');
  }

  const contactsByNumber = await getContactsByNumber();
  const phoneNumbers = Object.keys(contactsByNumber);
  const contacts = phoneNumbers.map(k => contactsByNumber[k]);
  const url = serverRoot + '/match';
  const getRequest = () => postAuthenticatedJSON(url, {phoneNumbers}, token);
  const matches = await send<ContactMatchData[]>(getRequest);
  return filterBlockedContacts(contacts, matches);
};

const getPermission = async (shouldRequestIfMissing: boolean) => {
  console.log('groooting position');
  let permission: ContactPermissionStatus = await checkPermission();
  if (
    (permission === 'undefined' || permission == 'denied') &&
    shouldRequestIfMissing
  ) {
    if (Platform.OS === 'ios') {
      permission = await requestPermission();
      if (permission === 'denied' && shouldRequestIfMissing) {
        SettingsApp.openSettings();
      }
    } else {
      permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );
    }
  }
  return permission === 'authorized' || permission === 'granted';
};

const getContactsByNumber = async (): Promise<ContactMap> => {
  const rawContacts = await getAll();
  // Map each unique phone number to a contact
  const contactsByNumber: ContactMap = {};
  rawContacts.forEach(({phoneNumbers, ...data}) => {
    phoneNumbers.forEach(({number}) => {
      contactsByNumber[normalizeNumber(number)] = {
        ...data,
        phoneNumber: number,
      };
    });
  });
  return contactsByNumber;
};

const normalizeNumber = (n: string) => n.replace(/[^\+\d]/g, '');

const filterBlockedContacts = (
  contacts: RawContactWithNumber[],
  matches: ContactMatchData[],
) => {
  const finalMatches: ContactMatchData[] = [];
  const blockedIndexes: number[] = [];
  matches.forEach(match => {
    if (match.blocked) blockedIndexes.push(match.index);
    else finalMatches.push(match);
  });
  return {
    matches: finalMatches,
    contacts: contacts.filter((c, i) => blockedIndexes.indexOf(i) === -1),
  };
};

export let sendInvite = (
  contact: UnmatchedContact,
): ThunkResult<void> => () => {
  const message =
    'Please join me in chatting with colors instead of words ' + inviteLink;
  const number = contact.phoneNumber;

  SendSMS.send(
    {
      body: message,
      recipients: [number],
      successTypes: [AndroidSuccessTypes.all],
      // @ts-ignore This is used but missing in the typing!
      allowAndroidSendWithoutReadPermission: true,
    },
    () => {},
  );
};
