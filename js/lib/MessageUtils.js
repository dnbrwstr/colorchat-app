import { merge } from 'ramda';
import { rand } from './Utils';

export let generateId = () =>
  Math.floor(Math.random() * Math.pow(10, 10)).toString(16);

export let createMessage = data => {
  return merge({
    clientId: generateId(),
    clientTimestamp: new Date().toJSON(),
    state: 'composing',
    expanded: false,
    color: '#CCC',
    width: 240,
    height: 150
  }, data);
};

export let createSeedMessage = () => {
  let senderId = Math.floor(Math.random() * 2) + 1;
  let recipientId = senderId === 1 ? 2 : 1;

  return createMessage({
    id: generateId(),
    createdAt: new Date().toJSON(),
    senderId: senderId,
    width: 75 + Math.floor(Math.random() * 200),
    height: 75 + Math.floor(Math.random() * 300),
    recipientId: recipientId,
    color: `rgb(${rand(255)}, ${rand(255)}, ${rand(255)})`,
    state: 'complete'
  });
};
