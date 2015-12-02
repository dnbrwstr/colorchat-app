window.navigator.userAgent = 'react-native'

import 'regenerator/runtime';
import React, { AppRegistry } from 'react-native';
import './js/lib/promisify';
import './js/lib/patchListView';

AppRegistry.registerComponent('ColorChat', () => require('./js/components/ColorChat'));
