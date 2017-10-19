import React from 'react';
import {
  SectionList,
  View,
  Text,
  ScrollView,
  PixelRatio
} from 'react-native';
import { connect } from 'react-redux';
import Header from './Header';
import Countries from '../lib/data/Countries';
import PressableView from './PressableView';
import BaseText from './BaseText';
import { updateData } from '../actions/SignupActions';
import { navigateTo } from '../actions/NavigationActions';
import Style from '../style';

let groupedCountries = Countries.reduce((memo, country) => {
  let letter = country.label[0].toUpperCase();
  if (!memo[letter]) memo[letter] = [];
  memo[letter].push({ ...country, key: country.label });
  return memo;
}, {});

let countrySections = Object.keys(groupedCountries).reduce((memo, key) => {  
  memo.push({
    data: groupedCountries[key],
    key: key
  });
  return memo;
}, []);

class CountryPickerScreen extends React.Component {
  render() {
    let { dispatch } = this.props;

    return (
      <View style={style.container}>
        <Header title="Select a country" showBack={true} onBack={() =>
          dispatch(navigateTo('signup'))
        }/>

        <SectionList
          initialNumToRender={16}
          maxToRenderPerBatch={16}
          renderItem={this.renderCountry}
          renderSectionHeader={this.renderCountryHeader}
          sections={countrySections}
        />
      </View>
    );
  }

  renderCountry = (data) => {
    let isFirst = data.index == 0;
    let isLast = (countrySections.length - 1).toString() === data.index;

    let styles = [
      style.country,
      isFirst && style.firstCountry,
      isLast && style.lastCountry
    ];

    return (
      <PressableView
        key={`item-${data.item.label}`}
        style={styles}
        activeStyle={style.countryActive}
        onPress={this.onSelect.bind(this, data.item)}
      >
        <BaseText style={style.countryText}>{data.item.label}</BaseText>
      </PressableView>
    );
  };

  renderCountryHeader = (data) => {
    return (
      <View style={style.countryHeader} key={`section-${data.section.key}`}>
        <View style={style.countryHeaderInner}>
          <BaseText style={style.countryText}>{data.section.key}</BaseText>
        </View>
      </View>
    );
  };

  onSelect = (country) => {
    let { dispatch } = this.props;

    dispatch(updateData({
      country: country.label,
      countryCode: country.code
    }));

    dispatch(navigateTo('signup'));
  };
}

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
    paddingHorizontal: Style.values.horizontalPadding,
    backgroundColor: 'white'
  },
  countryHeaderInner: {
    paddingVertical: 3,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: Style.values.midGray
  },
  country: {
    paddingHorizontal: Style.values.horizontalPadding,
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
