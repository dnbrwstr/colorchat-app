import { sortBy } from 'ramda';
import createRoutingReducer from '../lib/createRoutingReducer';

let initialState = [];

let handlers = {
  importContacts: (state, action) => {
    if (action.state !== 'complete') return state;

    let { contacts, matches } = action;
    matches.forEach((m) => contacts[m.index] = {
      ...contacts[m.index],
      matched: true,
      id: m.userId
    });

    let results = sortBy(c => {
      return (c.matched ? 'a' : 'z') + c.firstName + c.lastName;
    }, contacts);

    return results;
  }
}

export default createRoutingReducer({
  key: 'contacts',
  handlers,
  initialState
});
