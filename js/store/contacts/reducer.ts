import createRoutingReducer, {CaseHandlerMap} from '../createRoutingReducer';
import {
  ContactsState,
  ImportContactsAction,
  Contact,
  ContactMatchData,
  IMPORT_CONTACTS,
  RawContactWithNumber,
} from './types';
import {AsyncActionState} from '../../lib/AsyncAction';
import {
  LOGOUT,
  LogoutAction,
  DELETE_ACCOUNT,
  DeleteAccountAction,
} from '../user/types';

const initialState: ContactsState = [];

const createContact = (
  rawContact: RawContactWithNumber,
  matchData: ContactMatchData,
): Contact => {
  return (
    (matchData && {
      ...rawContact,
      id: matchData.userId,
      avatar: matchData.avatar,
      matched: true,
    }) || {...rawContact, matched: false}
  );
};

const handlers: CaseHandlerMap<ContactsState> = {
  [IMPORT_CONTACTS]: (state, action: ImportContactsAction) => {
    if (action.state !== AsyncActionState.Complete) return state;

    const matches = action.result.matches.reduce((memo, m) => {
      memo[m.index] = m;
      return memo;
    }, [] as ContactMatchData[]);

    const contacts: Contact[] = action.result.contacts.map((c, i) =>
      createContact(c, matches[i]),
    );

    return contacts.sort((a, b) => {
      const aMatched = a.matched;
      const bMatched = b.matched;
      const aName = a.givenName + a.familyName;
      const bName = b.givenName + b.familyName;
      if (aMatched && !bMatched) return -1;
      else if (bMatched && !aMatched) return 1;
      else if (aName < bName) return -1;
      else if (aName > bName) return 1;
      else return 0;
    });
  },

  [LOGOUT]: (state, action: LogoutAction) => {
    return initialState;
  },

  [DELETE_ACCOUNT]: (state, action: DeleteAccountAction) => {
    return initialState;
  },
};

export default createRoutingReducer<ContactsState>({
  handlers,
  initialState,
});
