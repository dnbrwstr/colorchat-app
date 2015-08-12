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
        <View style={style.backButton}>
          { this.props.showBack &&
            <TouchableOpacity onPress={this.onBack}>
              <Text>Back</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 12
  },
  backButton: {
    width: size,
    height: size,
    flex: 0,
  },
  title: {
    flex: 1,
  },
  titleText: {
    color: 'white',
    textAlign: 'center'
  },
  closeButton: {
    width: size,
    height: size,
    flex: 0,
  }
})

module.exports = Header;
