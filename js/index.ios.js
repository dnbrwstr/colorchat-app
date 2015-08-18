import 'regenerator/runtime';
import { AppRegistry } from 'react-native';
import ColorChat from './components/ColorChat';
import './lib/promisify';
import { seedAddressBook as shouldSeedAddressBook } from './config';
import { seedAddressBook } from './lib/ContactUtils';

if (shouldSeedAddressBook) {
  seedAddressBook();
}

AppRegistry.registerComponent('ColorChat', () => ColorChat);
