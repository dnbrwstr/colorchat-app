import { RNMessageComposer as Composer, SettingsApp } from 'NativeModules';
import Contacts from 'react-native-contacts';
import { postAuthenticatedJSON } from '../lib/RequestHelpers';
import config from '../config';
import send from '../lib/send';

let { serverRoot, inviteLink } = config;

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

  let permission = await Contacts.checkPermissionAsync();

  if (permission === 'undefined' && opts.askPermission) {
    permission = await Contacts.requestPermissionAsync();
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
  let contacts = await Contacts.getAllAsync();

  let phoneNumbers = contacts.map(c => c.phoneNumbers.map(n => n.number));
  let url = serverRoot + '/match';
  let data = { phoneNumbers };

  send({
    dispatch,
    actionType: 'importContacts',
    getRequest: () => postAuthenticatedJSON(url, { phoneNumbers }, userToken),
    parse: matches => ({ matches, contacts })
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
  let message = 'Join me on Color Chat ' + inviteLink;

  Composer.composeMessageWithArgs({
    recipients: [contact.phoneNumbers[0].number],
    messageText: message
  }, function () {
    // Throws if there's no callback
  });
}