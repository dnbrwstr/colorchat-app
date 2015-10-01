import { RNMessageComposer as Composer } from 'NativeModules';
import AddressBook from 'react-native-addressbook';
import { postAuthenticatedJSON } from '../lib/RequestHelpers';
import { serverRoot } from '../config';

export let importContacts = opts => async (dispatch, getState) => {
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
    let res, matches;

    if (!token) {
      return dispatch({
        'type': 'authError'
      });
    }

    try {
      res = await postAuthenticatedJSON(serverRoot + '/match', { phoneNumbers }, token);
      matches = await res.json();
    } catch (e) {
      return dispatch({
        type: 'importContacts',
        state: 'failed',
        error: 'Unable to connect to server'
      });
    }
    if (res.status === 403) {
      return dispatch({
        type: 'authError'
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

  if (permission === 'undefined') {
    if (opts.askPermission) {
      let newPermission = await AddressBook.requestPermissionAsync();

      if (!newPermission || newPermission === 'denied') {
        onPermissionDenied();
      } else {
        onPermissionGranted();
      }
    }
  } else if (permission === 'authorized') {
    onPermissionGranted();
  } else {
    onPermissionDenied();
  }
}

export let sendInvite = contact => (dispatch, getState) => {
  // Get invite link from server
  // fetch...
  let link = 'https://invite';
  let message = 'Join me on Color Chat ' + link;

  Composer.composeMessageWithArgs({
    recipients: [contact.phoneNumbers[0].number],
    messageText: message
  }, function () {
    // Throws if there's no callback
  });
}