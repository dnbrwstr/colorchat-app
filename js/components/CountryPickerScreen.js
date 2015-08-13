let React = require('react-native'),
  Header = require('./Header'),
  countries = require('../countries'),
  Pressable = require('./Pressable'),
  Style = require('../style');

let {
  ListView,
  View,
  Text,
  ScrollView
} = React;

let CountryPickerScreen = React.createClass({
  getInitialState: function () {
    let countryData = countries.reduce((memo, country) => {
      let letter = country.label[0].toUpperCase();
      if (!memo[letter]) memo[letter] = [];
      memo[letter].push(country);
      return memo;
    }, {});

    let dataSource = new ListView.DataSource({
      sectionHeaderHasChanged: (s1, s2) => false,
      rowHasChanged: (r1, r2) => false,
      getSectionHeaderData: (data, id) => id
    });

    return {
      countryDataSource: dataSource.cloneWithRowsAndSections(countryData)
    };
  },

  render: function () {
    return (
      <View style={style.container}>
        <Header title="Select a country" showBack={true} onBack={this.onClose}/>
        <ListView
          removeClippedSubviews={true}
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.countryDataSource}
          renderRow={this.renderCountry}
          renderSeperator={this.renderSeperator}
          renderSectionHeader={this.renderCountryHeader} />
      </View>
    );
  },

  renderSeperator: function () {
    return (<View style={style.separator} />)
  },

  renderCountry: function (country) {
    return (
      <Pressable activeStyle={style.countryActive} onPress={this.onSelect.bind(this, country)}>
        <View style={style.country}>
          <Text style={style.countryText}>{country.label}</Text>
        </View>
      </Pressable>
    );
  },

  renderCountryHeader: function (id) {
    return (
      <View style={{
        padding: 15,
        paddingVertical: 5,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'transparent',
        borderBottomColor: Style.values.midGray
      }}>
        <Text style={style.countryText}>{id}</Text>
      </View>
    );
  },

  onSelect: function (country) {
    this.props.navigator.replacePreviousAndPop({
      component: require('./AuthScreen'),
      title: 'Auth',
      passProps: {
        country: country.label,
        code: country.code
      }
    });
  },

  onClose: function () {
    this.props.navigator.pop();
  }
});

var style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  separator: {
    height: 1,
    backgroundColor: Style.values.midGray
  },
  country: {
    padding: 15
  },
  countryText: {
    color: Style.values.midGray
  },
  countryActive: {
    backgroundColor: '#EEE'
  }
});

module.exports = CountryPickerScreen;
