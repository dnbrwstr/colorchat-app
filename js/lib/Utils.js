export let generateId = () =>
  Math.floor(Math.random() * Math.pow(10, 10)).toString(16);

export let bindObjectMethods = object => {
  for (var key in object) {
    if (typeof object[key] === 'function');
    object[key] = object[key].bind(object);
  }

  return object;
};

export let rand = (max) => {
  return Math.round(Math.random() * max);
};
