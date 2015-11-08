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
  return createMessage({
    id: generateId(),
    createdAt: new Date().toJSON(),
    senderId: 1,
    width: 75 + Math.floor(Math.random() * 200),
    height: 75 + Math.floor(Math.random() * 300),
    recipientId: 2,
    color: `rgb(${rand(255)}, ${rand(255)}, ${rand(255)})`,
    state: 'complete'
  });
};
