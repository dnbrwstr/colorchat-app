import { NetInfo } from "react-native";
import { merge, mergeAll, reduce } from "ramda";

let errorMessages = {
  default: {
    noNetwork: "Not connected to the internet",
    serverUnreachable: "Unable to connect to server",
    500: "Something went wrong",
    404: "Unable to connect to server",
    400: "Invalid input",
    403: "Unauthorized"
  },
  registerPhoneNumber: {
    403: "You have attempted to register this number too many times"
  },
  submitConfirmationCode: {
    400: "Please enter your confirmation code",
    403: "Not a valid confirmation code"
  }
};

/**
 * Exponentialish-holdoff values
 */
let retryIntervals = [1000, 2000, 5000, 10000];

/**
 * Keep tabs on a network request, dispatching events
 * when it completes or errors and optionally retrying
 * if network conditions cause it to fail
 *
 * Usage:
 *
 * ```
 * send({
 *   request: () => {}, // Returns a promise created by fetch
 *   dispatch: () => {}, // Store dispatch function
 *   parse: () => {}, // Extract data to be included in the `complete` dispatch
 *   actionType: "", // Value to use for `type` when dispatching actions,
 *   baseAction: {} // Properties to include on all dispatched actions
 * })
 * ```
 */
let send = (options, attempt = 0) => {
  dispatchWith(options, {
    state: "started"
  });

  return options
    .getRequest()
    .then(onComplete.bind(null, options))
    .catch(onError.bind(null, options, attempt));
};

export default send;

let onComplete = async (options, res) => {
  if (res.ok) {
    let rawData;
    try {
      rawData = await res.json();
    } catch (e) {
      rawData = {};
    }

    let data;
    if (options.parse) {
      data = options.parse(rawData);
    } else {
      data = { data: rawData };
    }

    dispatchWith(
      options,
      {
        state: "complete"
      },
      data
    );
  } else {
    dispatchWith(options, {
      state: "failed",
      error: getErrorMessage(options.actionType, res.status)
    });
  }
};

let onError = async (options, attempt, err) => {
  if (typeof retryIntervals[attempt] !== "undefined") {
    console.log("Request failed with", err, ", retrying");
    setTimeout(() => send(options, ++attempt), retryIntervals[attempt]);
  } else {
    console.log("Request failed:", err);
    let isConnected = await NetInfo.isConnected.fetch();
    let errorType = isConnected ? "serverUnreachable" : "noNetwork";

    dispatchWith(options, {
      state: "failed",
      error: getErrorMessage(options.actionType, errorType)
    });
  }

  return err;
};

let getErrorMessage = (actionType, errorType) => {
  if (errorMessages[actionType] && errorMessages[actionType][errorType]) {
    return errorMessages[actionType][errorType];
  } else {
    return errorMessages.default[errorType];
  }
};

let dispatchWith = (options, ...data) => {
  let actionData = mergeAll(
    [{ type: options.actionType }, options.baseAction].concat(data)
  );

  options.dispatch(actionData);
};
