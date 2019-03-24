import React, { Component } from "react";
import Style from "../style";
import SpringButton from "./SpringButton";

const BUTTON_SIZE = 50;
class RoundButton extends Component {
  render() {
    const style = [styles.button, this.props.style];
    const contentStyle = [styles.content, this.props.contentStyle];
    return (
      <SpringButton {...this.props} style={style} contentStyle={contentStyle} />
    );
  }
}

const styles = Style.create({
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE
  },
  content: {
    borderRadius: BUTTON_SIZE / 2,
    alignItems: "center",
    backgroundColor: Style.values.almostBlack,
    justifyContent: "center"
  }
});

export default RoundButton;
