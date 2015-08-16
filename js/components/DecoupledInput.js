import React, { TextInput } from 'react-native';

let DecoupledInput = React.createClass({
  getInitialState: function () {
    return {
      value: this.props.initialValue,
      workingValue: this.props.initialValue
    };
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.initialValue != this.props.initialValue)

    this.setState({
      value: nextProps.initialValue,
      workingValue: nextProps.initialValue
    });
  },

  render: function () {
    return (
      <TextInput {...this.props}
        ref="input"
        value={this.state.value}
        onChangeText={this.onChangeText} />
    );
  },

  onChangeText: function (newText) {
    this.setState({
      workingValue: newText
    });

    if (this.props.onChangeText) this.props.onChangeText(newText);
  },

  getValue: function () {
    return this.state.workingValue;
  },

  blur: function () {
    this.refs.input.blur();
  }
});

export default DecoupledInput;
