import createRoutingReducer, {CaseReducer} from '../createRoutingReducer';
import {
  ContactsState,
  ImportContactsAction,
  Contact,
  MatchedContact,
  ContactMatchData,
} from './types';
import {AsyncActionState} from '../../lib/AsyncAction';

let initialState: ContactsState = [];

let handlers: {[key: string]: CaseReducer<ContactsState, any>} = {
  importContacts: (state, action: ImportContactsAction) => {
    if (action.state !== AsyncActionState.Complete) return state;

    const matches = action.result.matches.reduce((memo, m) => {
      memo[m.index] = m;
      return memo;
    }, [] as ContactMatchData[]);

    const contacts: Contact[] = action.result.contacts.map((c, i) => {
      return matches[i]
        ? {
            ...c,
            matched: true,
            id: matches[i].userId,
            avatar: matches[i].avatar,
          }
        : {
            ...c,
            matched: false,
          };
    });

    return contacts.sort((a, b) => {
      const aMatched = (a as MatchedContact).matched;
      const bMatched = (b as MatchedContact).matched;
      const aName = a.givenName + a.familyName;
      const bName = b.givenName + b.familyName;
      if (aMatched && !bMatched) return -1;
      else if (bMatched && !aMatched) return 1;
      else if (aName < bName) return -1;
      else if (aName > bName) return 1;
      else return 0;
    });
  },
};

export default createRoutingReducer<ContactsState>({
  handlers,
  initialState,
});
