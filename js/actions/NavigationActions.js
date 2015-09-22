export let navigateTo = (a, b) => {
  debugger
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
}

export let navigateBack = (route) => (dispatch, getState) => {
  debugger
  if (!route) {
    let { history } = getState().navigation;
    let currentRoute = getState().navigation.route;
    route = history[history.indexOf(currentRoute) - 1];
  }

  return dispatch({
    type: 'navigateTo',
    route: route,
    reverse: true
  });
}
