let React = require('react-native'),
  Style = require('../style'),
  LoaderButton = require('./LoaderButton'),
  AuthService = require('../AuthService');

let {
  View,
  Text,
  TextInput
} = React;

let ConfirmCodeScreen = React.createClass({
  getInitialState: () => ({
    loading: false
  }),

  render: function () {
    return (
      <View style={style.container}>
        <TextInput
          style={style.input}
          onChangeText={(code) => this.setState({code})} />
        <LoaderButton
          loading={this.state.loading}
          onPress={this.onConfirmCode}
          messages={{
            base: 'Confirm code',
            loading: 'Loading...'
          }} />
      </View>
    )
  },

  onConfirmCode: function () {
    this.setState({
      loading: true
    });

    AuthService.confirmCode(this.state.code, this.props.number).then((res) => {
      this.setState({
        loading: false
      });

      if (res.ok) {
        console.log('ypp');
      }
    });
  }
});

var style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  input: {
    mixins: [Style.mixins.inputBase],
    margin: 5,
    marginBottom: 0
  }
})

module.exports = ConfirmCodeScreen;
