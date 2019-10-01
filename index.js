import 'regenerator-runtime';
import React, {AppRegistry} from 'react-native';
import {useScreens} from 'react-native-screens';
import './js/lib/addUserAgent';
import ColorChat from './js/components/ColorChat';
import patchStackView from './js/lib/patchStackView';

patchStackView();
useScreens();

console.ignoredYellowBox = ['Remote debugger'];

AppRegistry.registerComponent('ColorChat', () => ColorChat);
