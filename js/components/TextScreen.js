import React from 'react-native';
import Style from '../style';
import Header from './Header';

let {
  View
} = React;

let TextScreen = React.createClass({
  render: function () {
    return (
      <View style={style.container}>
        <Header
          title={this.props.title}
          showBack={true}
          onBack={this.props.onNavigateBack}
        />
        <View style={style.content}>
          {this.props.children}
        </View>
      </View>
    );
  }
});

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: Style.values.backgroundGray
  },
  content: {
    ...Style.mixins.contentWrapperBase,
    paddingTop: 0
  }
});

export default TextScreen;
