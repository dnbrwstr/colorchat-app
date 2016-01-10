export let postAuthenticatedJSON = (url, data, token) => {
  return fetch(url, postRequest(json(data, authenticated(token))));
};

export let putAuthenticatedJSON = (url, data, token) => {
  return fetch(url, putRequest(json(data, authenticated(token))));
};

export let getAuthenticated = (url, token) => {
  return fetch(url, authenticated(token));
};

export let deleteAuthenticated = (url, token) => {
  return fetch(url, deleteRequest(authenticated(token)));
};

export let postJSON = (url, data) => {
  console.log(url);
  return fetch(url, postRequest(json(data)));
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

let postRequest = (requestObj={}) => ({
  ...requestObj,
  method: 'post'
});

let putRequest = (requestObj={}) => ({
  ...requestObj,
  method: 'put'
});

let deleteRequest = (requestObj={}) => ({
  ...requestObj,
  method: 'delete'
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
