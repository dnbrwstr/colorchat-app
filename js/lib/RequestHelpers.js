export let postAuthenticatedJSON = (url, data, token) => {
  return fetch(url, post(json(data, authenticated(token))));
};

export let putAuthenticatedJSON = (url, data, token) => {
  return fetch(url, put(json(data, authenticated(token))));
};

export let postJSON = (url, data) =>
  fetch(url, post(json(data)));

export let json = (data, requestObj={}) => ({
  ...requestObj,
  headers: {
    ...requestObj.headers,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

export let post = (requestObj={}) => ({
  ...requestObj,
  method: 'post'
});

export let put = (requestObj={}) => ({
  ...requestObj,
  method: 'put'
});

export let authenticated = (token, requestObj={}) => {
  if (!token) {
    throw new Error('Token required send authenticated request');
  }

  return {
    ...requestObj,
    headers: {
      ...requestObj.headers,
      'X-Auth-Token': token
    }
  };
};
