import AddressBook from 'react-native-addressbook'
import { postAuthenticatedJSON } from '../lib/RequestHelpers';
import { serverRoot } from '../config';

export let importContacts = (opts) => async (dispatch, getState) => {
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
    let token = getState().user.token;
    let matches;

    try {
      let res = await postAuthenticatedJSON(serverRoot + '/match', { numbers }, token);
      matches = await res.json();
    } catch (e) {
      dispatch({
        type: 'importContacts',
        state: 'failed',
        error: 'Unable to match contacts with server'
      });
    }

    dispatch({
      type: 'importContacts',
      state: 'complete',
      contacts: contacts,
      matches: matches
    });
  };

  dispatch({
    type: 'importContacts',
    state: 'started'
  });

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
