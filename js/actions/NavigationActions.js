import * as DatabaseUtils from '../lib/DatabaseUtils';

export let navigateTo = (a, b) => async (dispatch, getState) => {
  let route;

  if (typeof a === 'string') {
    route = {
      title: a,
      ...b
    };
  } else {
    route = a;
  }

  let navigate = () => dispatch({
    type: 'navigateTo',
    route: route
  });

  if (route.title === 'conversation') {
    let { messages, total } = await DatabaseUtils.loadMessages({
      contactId: route.data.contactId,
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

export let navigateToConversation = contactId => {
  return navigateTo('conversation', { data: { contactId } });
}

export let completeTransition = () => {
  return {
    type: 'completeTransition'
  };
};
