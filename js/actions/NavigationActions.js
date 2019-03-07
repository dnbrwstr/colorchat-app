import { NavigationActions } from "react-navigation";
import * as DatabaseUtils from "../lib/DatabaseUtils";

export let navigateTo = (a, b) => {
  let route;

  if (typeof a === "string") {
    route = {
      routeName: a,
      params: b
    };
  } else {
    route = a;
  }

  return {
    type: "navigateTo",
    ...route
  };
};

export let navigateBack = () => {
  return {
    type: "navigateBack"
  };
};

export const navigateToConversation = contactId => async (
  dispatch,
  getState
) => {
  const userId = getState().user.id;
  const { messages, total } = await DatabaseUtils.loadMessages({
    contactId,
    userId,
    page: 0
  });

  dispatch({
    type: "resetMessages",
    messages,
    total
  });

  setTimeout(() => {
    dispatch({
      type: "navigateToConversation",
      contactId
    });
  }, 0);
};

export let startNavigationTransition = () => {
  return {
    type: "startNavigationTransition"
  };
};

export let endNavigationTransition = () => {
  return {
    type: "endNavigationTransition"
  };
};
