import NetInfo from '@react-native-community/netinfo';

const errorMessages: {[actionKey: string]: {[errorKey: string]: string}} = {
  default: {
    noNetwork: 'Not connected to the internet',
    serverUnreachable: 'Unable to connect to server',
    500: 'Something went wrong',
    404: 'Unable to connect to server',
    400: 'Invalid input',
    403: 'Unauthorized',
  },
  registerPhoneNumber: {
    403: 'You have attempted to register this number too many times',
  },
  submitConfirmationCode: {
    400: 'Please enter your confirmation code',
    403: 'Not a valid confirmation code',
  },
};

/**
 * Exponentialish-holdoff values
 */
const retryIntervals = [500, 500, 1000, 1000];

/**
 * Keep tabs on a network request, dispatching events
 * when it completes or errors and optionally retrying
 * if network conditions cause it to fail
 */
const send = async <R = never>(
  getRequest: () => Promise<Response>,
  attempt: number = 0,
): Promise<R> => {
  let res;
  try {
    console.log('Send, waiting for reponse');
    res = await getRequest();
  } catch (err) {
    if (typeof retryIntervals[attempt] !== 'undefined') {
      console.log('Request failed with', err, ', retrying');
      await wait(retryIntervals[attempt]);
      return send<R>(getRequest, ++attempt);
    } else {
      console.log('Request failed:', err);
      const {isConnected} = await NetInfo.fetch();
      const errorType = isConnected ? 'serverUnreachable' : 'noNetwork';
      throw new Error(errorMessages.default[errorType]);
    }
  }

  if (res.ok) {
    console.log('send got ok');
    const rawData: R = await res.json();
    return rawData;
  } else {
    console.log('send baddd');
    throw new Error(errorMessages.default[500]);
  }
};

export default send;

const wait = (duration: number) =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
