import React from "react";
import { Animated, Image, View, requireNativeComponent } from "react-native";
import Style from "../style";

const MIN_SIZE = 40;
const MAX_SIZE = 55;

class PlaceholderMessage extends React.Component {
  color = new Animated.Value(0);
  width = new Animated.Value(0);
  colorAnimation = null;

  componentDidMount() {
    this.colorAnimation = Animated.loop(
      Animated.timing(this.color, {
        toValue: 1,
        duration: 8000,
        isInteraction: false
      })
    ).start();

    this.widthAnimation = Animated.loop(
      Animated.timing(this.width, {
        toValue: 1,
        duration: 1500,
        isInteraction: false
      })
    ).start();
  }

  componentWillUnmount() {
    if (this.colorAnimation) this.colorAnimation.stop();
    if (this.widthAnimation) this.widthAnimation.stop();
  }

  render() {
    return (
      <View style={[style.container, this.props.style]}>
        <Animated.View
          style={[
            style.placeholder,
            {
              width: this.width.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [MIN_SIZE, MAX_SIZE, MIN_SIZE]
              }),
              backgroundColor: this.color.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [
                  "hsl(0, 100%, 50%)",
                  "hsl(180, 100%, 50%)",
                  "hsl(320, 100%, 50%)"
                ]
              })
            }
          ]}
        />
      </View>
    );
  }
}

let style = Style.create({
  container: {
    width: MAX_SIZE,
    justifyContent: "center",
    alignItems: "center"
  },
  placeholder: {
    width: 20,
    height: 20,
    margin: 0,
    backgroundColor: "black"
  }
});

export default PlaceholderMessage;
