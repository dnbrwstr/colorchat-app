import 'regenerator/runtime';
import React, { AppRegistry } from 'react-native';
import './js/lib/promisify';
import './js/lib/patchListView';
import './js/lib/addUserAgent';
import ColorChat from './js/components/ColorChat';

AppRegistry.registerComponent('ColorChat', () => ColorChat);
