import { StackView } from "react-navigation-stack";
import { StackActions } from "react-navigation";

// Fixes focus events not firing
// From https://github.com/react-navigation/react-navigation/issues/4867
const patchStackView = () => {
  StackView.prototype.componentDidMount = function() {
    const { navigation } = this.props;
    if (navigation.state.isTransitioning) {
      navigation.dispatch(
        StackActions.completeTransition({
          key: navigation.state.key,
          toChildKey: navigation.state.routes[navigation.state.index].key
        })
      );
    }
  };
};

export default patchStackView;
