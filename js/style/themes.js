import values from "./values";
import mixins from "./mixins";

export default {
  light: {
    label: "Light",
    statusBarColor: mixins.makeGray(0.96),
    backgroundColor: mixins.makeGray(1),
    highlightColor: mixins.makeGray(0.97),
    primaryTextColor: mixins.makeGray(0.1),
    secondaryTextColor: mixins.makeGray(0.5),
    primaryBorderColor: mixins.makeGray(0.6),
    secondaryBorderColor: mixins.makeGray(0.8),
    defaultAvatarColor: mixins.makeGray(0.9),
    primaryButtonColor: mixins.makeGray(0),
    primaryButtonTextColor: mixins.makeGray(1),
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
      settingsButtonBackgroundColor: mixins.makeGray(0.9)
    },
    error: {
      textColor: mixins.makeGray(0.1),
      backgroundColor: mixins.makeGray(0.7),
      backgroundHighlightColor: mixins.makeGray(0.8)
    }
  },
  dark: {
    label: "Dark",
    statusBarColor: mixins.makeGray(0.05),
    backgroundColor: mixins.makeGray(0),
    highlightColor: mixins.makeGray(0.1),
    primaryTextColor: mixins.makeGray(0.9),
    secondaryTextColor: mixins.makeGray(0.5),
    primaryBorderColor: mixins.makeGray(0.4),
    secondaryBorderColor: mixins.makeGray(0.13),
    defaultAvatarColor: mixins.makeGray(0.13),
    primaryButtonColor: mixins.makeGray(0.2),
    primaryButtonTextColor: mixins.makeGray(0.9),
    contacts: {
      inactiveBackgroundColor: mixins.makeGray(0.07),
      inactiveHighlightColor: mixins.makeGray(0.18),
      inviteTextColor: mixins.makeGray(0.7),
      inviteBackgroundColor: mixins.makeGray(0.25)
    },
    conversation: {
      dragDotColor: mixins.makeGray(1)
    },
    settings: {},
    inbox: {
      settingsButtonBackgroundColor: mixins.makeGray(0.9)
    },
    error: {
      textColor: mixins.makeGray(0.9),
      backgroundColor: mixins.makeGray(0.2),
      backgroundHighlightColor: mixins.makeGray(0.5)
    }
  },
  cream: {
    label: "Cream",
    statusBarColor: "#F8F9E0",
    backgroundColor: "#F8F9E0",
    highlightColor: "#F1F2DA",
    primaryTextColor: "#70B77E",
    secondaryTextColor: "#DB9595",
    primaryBorderColor: "#91C7B1",
    secondaryBorderColor: "#E2DDC7",
    defaultAvatarColor: "#E2DDC7",
    primaryButtonColor: "#70B77E",
    primaryButtonTextColor: mixins.makeGray(1),
    contacts: {
      inactiveBackgroundColor: "#F9F2D6",
      inactiveHighlightColor: "#F1F2DA",
      inviteTextColor: "#F8F9E0",
      inviteBackgroundColor: "#5FBFF9"
    },
    conversation: {
      dragDotColor: mixins.makeGray(1)
    },
    settings: {},
    inbox: {
      settingsButtonBackgroundColor: mixins.makeGray(1)
    },
    error: {
      textColor: "white",
      backgroundColor: "#DB9595"
    }
  }
};
