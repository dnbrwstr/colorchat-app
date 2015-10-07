import { RNMessageComposer as Composer, SettingsApp } from 'NativeModules';
import AddressBook from 'react-native-addressbook';
import { postAuthenticatedJSON } from '../lib/RequestHelpers';
import { serverRoot } from '../config';

/**
 * Attempt to import contacts from address book, sending
 * phone numbers to the server so that we can determine
 * which contacts are also users.
 */
export let importContacts = opts => async (dispatch, getState) => {
  let userToken = getState().user.token;

  dispatch({
    type: 'importContacts',
    state: 'started'
  });

  let permission = await AddressBook.checkPermissionAsync();

  if (permission === 'undefined' && opts.askPermission) {
    permission = await AddressBook.requestPermissionAsync();
  }

  if (permission === 'denied' && opts.askPermission) {
    SettingsApp.openSettings();
  }

  if (permission === 'authorized') {
    onPermissionGranted(userToken, dispatch);
  } else {
    onPermissionDenied(dispatch);
  }
};

let onPermissionGranted = async (userToken, dispatch) => {
  let contacts = await AddressBook.getContactsAsync();
  let phoneNumbers = contacts.map(c => c.phoneNumbers.map(n => n.number));
  let res, matches;

  try {
    res = await postAuthenticatedJSON(serverRoot + '/match', { phoneNumbers }, userToken);
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

let onPermissionDenied = dispatch => {
  dispatch({
    type: 'importContacts',
    state: 'failed',
    error: 'Permission denied'
  });
};

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