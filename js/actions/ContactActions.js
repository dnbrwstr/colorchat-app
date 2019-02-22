import { Linking, Platform } from "react-native";
import { SettingsApp } from "NativeModules";
import Contacts from "react-native-contacts";
import SendSMS from "react-native-sms";
import { postAuthenticatedJSON } from "../lib/RequestHelpers";
import { PermissionsAndroid } from "react-native";
import config from "../config";
import send from "../lib/send";

let { serverRoot, inviteLink } = config;

/**
 * Attempt to import contacts from address book, sending
 * phone numbers to the server so that we can determine
 * which contacts are also users.
 */
export let importContacts = opts => async (dispatch, getState) => {
  let userToken = getState().user.token;

  dispatch({
    type: "importContacts",
    state: "started"
  });

  let permission = await Contacts.checkPermissionAsync();

  if (
    (permission === "undefined" || permission == "denied") &&
    opts.askPermission
  ) {
    permission = await Contacts.requestPermissionAsync();
  }

  if (permission === "denied" && opts.askPermission) {
    SettingsApp.openSettings();
  }

  if (permission === "authorized") {
    onPermissionGranted(userToken, dispatch);
  } else {
    onPermissionDenied(dispatch);
  }
};

let onPermissionGranted = async (userToken, dispatch) => {
  let rawContacts = await Contacts.getAllAsync();

  const contactsByNumber = {};
  rawContacts.forEach(c => {
    const { phoneNumbers, ...info } = c;
    phoneNumbers.forEach(n => {
      const normalizedNumber = n.number.replace(/[^\d]/g, "");
      if (!contactsByNumber[normalizedNumber]) {
        contactsByNumber[normalizedNumber] = { ...info, phoneNumber: n.number };
      }
    });
  });

  let contacts = Object.keys(contactsByNumber).map(k => contactsByNumber[k]);
  console.log(contacts);
  // TODO: Move sorting to native modules
  contacts.sort((a, b) => {
    const first = `${a.givenName} ${a.familyName}`;
    const second = `${b.givenName} ${b.familyName}`;

    if (first > second) return 1;
    else if (second > first) return -1;
    return 0;
  });

  let phoneNumbers = contacts.map(c => [c.phoneNumber]);
  let url = serverRoot + "/match";
  let data = { phoneNumbers };

  send({
    dispatch,
    actionType: "importContacts",
    getRequest: () => postAuthenticatedJSON(url, { phoneNumbers }, userToken),
    parse: matches => ({ matches, contacts })
  });
};

const loadAvatar = contact => (dispatch, getState) => {
  let phoneNumber = contact.phoneNumber;
  // const number =
};

let onPermissionDenied = dispatch => {
  dispatch({
    type: "importContacts",
    state: "failed",
    error: "Permission denied"
  });
};

export let sendInvite = contact => (dispatch, getState) => {
  // Get invite link from server
  // fetch...
  const message =
    "Please join me in chatting with colors instead of words on Color Chat " +
    inviteLink;
  const number = contact.phoneNumber;

  SendSMS.send(
    {
      body: message,
      recipients: [number],
      successTypes: ["all"]
    },
    () => {}
  );
};
