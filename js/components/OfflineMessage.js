import React, { PureComponent } from "React";
import { Animated, View } from "react-native";
import { connectWithStyles } from "../lib/withStyles";
import BaseText from "./BaseText";
import Style from "../style";

class OfflineMessage extends PureComponent {
  constructor(props) {
    super(props);
    const height = props.offline ? 40 : 0;
    this.height = new Animated.Value(height);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.offline !== prevProps.offline) {
      if (this.props.offline) {
        Animated.timing(this.height, {
          toValue: 40,
          duration: 200
        }).start();
      } else {
        Animated.timing(this.height, {
          toValue: 0,
          duration: 200
        }).start();
      }
    }
  }

  render() {
    const { styles } = this.props;
    let style = [styles.container, { height: this.height }];

    return (
      <Animated.View style={style}>
        <View style={styles.content}>
          <BaseText style={styles.text}>Unable to connect to network</BaseText>
        </View>
      </Animated.View>
    );
  }
}

const getStyles = theme => ({
  container: {
    backgroundColor: theme.primaryButtonColor,
    alignItems: "center"
  },
  content: {
    height: 40,
    justifyContent: "center"
  },
  text: {
    ...Style.mixins.textBase,
    color: theme.primaryButtonTextColor,
    textAlign: "center",
    alignItems: "center",
    lineHeight: 20
  }
});

const selector = state => {
  return {
    offline: state.ui.network === "none"
  };
};

export default connectWithStyles(getStyles, selector)(OfflineMessage);
