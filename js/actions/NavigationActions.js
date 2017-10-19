import { NavigationActions } from 'react-navigation';
import * as DatabaseUtils from '../lib/DatabaseUtils';

export let navigateTo = (a, b) => async (dispatch, getState) => {
  let route;

  if (typeof a === 'string') {
    route = {
      routeName: a,
      params: b
    };
  } else {
    route = a;
  }

  let navigate = () => dispatch(NavigationActions.navigate(route));

  if (route.routeName === 'conversation') {
    let { messages, total } = await DatabaseUtils.loadMessages({
      contactId: route.params.contactId,
      page: 0
    });

    dispatch({
      type: 'resetMessages',
      messages,
      total
    });

    setTimeout(navigate, 0);
  } else {
    navigate();
  }
};

export let navigateBack = () => NavigationActions.back();

export let navigateToConversation = contactId => {
  return navigateTo('conversation', { contactId });
}

export let startNavigationTransition = () => {
  return {
    type: 'startNavigationTransition'
  };
};

export let endNavigationTransition = () => {
  return {
    type: 'endNavigationTransition'
  };
};
