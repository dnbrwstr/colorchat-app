export let postJSON = (url, data) =>
  fetch(url, post(json(data)));

export let postAuthenticatedJSON = (url, data, token) => {
  if (!token) {
    throw new Error('Token required send authenticated request');
  }

  return fetch(url, post(json(data, authenticated(token))));
}

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

export let authenticated = (token, requestObj={}) => ({
  ...requestObj,
  headers: {
    ...requestObj.headers,
    'X-Auth-Token': token
  }
});
