import React from 'react';
import {connect} from 'react-redux';
import Style from '../style';
import TextScreen from './TextScreen';
import TextLink from './TextLink';
import BaseText from './BaseText';
import {navigateBack} from '../store/navigation/actions';

class ContactsInfoScreen extends React.Component {
  handleNavigateBack = () => {
    this.props.dispatch(navigateBack());
  };

  render() {
    return (
      <TextScreen
        title="Contacts usage"
        onNavigateBack={this.handleNavigateBack}
      >
        <BaseText>
          Color Chat uses your contacts to show you which of your friends are
          already using ColorChat{'\n\n'}
        </BaseText>
        <BaseText>
          Color Chat does not store your contacts, and does not have the ability
          to share them with other users or with third parties.{'\n\n'}
        </BaseText>
        <BaseText>
          If you have any questions, please contact{' '}
          <TextLink href="mailto:info@soft.works" style={style.link}>
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

export default connect(aboutSelector)(ContactsInfoScreen);
