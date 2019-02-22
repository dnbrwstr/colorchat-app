import React from "react";
import { View } from "react-native";
import Style from "../style";
import Header from "./Header";
import BaseText from "./BaseText";
import withStyles from "../lib/withStyles";

class TextScreen extends React.Component {
  render() {
    const { styles, theme } = this.props;
    return (
      <View style={styles.container}>
        <Header
          title={this.props.title}
          showBack={true}
          onBack={this.props.onNavigateBack}
          borderColor={theme.borderColor}
        />
        <View style={styles.content}>
          <BaseText style={styles.text}>{this.props.children}</BaseText>
        </View>
      </View>
    );
  }
}

const getStyles = theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor
  },
  content: {
    ...Style.mixins.contentWrapperBase,
    paddingTop: 20
  },
  text: {
    lineHeight: 21
  }
});

export default withStyles(getStyles)(TextScreen);
