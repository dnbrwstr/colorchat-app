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
}

export let navigateBack = (route) => (dispatch, getState) => dispatch({
  type: 'navigateTo',
  route: route || getState().navigation.history.slice(0).pop(),
  reverse: true
});
