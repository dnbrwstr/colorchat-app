window.navigator.userAgent = 'react-native'

import 'regenerator/runtime';
import React, { AppRegistry } from 'react-native';
import './js/lib/promisify';
import './js/lib/patchListView';

import { seedAddressBook as shouldSeedAddressBook } from './js/config';
import { seedAddressBook } from './js/lib/ContactUtils';

if (shouldSeedAddressBook) {
  seedAddressBook();
}

AppRegistry.registerComponent('ColorChat', () => require('./js/components/ColorChat'));
