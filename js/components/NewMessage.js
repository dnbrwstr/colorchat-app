import React from 'react-native';
import PressableView from './PressableView';
import NewMessageForm from './NewMessageForm';
import measure from '../measure';
import Style from '../style';

let {
  Animated,
  View,
  Text
} = React;

let NewMessage = React.createClass({

  render: function () {
    return (
      <View style={style.container}>
        { this.props.composing && this.renderForm() }
        { !this.props.composing && this.renderButton() }
      </View>
    );
  },

  renderButton: function () {
    return (
      <PressableView
        style={style.button}
        onPress={this.props.onStartComposing}
        ref="button"
      >
        <Text style={style.buttonText}>+</Text>
      </PressableView>
    );
  },

  renderForm: function () {
    return (
      <NewMessageForm
        ref="form"
        colorPicker={this.props.colorPicker}
        onSelectPicker={this.props.onSelectPicker}
        onSubmit={this.props.onSendMessage}
        onHide={this.props.onStopComposing} />
    );
  },
});

let style = Style.create({
  container: {
    flex: 0,
    backgroundColor: '#222'
  },
  button: {
    padding: 12,
    backgroundColor: '#111'
  },
  buttonText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white'
  }
});

export default NewMessage;