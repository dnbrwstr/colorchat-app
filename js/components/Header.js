let React = require('react-native'),
  Style = require('../style');

let {
  View,
  Text,
  TouchableOpacity
} = React;

let Header = React.createClass({
  render: function () {
    return (
      <View style={style.bar}>
        <View style={style.buttonContainer}>
          { this.props.showBack &&
            <TouchableOpacity onPress={this.onBack} activeStyle={style.buttonActive}>
              <View style={style.button}>
                <Text style={style.buttonText}>Back</Text>
              </View>
            </TouchableOpacity> }
        </View>

        <View style={style.title}>
          { this.props.title &&
            <Text style={style.titleText}>{this.props.title}</Text> }
        </View>

        <View style={style.buttonContainer}>
          { this.props.showClose &&
            <TouchableOpacity onPress={this.onClose} activeStyle={style.buttonActive}>
              <View style={style.button}>
                <Text style={style.buttonText}>X</Text>
              </View>
            </TouchableOpacity> }
        </View>
      </View>
    )
  },

  onBack: function () {
    if (this.props.showBack && this.props.onBack) this.props.onBack();
  },

  onClose: function () {
    if (this.props.showClose && this.props.onClose) this.props.onClose();
  }
});

var size = 50;

let style = Style.create({
  bar: {
    backgroundColor: Style.values.midGray,
    height: size,
    alignItems: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 16
  },
  buttonContainer: {
    width: size,
  },
  button: {
    flex: 1,
    justifyContent: 'center'
  },
  buttonActive: {
    backgroundColor: '#888888'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center'
  },
  title: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    color: 'white',
    textAlign: 'center'
  }
})

module.exports = Header;
