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
    let phoneNumbers = contacts.map(c => c.phoneNumbers.map(n => n.number));
    let token = getState().user.token;
    let matches;

    if (!token) {
      return dispatch({
        'type': 'authError'
      });
    }

    try {
      let res = await postAuthenticatedJSON(serverRoot + '/match', { phoneNumbers }, token);

      if (res.status === 403) {
        return dispatch({
          type: 'authError'
        });
      }

      matches = await res.json();

      dispatch({
        type: 'importContacts',
        state: 'complete',
        contacts: contacts,
        matches: matches
      });
    } catch (e) {
      dispatch({
        type: 'importContacts',
        state: 'failed',
        error: 'Unable to match connect to server'
      });
    }
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
