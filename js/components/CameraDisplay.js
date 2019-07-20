import React, { Component } from "react";
import { View, Animated } from "react-native";
import withStyles from "../lib/withStyles";
import AnimatedColorDisplay from "./AnimatedColorDisplay";
import GridColorDisplay from "./GridColorDisplay";
import SingleColorDisplay from "./SingleColorDisplay";

class CameraDisplay extends Component {
  constructor(props) {
    super(props);

    this.displayOpacity = new Animated.Value(1);

    this.state = {
      displayMode: props.displayMode
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const displayModeChanged = prevProps.displayMode !== this.props.displayMode;
    if (displayModeChanged) this.setDisplayMode(this.props.displayMode);
  }

  setDisplayMode(mode) {
    if (this.animation) this.animation.stop();
    this.animation = Animated.timing(this.displayOpacity, {
      toValue: 0
    });
    this.animation.start(({ finished }) => {
      if (!finished) return;
      this.setState({
        displayMode: this.props.displayMode
      });
      this.animation = Animated.timing(this.displayOpacity, {
        toValue: 1
      });
      this.animation.start();
    });
  }

  render() {
    const { styles } = this.props;
    const opacityStyle = {
      opacity: this.displayOpacity
    };
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.content, opacityStyle]}>
          <AnimatedColorDisplay
            colors={this.props.colors}
            displayMode={this.state.displayMode}
          >
            {colorProps => {
              return this.state.displayMode === "grid" ? (
                <GridColorDisplay
                  {...colorProps}
                  renderCamera={this.props.renderCamera}
                  onPressClose={this.props.onPressClose}
                />
              ) : (
                <SingleColorDisplay {...colorProps} />
              );
            }}
          </AnimatedColorDisplay>
        </Animated.View>
      </View>
    );
  }
}

const getStyles = theme => ({
  container: {
    flex: 1
  },
  content: {
    flex: 1
  }
});

export default withStyles(getStyles)(CameraDisplay);
