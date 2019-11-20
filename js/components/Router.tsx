import React, {Component} from 'react';
import {StatusBar, Platform} from 'react-native';
import Color from 'color';
import AppNavigator from './AppNavigator';
import NavigationService from '../lib/NavigationService';
import withStyles from '../lib/withStyles';
import {Theme} from '../style/themes';

interface RouterProps {
  theme: Theme;
}

class Router extends Component<RouterProps> {
  render() {
    const {theme} = this.props;
    const backgroundColor = theme.backgroundColor;
    const brightness = Color(backgroundColor).luminosity();
    const barStyle = brightness > 0.5 ? 'dark-content' : 'light-content';
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(backgroundColor, true);
    }
    StatusBar.setBarStyle(barStyle, true);
    return (
      <AppNavigator ref={ref => NavigationService.setTopLevelNavigator(ref)} />
    );
  }
}

export default withStyles(() => ({}))(Router);
