import {
  NavigationActions,
  StackNavigator,
  addNavigationHelpers
} from 'react-navigation';
import { startNavigationTransition, endNavigationTransition } from '../actions/NavigationActions'
import AppRoutes, { getTransitionMethod } from '../lib/AppRoutes';

const AppNavigator = StackNavigator(AppRoutes, {
  headerMode: 'none',
  // `navigation.dispatch` is the dispatch function from our Redux store
  // It's passed in when we initialize our navigator in Router.js
  onTransitionStart: ({ navigation }) => navigation.dispatch(startNavigationTransition()),
  onTransitionEnd: ({ navigation }) => navigation.dispatch(endNavigationTransition())
});

export default AppNavigator;
