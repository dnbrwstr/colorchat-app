import React from 'react-native';
import { connect } from 'react-redux/native';
import Header from './Header';
import countries from '../countries';
import PressableView from './PressableView';
import { updateData } from '../actions/RegistrationActions';
import { navigateBack } from '../actions/NavigationActions';
import Style from '../style';

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
    let { dispatch } = this.props;

    return (
      <View style={style.container}>
        <Header title="Select a country" showBack={true} onBack={() =>
          dispatch(navigateBack())
        }/>
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
      <PressableView
        style={style.country}
        activeStyle={style.countryActive}
        onPress={this.onSelect.bind(this, country)}
      >
        <Text style={style.countryText}>{country.label}</Text>
      </PressableView>
    );
  },

  renderCountryHeader: function (id) {
    return (
      <View style={style.countryHeader}>
        <Text style={style.countryText}>{id}</Text>
      </View>
    );
  },

  onSelect: function (country) {
    let { dispatch } = this.props;

    dispatch(updateData({
      country: country.label,
      countryCode: country.code
    }));

    dispatch(navigateBack());
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
  countryHeader: {
    padding: 15,
    paddingVertical: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: Style.values.midGray
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

module.exports = connect(state => state.registration)(CountryPickerScreen);
