import NavigationService from "./NavigationService";

export default (navigationMiddleware = store => next => {
  const handlers = {
    navigateTo: function(state, action) {
      NavigationService.navigate(action.routeName, action.params);
    },

    navigateBack: function() {
      NavigationService.navigateBack();
    },

    navigateToConversation: function() {
      NavigationService.navigate("conversation");
    },

    authError: function(state, action) {
      NavigationService.navigate("auth");
    },

    registerPhoneNumber: function(state, action) {
      if (action.state !== "complete") return state;
      NavigationService.navigate("confirmCode");
    },

    submitConfirmationCode: function(state, action) {
      if (action.state !== "complete") return state;
      NavigationService.navigate("notifications");
    },

    submitNotificationName: function(state, action) {
      NavigationService.navigate("app");
    },

    logout: function(state, action) {
      NavigationService.navigate("auth");
    },

    deleteAccount: function(state, action) {
      NavigationService.navigate("auth");
    }
  };

  return action => {
    next(action);

    if (handlers[action.type]) {
      handlers[action.type](store.getState(), action);
    }
  };
});
