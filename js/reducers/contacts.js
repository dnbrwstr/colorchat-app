import createRoutingReducer from '../lib/createRoutingReducer';

let initialState = {
  imported: false,
  importInProgress: false,
  importError: null,
  data: null
};

let handlers = {
  importContacts: (state, action) => {
    if (action.state === 'started') {
      return {
        ...state,
        importInProgress: true
      };
    } else if (action.state === 'complete') {
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

      return {
        ...state,
        imported: true,
        importInProgress: false,
        importError: null,
        data: contacts
      }
    } else if (action.state === 'failed') {
      return {
        ...state,
        imported: false,
        importInProgress: false,
        importError: action.error,
        data: null
      }
    }
  }
}

export default createRoutingReducer(handlers, initialState);
