import React from 'react';
import {
  View
} from 'react-native';
import Style from '../style';
import Header from './Header';
import BaseText from './BaseText';

class TextScreen extends React.Component {
  render() {
    return (
      <View style={style.container}>
        <Header
          title={this.props.title}
          showBack={true}
          onBack={this.props.onNavigateBack}
        />
        <View style={style.content}>
          <BaseText style={style.text}>
            {this.props.children}
          </BaseText>
        </View>
      </View>
    );
  }
}

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
    ...Style.mixins.contentWrapperBase,
    paddingTop: 0
  },
  text: {
    lineHeight: 21
  }
});

export default TextScreen;
