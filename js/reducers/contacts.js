import sort from 'ramda';
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

    return sort(c => {
      return (c.matched ? 'a' : 'z') + c.firstName + c.lastName;
    }, contacts);
  }
}

export default createRoutingReducer({
  key: 'contacts',
  handlers,
  initialState
});
