import React from "react";
import { SectionList, View, Text, ScrollView, PixelRatio } from "react-native";
import { connect } from "react-redux";
import Header from "./Header";
import Countries from "../lib/data/Countries";
import PressableView from "./PressableView";
import BaseText from "./BaseText";
import { updateData } from "../actions/SignupActions";
import { navigateTo } from "../actions/NavigationActions";
import Style from "../style";
import { connectWithStyles } from "../lib/withStyles";

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
    const { dispatch, styles, theme } = this.props;

    return (
      <View style={styles.container}>
        <Header
          title="Select a country"
          onPressBack={() => dispatch(navigateTo("signup"))}
        />

        <SectionList
          initialNumToRender={16}
          maxToRenderPerBatch={16}
          renderItem={this.renderCountry}
          // renderSectionHeader={this.renderCountryHeader}
          sections={countrySections}
        />
      </View>
    );
  }

  renderCountry = data => {
    const { dispatch, styles } = this.props;

    let isFirst = data.index == 0;
    let isLast = (countrySections.length - 1).toString() === data.index;

    let countryStyles = [
      styles.country,
      isFirst && styles.firstCountry,
      isLast && styles.lastCountry
    ];

    return (
      <PressableView
        key={`item-${data.item.label}`}
        style={countryStyles}
        activeStyle={styles.countryActive}
        onPress={this.onSelect.bind(this, data.item)}
      >
        <BaseText style={styles.countryText}>{data.item.label}</BaseText>
      </PressableView>
    );
  };

  renderCountryHeader = data => {
    const { dispatch, styles } = this.props;

    return (
      <View style={styles.countryHeader} key={`section-${data.section.key}`}>
        <View style={styles.countryHeaderInner}>
          <BaseText style={styles.countryText}>{data.section.key}</BaseText>
        </View>
      </View>
    );
  };

  onSelect = country => {
    let { dispatch } = this.props;

    dispatch(
      updateData({
        country: country.label,
        countryCode: country.code
      })
    );

    dispatch(navigateTo("signup"));
  };
}

const getStyles = theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor
  },
  countryHeader: {
    paddingHorizontal: Style.values.outerPadding
  },
  countryHeaderInner: {
    paddingVertical: 3,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: theme.secondaryBorderColor
  },
  country: {
    paddingHorizontal: Style.values.outerPadding,
    paddingVertical: 9,
    height: Style.values.rowHeight,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: theme.secondaryBorderColor,
    justifyContent: "center"
  },
  firstCountry: {
    paddingTop: 18
  },
  lastCountry: {
    paddingBottom: 27
  },
  countryText: {
    color: theme.primaryTextColor
  },
  countryActive: {
    backgroundColor: theme.highlightColor
  }
});

const selector = () => ({});

export default connectWithStyles(getStyles, selector)(CountryPickerScreen);
