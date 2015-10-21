import React from 'react-native';
import { connect } from 'react-redux/native';
import Header from './Header';
import countries from '../countries';
import PressableView from './PressableView';
import BaseText from './BaseText';
import { updateData } from '../actions/SignupActions';
import { navigateTo } from '../actions/NavigationActions';
import Style from '../style';

let {
  ListView,
  View,
  Text,
  ScrollView,
  PixelRatio
} = React;

let groupedCountries = countries.reduce((memo, country) => {
  let letter = country.label[0].toUpperCase();
  if (!memo[letter]) memo[letter] = [];
  memo[letter].push(country);
  return memo;
}, {});

let CountryPickerScreen = React.createClass({
  getInitialState: function () {
    let dataSource = new ListView.DataSource({
      sectionHeaderHasChanged: (s1, s2) => false,
      rowHasChanged: (r1, r2) => false,
      getSectionHeaderData: (data, id) => id
    });

    return {
      countryDataSource: dataSource.cloneWithRowsAndSections(groupedCountries)
    };
  },

  render: function () {
    let { dispatch } = this.props;

    return (
      <View style={style.container}>
        <Header title="Select a country" showBack={true} onBack={() =>
          dispatch(navigateTo('signup'))
        }/>
        <ListView
          initialListSize={12}
          pageSize={1}
          scrollRenderAheadDistance={100}
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


  renderCountry: function (country, sectionId, rowId) {
    let isFirst = rowId === '0';
    let isLast = (groupedCountries[sectionId].length - 1).toString() === rowId;

    let styles = [
      style.country,
      isFirst && style.firstCountry,
      isLast && style.lastCountry
    ];

    return (
      <PressableView
        style={styles}
        activeStyle={style.countryActive}
        onPress={this.onSelect.bind(this, country)}
      >
        <BaseText style={style.countryText}>{country.label}</BaseText>
      </PressableView>
    );
  },

  renderCountryHeader: function (id) {
    return (
      <View style={style.countryHeader}>
        <View style={style.countryHeaderInner}>
          <BaseText style={style.countryText}>{id}</BaseText>
        </View>
      </View>
    );
  },

  onSelect: function (country) {
    let { dispatch } = this.props;

    dispatch(updateData({
      country: country.label,
      countryCode: country.code
    }));

    dispatch(navigateTo('signup'));
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
    paddingHorizontal: 24,
  },
  countryHeaderInner: {
    paddingVertical: 3,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: Style.values.midGray
  },
  country: {
    paddingHorizontal: 24,
    paddingVertical: 9
  },
  firstCountry: {
    paddingTop: 18
  },
  lastCountry: {
    paddingBottom: 27
  },
  countryText: {
    color: Style.values.midGray
  },
  countryActive: {
    backgroundColor: '#EEE'
  }
});

module.exports = connect(state => state.signup)(CountryPickerScreen);
