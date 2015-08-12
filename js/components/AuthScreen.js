let React = require('react-native'),
  merge = require('merge'),
  AuthService = require('../AuthService'),
  Style = require('../style'),
  LoaderButton = require('./LoaderButton'),
  ConfirmCodeScreen = require('./ConfirmCodeScreen'),
  ErrorMessage = require('./ErrorMessage');

let {
  Text,
  TextInput,
  View,
} = React;

let AuthScreen = React.createClass({
  getInitialState: () => ({
    countryCode: '1',
    phoneNumber: '',
    buttonActive: false,
    errorMessage: null
  }),

  render: function() {
    let buttonStyles = this.state.buttonActive ? [styles.bottomButton, styles.bottomButtonActive] : styles.bottomButton;

    return (
      <View style={styles.container}>

        <View style={styles.screenContent}>
          { this.state.errorMessage &&
            <ErrorMessage
              key={this.state.errorMessage}
              message={this.state.errorMessage}
              onRemove={this.onClearError} /> }

          <View style={styles.inputContainerStyle}>
            <View style={styles.countryCodeWrapper}>
              <TextInput
                style={styles.countryCodeInput}
                value="1"
                keyboardType="phone-pad" autoFocus={true}
                onChangeText={(countryCode) => this.setState({countryCode})} />
              <Text style={styles.countryCodePlus}>+</Text>
            </View>

            <TextInput
              style={styles.numberInput}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              onChangeText={(phoneNumber) => this.setState({phoneNumber})} />
          </View>
        </View>

        <LoaderButton
          loading={this.state.loading}
          onPress={this.onSubmitNumber}
          messages={{
            base: 'Send message',
            loading: 'Loading...'
          }} />
      </View>
    );
  },

  onSubmitNumber: function () {
    this.setState({
      loading: true
    });

    let filterInput = (input) => input.replace(/[^0-9]/g, '');
    let countryCode = filterInput(this.state.countryCode);
    let phoneNumber = filterInput(this.state.phoneNumber);
    let number = '+' + countryCode + phoneNumber;

    AuthService.confirmPhoneNumber(number).then((res) => {
      this.setState({
        loading: false
      });

      // if (res.ok) {
        this.props.navigator.push({
          component: ConfirmCodeScreen,
          title: '',
          passProps: {
            number: number
          }
        });
      // } else {
      //   let messages = {
      //     400: 'Invalid phone number',
      //     500: 'Something went wrong'
      //   };

      //   this.setState({
      //     errorMessage: messages[res.status]
      //   });
      // }
    // }).catch((e) => {
    //   this.setState({
    //     loading: false,
    //     errorMessage: 'Unable to connect to server'
    //   });
    })
  },

  onClearError: function () {
    this.setState({
      errorMessage: null
    });
  }
});

let styles = Style.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#EFEFEF'
  },
  screenContent: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  inputContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    margin: 5
  },
  numberInput: {
    mixins: [Style.mixins.inputBase],
    alignSelf: 'stretch',
    flex: 1
  },
  countryCodePlus: {
    mixins: [Style.mixins.textBase],
    position: 'absolute',
    top: 11,
    bottom: 0,
    left: 15,
    backgroundColor: 'transparent'
  },
  countryCodeWrapper: {
    width: 60,
    flex: 0,
    margin: 0,
    padding: 0
  },
  countryCodeInput: {
    mixins: [Style.mixins.inputBase],
    paddingLeft: 24,
    marginRight: 5,
    color: Style.values.midGray
  }
});

module.exports = AuthScreen;
