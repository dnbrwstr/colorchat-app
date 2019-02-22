import values from "./values";
import mixins from "./mixins";

export default {
  light: {
    statusBarColor: mixins.makeGray(0.96),
    backgroundColor: mixins.makeGray(1),
    highlightColor: mixins.makeGray(0.97),
    primaryTextColor: mixins.makeGray(0),
    secondaryTextColor: mixins.makeGray(0.5),
    borderColor: mixins.makeGray(0.8),
    defaultAvatarColor: mixins.makeGray(0.9),
    contacts: {
      inactiveBackgroundColor: mixins.makeGray(0.98),
      inactiveHighlightColor: mixins.makeGray(0.95),
      inviteTextColor: mixins.makeGray(1),
      inviteBackgroundColor: mixins.makeGray(0.7)
    },
    conversation: {
      dragDotColor: mixins.makeGray(0)
    },
    settings: {},
    inbox: {
      settingsButtonBackgroundColor: mixins.makeGray(0.9),
      contactsButtonBackgroundColor: mixins.makeGray(0)
    }
  },
  dark: {
    statusBarColor: mixins.makeGray(0.05),
    backgroundColor: mixins.makeGray(0),
    highlightColor: mixins.makeGray(0.1),
    primaryTextColor: mixins.makeGray(0.9),
    secondaryTextColor: mixins.makeGray(0.5),
    borderColor: mixins.makeGray(0.2),
    defaultAvatarColor: mixins.makeGray(0.13),
    inputPlaceholderColor: mixins.makeGray(0.8),
    contacts: {
      inactiveBackgroundColor: mixins.makeGray(0.1),
      inactiveHighlightColor: mixins.makeGray(0.18),
      inviteTextColor: mixins.makeGray(0.6),
      inviteBackgroundColor: mixins.makeGray(0.25)
    },
    conversation: {
      dragDotColor: mixins.makeGray(1)
    },
    settings: {},
    inbox: {
      settingsButtonBackgroundColor: mixins.makeGray(0.9),
      contactsButtonBackgroundColor: mixins.makeGray(0.2)
    }
  }
};
