import React from 'react';
import {connect} from 'react-redux';
import Style from '../style';
import TextScreen from './TextScreen';
import BaseText from './BaseText';
import {navigateTo} from '../store/navigation/actions';
import TextLink from './TextLink';

class NumberInfoScreen extends React.Component {
  handleNavigateBack = () => {
    this.props.dispatch(navigateTo('signup'));
  };

  render() {
    return (
      <TextScreen
        title="Your Phone Number"
        onNavigateBack={this.handleNavigateBack}
      >
        <BaseText>
          Color Chat uses your phone number to authenticate you and to connect
          you with friends already on Color Chat.{'\n\n'}
        </BaseText>
        <BaseText>
          Color Chat does not share your phone number with other users, but will
          allow them to message you if you're already listed in their contacts.
          {'\n\n'}
        </BaseText>
        <BaseText>
          Color Chat does not, and will never, share your phone number with
          third parties for any reason except to comply with the law or protect
          the rights, property, or safety of you or others.{'\n\n'}
        </BaseText>
        <BaseText>
          If you have any questions, please contact{' '}
          <TextLink href="mailto:hello@soft.works" style={style.link}>
            info@soft.works
          </TextLink>
          .
        </BaseText>
      </TextScreen>
    );
  }
}

let style = Style.create({
  container: {},
  link: {
    textDecorationLine: 'underline',
  },
});

let aboutSelector = state => ({});

export default connect(aboutSelector)(NumberInfoScreen);
