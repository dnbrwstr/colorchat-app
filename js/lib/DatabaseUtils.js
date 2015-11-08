import React from 'react-native';
import invariant from 'invariant';
import { merge, partialRight, evolve, pick, __, times, compose } from 'ramda';
import { createSeedMessage } from '../lib/MessageUtils';

let DatabaseManager = React.NativeModules.DatabaseManager;

let DEFAULT_PAGE_NUMBER = 0;
let DEFAULT_MESSAGES_PER_PAGE = 50;
let ALLOWED_MESSAGE_PROPS = [
  'id',
  'senderId',
  'recipientId',
  'createdAt',
  'color',
  'width',
  'height'
];

export let loadMessages = _options => {
  let defaults = {
    page: DEFAULT_PAGE_NUMBER,
    per: DEFAULT_MESSAGES_PER_PAGE
  };

  let options = merge(defaults, _options);

  invariant(
    typeof options.contactId === 'number',
    'Attempt to load messages with contactId of invalid type ' + typeof options.contactId
  );

  return new Promise(function (resolve, reject) {
    DatabaseManager.loadMessagesForContact(
      options.contactId,
      options.page,
      options.per,
      function (error, messages, total) {
        if (error) reject(error);
        resolve({
          messages,
          total
        });
      }
    );
  });
};

export let storeMessage = _message => {
  console.log('storing', _message);
  let message = pick(ALLOWED_MESSAGE_PROPS, _message);
  return new Promise(function (resolve, reject) {
    DatabaseManager.storeMessage(
      message,
      function (error, message) {
        if (error) reject(error);
        else resolve(message);
      }
    );
  });
};

export let seedMessages = messageCount => {
  times(
    compose(storeMessage, createSeedMessage),
    messageCount
  );
};
