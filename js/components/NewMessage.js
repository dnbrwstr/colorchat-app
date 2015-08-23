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
  getInitialState: () => ({
    adding: false,
    formHeight: null,
    formOpacity: 1
  }),

  setBaseSize: async function () {
    let baseSize = await measure(this.refs.button);

    this.setState({
      baseHeight: baseSize.height,
      formHeight: new Animated.Value(baseSize.height)
    });
  },

  componentDidUpdate: async function (prevProps, prevState) {
    if (prevState.adding !== this.state.adding) {
      if (this.state.adding) {
        let size = await measure(this.refs.form);

        Animated.parallel([
          Animated.spring(this.state.formHeight, {
            toValue: 300,
            friction: 15,
            tension: 200
          })
        ]).start();
      }
    }
  },

  render: function () {
    return (
      <View style={style.container}>
        { this.renderContent() }
      </View>
    );
  },

  renderContent: function () {
    return this.state.adding ?
      this.renderForm() : this.renderButton()
  },

  renderButton: function () {
    return (
      <PressableView
        onLayout={this.setBaseSize}
        style={style.button}
        onPress={this.onStartAdd}
        ref="button"
      >
        <Text style={style.buttonText}>+</Text>
      </PressableView>
    );
  },

  renderForm: function () {
    return (
      <Animated.View style={{
        overflow: 'hidden',
        height: this.state.formHeight,
        opacity: this.state.formOpacity
      }}>
        <NewMessageForm
          ref="form"
          onSubmit={this.onSendMessage}
          onHide={this.onCancelAdd} />
      </Animated.View>
    );
  },

  onSendMessage: function () {
    if (this.props.onSendMessage) this.props.onSendMessage();
  },

  onStartAdd: function () {
    this.setState({
      adding: true
    });
  },

  onCancelAdd: function () {
    Animated.parallel([
      Animated.spring(this.state.formHeight, {
        toValue: this.state.baseHeight,
        friction: 20,
        tension: 400
      })
    ]).start();

    setTimeout(() => this.setState({
      adding: false
    }), 200)
  }
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