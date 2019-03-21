import React, { Component } from "react";
import { StyleSheet, Text, ScrollView } from "react-native";
import {
  FlingGestureHandler,
  Directions,
  State
} from "react-native-gesture-handler";
import withStyles from "../lib/withStyles";

const options = [
  "light",
  "dark",
  "average",
  "dominant",
  "saturated",
  "desaturated",
  "grid"
];

const capitalize = s => s[0].toUpperCase() + s.slice(1);

class CameraDisplayModeMenu extends Component {
  scrollViewLayout = null;
  itemLayouts = [];

  constructor(props) {
    super(props);
    const defaultIndex = Math.floor(options.length / 2);
    const startIndex = options.indexOf(props.initialValue);
    this.state = {
      currentIndex: startIndex === -1 ? defaultIndex : startIndex
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentIndex !== prevState.currentIndex) {
      this.scrollToItem(this.state.currentIndex);
      this.props.onChange &&
        this.props.onChange(options[this.state.currentIndex]);
    }
  }

  maybeSetInitialPosition = () => {
    if (this.scrollViewLayout && this.itemLayouts[this.state.currentIndex]) {
      this.scrollToItem(this.state.currentIndex, false);
    }
  };

  getItemPosition = i => {
    const itemLayout = this.itemLayouts[i];
    return (
      itemLayout.x + itemLayout.width / 2 - this.scrollViewLayout.width / 2
    );
  };

  scrollToItem(i, animated = true) {
    this.scrollView.scrollTo({
      x: this.getItemPosition(i),
      animated
    });
  }

  hasAllLayouts = () => {
    return (
      this.scrollViewLayout &&
      this.itemLayouts.length === options.length &&
      this.itemLayouts.every(l => !!l)
    );
  };

  render() {
    return (
      <FlingGestureHandler
        direction={Directions.RIGHT}
        onHandlerStateChange={this.handleRightSwipe}
      >
        <FlingGestureHandler
          direction={Directions.LEFT}
          onHandlerStateChange={this.handleLeftSwipe}
        >
          {this.renderContent()}
        </FlingGestureHandler>
      </FlingGestureHandler>
    );
  }

  renderContent() {
    const { styles } = this.props;
    return (
      <ScrollView
        ref={r => (this.scrollView = r)}
        onLayout={this.handleLayoutContainer}
        horizontal={true}
        scrollEnabled={false}
        contentContainerStyle={styles.typeMenu}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {options.map((o, i) => {
          const isActive = this.state.currentIndex === i;

          return (
            <Text
              key={o}
              onLayout={e => this.handleLayoutItem(e, i)}
              style={[
                styles.typeOptionText,
                isActive && styles.activeOptionText
              ]}
            >
              {capitalize(o)}
            </Text>
          );
        })}
      </ScrollView>
    );
  }

  handleRightSwipe = ({ nativeEvent }) => {
    if (nativeEvent.state !== State.ACTIVE) return;
    let nextIndex = this.state.currentIndex - 1;
    if (nextIndex < 0) nextIndex = 0;
    this.setState({ currentIndex: nextIndex });
  };

  handleLeftSwipe = ({ nativeEvent }) => {
    if (nativeEvent.state !== State.ACTIVE) return;
    let nextIndex = this.state.currentIndex + 1;
    if (nextIndex > options.length - 1) nextIndex = options.length - 1;
    this.setState({ currentIndex: nextIndex });
  };

  handleLayoutContainer = ({ nativeEvent: { layout } }) => {
    this.scrollViewLayout = layout;
    this.maybeSetInitialPosition();
  };

  handleLayoutItem = ({ nativeEvent: { layout } }, i) => {
    this.itemLayouts[i] = layout;
    this.maybeSetInitialPosition();

    if (!this.state.layoutsLoaded && this.hasAllLayouts()) {
      this.setState({ layoutsLoaded: true });
    }
  };
}

const getStyles = theme => ({
  typeMenu: {
    flexDirection: "row",
    paddingHorizontal: 200
  },
  typeOptionText: {
    color: theme.secondaryTextColor,
    marginHorizontal: 20,
    marginVertical: 15,
    marginBottom: 20
  },
  activeOptionText: {
    color: theme.primaryTextColor
  }
});

export default withStyles(getStyles)(CameraDisplayModeMenu);
