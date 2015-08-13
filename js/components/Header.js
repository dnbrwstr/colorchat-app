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
        <View style={style.backButtonContainer}>
          { this.props.showBack &&
            <TouchableOpacity onPress={this.onBack} activeStyle={style.backButtonActive}>
              <View style={style.backButton}>
                <Text style={style.backButtonText}>Back</Text>
              </View>
            </TouchableOpacity> }
        </View>

        <View style={style.title}>
          { this.props.title &&
            <Text style={style.titleText}>{this.props.title}</Text> }
        </View>

        <View style={style.closeButton}>
          { this.props.showClose &&
            <TouchableOpacity onPress={this.onClose}>
                <Text>X</Text>
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
  backButtonContainer: {
    width: size,
  },
  backButton: {
    flex: 1,
    justifyContent: 'center'
  },
  backButtonActive: {
    backgroundColor: '#888888'
  },
  backButtonText: {
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
  },
  closeButton: {
    width: size,
    height: size,
  }
})

module.exports = Header;
