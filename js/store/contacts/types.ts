import {PermissionStatus} from 'react-native';
import {Contact as NativeContact} from 'react-native-contacts';
import {AsyncAction} from '../../lib/AsyncAction';

export interface UnmatchedContact extends Omit<NativeContact, 'phoneNumbers'> {
  phoneNumber: string;
}

export interface MatchedContact extends UnmatchedContact {
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
  contacts: UnmatchedContact[];
}

export type ImportContactsAction = AsyncAction<
  ImportContactsBaseAction,
  ImportContactsResult
>;

export type ContactMap = {
  [key: string]: UnmatchedContact;
};

export type ContactPermissionStatus =
  | PermissionStatus
  | 'undefined'
  | 'authorized';

export interface ContactImportOptions {
  askPermission: boolean;
}

export type ContactsActionTypes = ImportContactsAction;
