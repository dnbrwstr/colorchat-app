window.navigator.userAgent = 'react-native'

import 'regenerator/runtime';
import React, { AppRegistry } from 'react-native';
import './lib/promisify';
import { seedAddressBook as shouldSeedAddressBook } from './config';
import { seedAddressBook } from './lib/ContactUtils';

if (shouldSeedAddressBook) {
  seedAddressBook();
}

AppRegistry.registerComponent('ColorChat', () => require('./components/ColorChat'));
