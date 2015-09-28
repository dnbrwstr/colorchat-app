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
