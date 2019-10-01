export const postAuthenticatedJSON = (
  url: string,
  data: any,
  token: string,
) => {
  return fetch(url, postRequest(json(data, authenticated(token))));
};

export const putAuthenticatedJSON = (url: string, data: any, token: string) => {
  return fetch(url, putRequest(json(data, authenticated(token))));
};

export const getAuthenticated = (url: string, token: string) => {
  return fetch(url, authenticated(token));
};

export const deleteAuthenticated = (url: string, token: string) => {
  return fetch(url, deleteRequest(authenticated(token)));
};

export const postAuthenticated = (url: string, token: string) => {
  return fetch(url, postRequest(authenticated(token)));
};

export const postJSON = (url: string, data: any) => {
  const options = postRequest(json(data));
  console.log(url, options);
  return fetch(url, options);
};

export const json = (data: any, requestObj = {headers: {}}) => ({
  ...requestObj,
  headers: {
    ...requestObj.headers,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});

let postRequest = (requestObj = {headers: {}}) => ({
  ...requestObj,
  method: 'post',
});

let putRequest = (requestObj = {headers: {}}) => ({
  ...requestObj,
  method: 'put',
});

let deleteRequest = (requestObj = {headers: {}}) => ({
  ...requestObj,
  method: 'delete',
});

export let authenticated = (token: string, requestObj = {headers: {}}) => {
  if (!token) {
    throw new Error('Token required to send authenticated request');
  }

  return {
    ...requestObj,
    headers: {
      ...requestObj.headers,
      'X-Auth-Token': token,
    },
  };
};
