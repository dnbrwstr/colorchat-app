import React from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

connectWithNavigation = selector => Component => {
  const navSelector = (state, ownProps) => {
    const navParams = ownProps.navigation.state.params;
    const baseProps = {
      ...ownProps,
      ...navParams
    };
    const props = selector(state, baseProps);

    const ownKey = baseProps.navigation.state.key;
    const currentKey = state.navigation.routes[state.navigation.index].key;  
    const isCurrentScreen = ownKey === currentKey;
    const isTransitioning = state.navigation.transitioning;

    return {
      ...props,
      isCurrentScreen,
      isTransitioning
    };
  };
  
  return withNavigation(connect(navSelector)(Component));
};

export default connectWithNavigation;
