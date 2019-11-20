import React, {FC, useCallback} from 'react';
import {SectionList, View, PixelRatio, ListRenderItemInfo} from 'react-native';
import Header from './Header';
import Countries, {CountryData} from '../lib/data/Countries';
import PressableView from './PressableView';
import BaseText from './BaseText';
import {updateData} from '../store/signup/actions';
import {navigateTo} from '../store/navigation/actions';
import Style from '../style';
import {useStyles, makeStyleCreator} from '../lib/withStyles';
import {useDispatch} from 'react-redux';
import {Theme} from '../style/themes';

type CountryListItemData = CountryData & {key: string};
type CountriesByLetter = {[K: string]: CountryListItemData[]};

const groupedCountries = Countries.reduce(
  (memo: CountriesByLetter, country: CountryData) => {
    const letter = country.label[0].toUpperCase();
    if (!memo[letter]) memo[letter] = [];
    memo[letter].push({...country, key: country.label});
    return memo;
  },
  {},
);

type CountrySectionList = {data: CountryListItemData[]; key: string}[];

const countrySections = Object.keys(groupedCountries).reduce<
  CountrySectionList
>((memo, key) => {
  memo.push({
    data: groupedCountries[key],
    key: key,
  });
  return memo;
}, []);

const CountryPickerScreen: FC<{}> = props => {
  const dispatch = useDispatch();
  const {styles, theme} = useStyles(getStyles);

  const handleSelection = useCallback((country: CountryListItemData) => {
    dispatch(
      updateData({
        country: country.label,
        countryCode: country.code,
      }),
    );
    dispatch(navigateTo('signup'));
  }, []);

  const handlePressBack = useCallback(() => {
    dispatch(navigateTo('signup'));
  }, []);

  const renderCountry = (data: ListRenderItemInfo<CountryListItemData>) => {
    return (
      <MemoizedCountryPickerCountry {...data} onSelect={handleSelection} />
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Select a country" onPressBack={handlePressBack} />
      <SectionList
        initialNumToRender={16}
        maxToRenderPerBatch={16}
        renderItem={renderCountry}
        sections={countrySections}
      />
    </View>
  );
};

type CountryPickerCountryProps = ListRenderItemInfo<CountryListItemData> & {
  onSelect: (data: CountryListItemData) => void;
};

const CountryPickerCountry: FC<CountryPickerCountryProps> = props => {
  const {theme, styles} = useStyles(getStyles);
  const handlePress = useCallback(() => {
    props.onSelect(props.item);
  }, [props.item]);

  let isFirst = props.index == 0;
  let isLast = countrySections.length - 1 === props.index;

  let countryStyles = [
    styles.country,
    isFirst && styles.firstCountry,
    isLast && styles.lastCountry,
  ];

  return (
    <PressableView
      key={`item-${props.item.label}`}
      style={countryStyles}
      activeStyle={styles.countryActive}
      onPress={handlePress}
    >
      <BaseText style={styles.countryText}>{props.item.label}</BaseText>
    </PressableView>
  );
};

const MemoizedCountryPickerCountry = React.memo(CountryPickerCountry);

const getStyles = makeStyleCreator((theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  countryHeader: {
    paddingHorizontal: Style.values.outerPadding,
  },
  countryHeaderInner: {
    paddingVertical: 3,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: theme.secondaryBorderColor,
  },
  country: {
    paddingHorizontal: Style.values.outerPadding,
    paddingVertical: 9,
    height: Style.values.rowHeight,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: theme.secondaryBorderColor,
    justifyContent: 'center',
  },
  firstCountry: {
    paddingTop: 18,
  },
  lastCountry: {
    paddingBottom: 27,
  },
  countryText: {
    color: theme.primaryTextColor,
  },
  countryActive: {
    backgroundColor: theme.highlightColor,
  },
}));

export default CountryPickerScreen;
