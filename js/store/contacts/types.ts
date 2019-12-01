import {PermissionStatus} from 'react-native';
import {Contact as NativeContact} from 'react-native-contacts';
import {AsyncAction} from '../../lib/AsyncAction';

export interface RawContactWithNumber
  extends Omit<NativeContact, 'phoneNumbers'> {
  phoneNumber: string;
}

export type ContactMap = {
  [key: string]: RawContactWithNumber;
};

export interface BaseContact
  extends Omit<Partial<NativeContact>, 'phoneNumbers'> {
  matched: boolean;
  phoneNumber: string;
  givenName: string;
  familyName: string;
}

export interface UnmatchedContact extends BaseContact {
  matched: false;
  phoneNumber: string;
}

export interface MatchedContact extends BaseContact {
  matched: true;
  id: number;
  avatar: string;
}

export type Contact = UnmatchedContact | MatchedContact;

export type ContactsState = Contact[];

export interface ContactMatchData {
  blocked: boolean;
  index: number;
  avatar: string;
  userId: number;
}

export const IMPORT_CONTACTS = 'importContacts';

export type ImportContactsBaseAction = {
  type: typeof IMPORT_CONTACTS;
};

export interface ImportContactsResult {
  matches: ContactMatchData[];
  contacts: RawContactWithNumber[];
}

export type ImportContactsAction = AsyncAction<
  ImportContactsBaseAction,
  ImportContactsResult
>;

export type ContactPermissionStatus =
  | PermissionStatus
  | 'undefined'
  | 'authorized';

export interface ContactImportOptions {
  askPermission: boolean;
}

export type ContactsActionTypes = ImportContactsAction;
