let handlers = {
  updatePhoneNumber: (state, action) => ({
    ...state,
    code: action.countryCode,
    number: action.phoneNumber
  })
};

let initialState = {
  country: 'United States',
  countryCode: '1',
  phoneNumber: '',
  phoneNumberError: '',
  confirmationCode: '',
  confirmCodeError: '',
  loading: false
}

export default (state, action) => {
  return handlers[action.type] ?
    handlers[action.type](state, action) : (state || initialState)
}
