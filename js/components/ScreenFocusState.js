import React, { Component } from "react";
import { withNavigation } from "react-navigation";

export const ScreenFocusStateContext = React.createContext("blurred");

class ScreenFocusStateProviderBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptions: null,
      focusState: "blurred"
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    this.setState({
      willFocusSubscription: navigation.addListener(
        "willFocus",
        this.handleWillFocus
      ),
      didFocusSubscription: navigation.addListener(
        "didFocus",
        this.handleDidFocus
      ),
      willBlurSubscription: navigation.addListener(
        "willBlur",
        this.handleWillBlur
      ),
      didBlurSubscription: navigation.addListener("didBlur", this.handleDidBlur)
    });
  }

  componentWillUnmount() {
    this.state.willFocusSubscription.remove();
    this.state.didFocusSubscription.remove();
    this.state.willBlurSubscription.remove();
    this.state.didBlurSubscription.remove();
  }

  render() {
    return (
      <ScreenFocusStateContext.Provider value={this.state.focusState}>
        {this.props.children}
      </ScreenFocusStateContext.Provider>
    );
  }

  handleWillFocus = () => {
    this.setState({ focusState: "focusing" });
  };

  handleDidFocus = () => {
    this.setState({ focusState: "focused" });
  };

  handleWillBlur = () => {
    this.setState({ focusState: "blurring" });
  };

  handleDidBlur = () => {
    this.setState({ focusState: "blurred" });
  };
}

export const ScreenFocusStateProvider = withNavigation(
  ScreenFocusStateProviderBase
);

export const withScreenFocusStateProvider = WrappedComponent => props => {
  return (
    <ScreenFocusStateProvider>
      <WrappedComponent {...props} />
    </ScreenFocusStateProvider>
  );
};

export const withScreenFocusState = WrappedComponent => props => {
  return (
    <ScreenFocusStateContext.Consumer>
      {screenFocusState => (
        <WrappedComponent {...props} screenFocusState={screenFocusState} />
      )}
    </ScreenFocusStateContext.Consumer>
  );
};
