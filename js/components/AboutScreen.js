import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import Style from '../style';
import TextScreen from './TextScreen';
import BaseText from './BaseText';
import TextLink from './TextLink';
import {navigateBack} from '../store/navigation/actions';

class AboutScreen extends React.Component {
  handleNavigateBack = () => {
    this.props.dispatch(navigateBack());
  };

  render() {
    return (
      <TextScreen title="About" onNavigateBack={this.handleNavigateBack}>
        <BaseText>
          Color Chat is a color-based messaging application, built by Dan
          Brewster under the auspices of{' '}
          <TextLink style={style.link} href="https://soft.works">
            Soft
          </TextLink>
          .{'\n\n'}
        </BaseText>
        <BaseText>
          Please contact{' '}
          <TextLink style={style.link} href="mailto:info@soft.works">
            info@soft.works
          </TextLink>{' '}
          with any questions.
        </BaseText>
      </TextScreen>
    );
  }
}

let style = Style.create({
  link: {
    textDecorationLine: 'underline',
  },
});

let aboutSelector = state => ({});

export default connect(aboutSelector)(AboutScreen);
