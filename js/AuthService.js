let React = require('react-native'),
  config = require('./config');

let root = config.serverRoot;

let postJSON = (url, data) => fetch(url, {
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

let AuthService = {
  confirmPhoneNumber: (number) =>
    postJSON(root + '/auth', {
      number: number
    }),

  confirmCode: (code, number) =>
    postJSON(root + '/auth/confirm', {
      number: number,
      code: code
    })
};

module.exports = AuthService;
