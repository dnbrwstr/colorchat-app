import {Platform, PermissionsAndroid, Linking} from 'react-native';
import SendSMS from 'react-native-sms';
import config from '../../config';
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
  ImportContactsBaseAction,
  RawContactWithNumber,
} from './types';
import {dispatchAsyncActions} from '../../lib/AsyncAction';
import {getMatchedContacts} from '../../lib/ChatApi';

const {inviteLink} = config;

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

  const contactsByNumber = await getContactsByNumber();
  const phoneNumbers = Object.keys(contactsByNumber);
  const contacts = phoneNumbers.map(k => contactsByNumber[k]);
  const matches = await getMatchedContacts(phoneNumbers, state.user?.token);
  return filterBlockedContacts(contacts, matches);
};

const getPermission = async (shouldRequestIfMissing: boolean) => {
  let permission: ContactPermissionStatus = await checkPermission();
  if (
    (permission === 'undefined' || permission == 'denied') &&
    shouldRequestIfMissing
  ) {
    if (Platform.OS === 'ios') {
      permission = await requestPermission();
      if (permission === 'denied' && shouldRequestIfMissing) {
        Linking.openSettings();
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
      successTypes: ['all'],
      // @ts-ignore This is used but missing in the typing!
      allowAndroidSendWithoutReadPermission: true,
    },
    () => {},
  );
};
