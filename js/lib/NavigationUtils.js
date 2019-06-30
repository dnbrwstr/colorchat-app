export const getFocusStateChange = (lastState, nextState) => {
  const wasBlurred =
    lastState === "blurring" ||
    lastState === "blurred" ||
    lastState === "focusing";

  const isBlurred =
    nextState === "blurring" ||
    nextState === "blurred" ||
    nextState === "focusing";

  return {
    entered: wasBlurred && !isBlurred,
    exited: !wasBlurred && isBlurred
  };
};
