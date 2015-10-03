export let navigateTo = (a, b) => {
  let route;

  if (typeof a === 'string') {
    route = {
      title: a,
      ...b
    };
  } else {
    route = a;
  }

  return {
    type: 'navigateTo',
    route: route
  };
};

export let navigateToConversation = contactId => {
  return {
    type: 'navigateTo',
    route: {
      title: 'conversation',
      data: {
        contactId
      }
    }
  };
}

export let completeTransition = () => {
  return {
    type: 'completeTransition'
  };
};
