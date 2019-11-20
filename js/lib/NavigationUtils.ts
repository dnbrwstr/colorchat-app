import {FocusState} from '../components/ScreenFocusState';

export const getFocusStateChange = (
  lastState: FocusState,
  nextState: FocusState,
) => {
  const wasBlurred =
    lastState === 'blurring' ||
    lastState === 'blurred' ||
    lastState === 'focusing';

  const isBlurred =
    nextState === 'blurring' ||
    nextState === 'blurred' ||
    nextState === 'focusing';

  return {
    entered: wasBlurred && !isBlurred,
    exited: !wasBlurred && isBlurred,
  };
};
