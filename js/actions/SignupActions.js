import { merge } from "ramda";
import config from "../config";
import { postJSON, putAuthenticatedJSON } from "../lib/RequestHelpers";
import send from "../lib/send";

let { serverRoot } = config;

let sanitizeNumber = number => number.replace(/[^0-9]/g, "");

let formatPhoneNumber = (countryCode, baseNumber) =>
  `+${[countryCode, baseNumber].map(sanitizeNumber).join("")}`;

export let updateData = newData => {
  return {
    type: "updateData",
    data: newData
  };
};

export let registerPhoneNumber = () => async (dispatch, getState) => {
  let state = getState();
  let { countryCode, baseNumber } = state.signup;
  let phoneNumber = formatPhoneNumber(countryCode, baseNumber);

  send({
    dispatch,
    actionType: "registerPhoneNumber",
    getRequest: () =>
      postJSON(serverRoot + "/auth", {
        baseNumber: baseNumber,
        countryCode: countryCode
      })
  });
};

export let submitConfirmationCode = () => async (dispatch, getState) => {
  let { baseNumber, countryCode, confirmationCode } = getState().signup;

  let phoneNumber = formatPhoneNumber(countryCode, baseNumber);

  try {
    await send({
      dispatch,
      actionType: "submitConfirmationCode",
      getRequest: () =>
        postJSON(serverRoot + "/auth/confirm", {
          phoneNumber: phoneNumber,
          code: confirmationCode
        })
    });
  } catch (error) {
    console.log("Failed to submit confirmation code");
  }
};

export let clearSignupError = () => ({
  type: "clearSignupError"
});

export let clearConfirmCodeError = () => ({
  type: "clearSignupError"
});
