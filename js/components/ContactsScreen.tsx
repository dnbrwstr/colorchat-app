import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import ContactList from './ContactList';
import AnimatedEllipsis from './AnimatedEllipsis';
import {importContacts, sendInvite} from '../store/contacts/actions';
import {
  navigateToConversation,
  navigateBack,
  navigateTo,
} from '../store/navigation/actions';
import Header from './Header';
import withStyles, {makeStyleCreator, InjectedStyles} from '../lib/withStyles';
import ContactsImportPrompt from './ContactsImportPrompt';
import {Theme} from '../style/themes';
import {AppDispatch, AppState} from '../store/createStore';
import {Contact} from '../store/contacts/types';

interface ContactsScreenProps {
  contacts: Contact[];
  importInProgress: boolean;
  isTransitioning: boolean;
  shouldRefresh: boolean;
  dispatch: AppDispatch;
  styles: InjectedStyles<typeof getStyles>;
  theme: Theme;
}

class ContactsScreen extends React.Component<ContactsScreenProps> {
  componentDidMount() {
    this.importContacts(false);
  }

  componentDidUpdate(prevProps: ContactsScreenProps) {
    if (
      !this.props.isTransitioning &&
      prevProps.isTransitioning &&
      this.props.shouldRefresh
    ) {
      this.importContacts(false);
    }
  }

  importContacts = (askPermission: boolean) => {
    this.props.dispatch(
      importContacts({
        askPermission,
      }),
    );
  };

  render() {
    const {styles, theme} = this.props;

    return (
      <View style={styles.container}>
        <Header
          title={'Contacts'}
          onPressBack={() => this.props.dispatch(navigateBack())}
        />
        {this.renderContent()}
      </View>
    );
  }

  renderContent = () => {
    if (this.props.contacts.length) {
      return this.renderContactsList();
    } else if (this.props.importInProgress) {
      return this.renderLoader();
    } else {
      return this.renderImportPrompt();
    }
  };

  renderImportPrompt = () => {
    return (
      <ContactsImportPrompt
        onRequestInfo={this.handleShowContactsInfo}
        onPressImport={this.handleImportButtonPressed}
      />
    );
  };

  renderContactsList = () => {
    return (
      <ContactList
        contacts={this.props.contacts}
        onSelect={this.handleContactSelected}
      />
    );
  };

  renderLoader = () => {
    return (
      <View style={{flex: 1}}>
        <AnimatedEllipsis />
      </View>
    );
  };

  handleShowContactsInfo = () => {
    this.props.dispatch(navigateTo('contactsInfo'));
  };

  handleImportButtonPressed = () => {
    this.importContacts(true);
  };

  handleContactSelected = (contact: Contact) => {
    if (contact.matched) {
      this.props.dispatch(navigateToConversation(contact.id));
    } else {
      this.props.dispatch(sendInvite(contact));
    }
  };
}

const getStyles = makeStyleCreator((theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
}));

let selectContacts = (state: AppState) => {
  return {
    contacts: state.contacts,
    ...state.ui.contacts,
  };
};

export default withStyles(getStyles)(connect(selectContacts)(ContactsScreen));
