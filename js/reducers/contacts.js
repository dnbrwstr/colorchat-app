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

      contacts.forEach(c => {
        if (c.phoneNumbers && c.phoneNumbers[0] && c.phoneNumbers[0].number === "1-913-603-6891") {
          c.firstName = "Testy";
        }
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
        importInProgress: false,
        importError: action.error,
      }
    }
  }
}

export default createRoutingReducer(handlers, initialState);
