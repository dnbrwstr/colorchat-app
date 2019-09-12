import React, { Component } from "react";
import { View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

class ScreenshotApp extends Component {
  render() {
    return (
      <View>
        <TouchableWithoutFeedback>
          <View
            style={styles.nextButton}
            onPress={this.handlePressNextButton}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  nextButton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

export default ScreenshotApp;
