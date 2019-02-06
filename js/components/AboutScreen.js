import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import Style from "../style";
import TextScreen from "./TextScreen";
import BaseText from "./BaseText";
import TextLink from "./TextLink";
import { navigateBack } from "../actions/NavigationActions";

class AboutScreen extends React.Component {
  handleNavigateBack = () => {
    this.props.dispatch(navigateBack());
  };

  render() {
    return (
      <TextScreen title="About" onNavigateBack={this.handleNavigateBack}>
        <BaseText>
          ColorChat is a color-based messaging application, built by Dan
          Brewster under the auspices of{" "}
          <TextLink style={style.link} href="http://soft.works">
            Soft
          </TextLink>
          .{"\n\n"}
        </BaseText>
        <BaseText>
          Please contact{" "}
          <TextLink style={style.link} href="mailto:hello@soft.works">
            hello@soft.works
          </TextLink>{" "}
          with any questions.
        </BaseText>
      </TextScreen>
    );
  }
}

let style = Style.create({
  container: {},
  link: {
    textDecorationLine: "underline"
  }
});

let aboutSelector = state => ({});

export default connect(aboutSelector)(AboutScreen);
