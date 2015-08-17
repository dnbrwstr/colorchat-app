import AddressBook from 'react-native-addressbook'
import { postAuthenticatedJSON } from '../lib/RequestHelpers';
import { serverRoot } from '../config';

export let importContacts = (opts) => async (dispatch, getState) => {
  dispatch({
    type: 'importContacts',
    state: 'started'
  });

  let onPermissionDenied = () => {
    dispatch({
      type: 'importContacts',
      state: 'failed',
      error: 'Permission denied'
    });
  };

  let onPermissionGranted = async () => {
    let contacts = await AddressBook.getContactsAsync();
    let numbers = contacts.map(c => c.phoneNumbers.map(n => n.number));
    let token = getState().auth.token;

    let matches = await postAuthenticatedJSON(serverRoot + '/match', { numbers }, token);
    matches.forEach((m) => contacts[m.index] = {
      ...contacts[m.index],
      matched: true,
      id: m.userId
    });

    dispatch({
      type: 'importContacts',
      state: 'complete',
      contacts: contacts
    });
  };

  let permission = await AddressBook.checkPermissionAsync();

  if (!permission) {
    if (opts.askPermission) {
      let newPermission = await AddressBook.requestPermissionAsync();

      if (!newPermission || newPermission === 'denied') {
        onPermissionDenied();
      } else {
        onPermissionGranted();
      }
    }
  } else if (permission === 'denied') {
    onPermissionDenied();
  } else {
    onPermissionGranted();
  }
}
