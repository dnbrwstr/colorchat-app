import createRoutingReducer, {CaseReducer} from '../createRoutingReducer';
import {
  ContactsState,
  ImportContactsAction,
  Contact,
  MatchedContact,
} from './types';
import {AsyncActionState} from '../../lib/AsyncAction';

let initialState: ContactsState = [];

let handlers: {[key: string]: CaseReducer<ContactsState, any>} = {
  importContacts: (state, action: ImportContactsAction) => {
    if (action.state !== AsyncActionState.Complete) return state;

    const contacts: Contact[] = action.result.contacts;
    action.result.matches.forEach(m => {
      contacts[m.index] = {
        ...contacts[m.index],
        matched: true,
        id: m.userId,
        avatar: m.avatar,
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
