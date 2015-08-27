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

    let makeSortHash = o =>
      (o.matched ? 'a' : 'z') + o.firstName + o.lastName;

    contacts = contacts.sort(function (a, b) {
      let hashA = makeSortHash(a);
      let hashB = makeSortHash(b);

      if (hashA < hashB) return -1;
      else if (hashA > hashB) return 1;
      else return 0;
    });

    return contacts;
  }
}

export default createRoutingReducer(handlers, initialState);
