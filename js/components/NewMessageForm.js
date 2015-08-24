import React from 'react-native';
import { find } from 'ramda';
import PressableView from './PressableView';
import SimpleColorPicker from './SimpleColorPicker';
import AdvancedColorPicker from './AdvancedColorPicker';
import RecentColorPicker from './RecentColorPicker';
import Style from '../style';

let {
  Text,
  View
} = React;

let menuItems = [
  {
    label: 'Simple',
    slug: 'simple',
    component: SimpleColorPicker
  },
  {
    label: 'Advanced',
    slug: 'advanced',
    component: AdvancedColorPicker
  },
  {
    label: 'Recent',
    slug: 'recent',
    component: RecentColorPicker
  }
];

let NewMessageForm = React.createClass({
  render: function () {
    let slug = this.props.colorPicker;
    let Picker = find(i => i.slug === slug)(menuItems).component;

    return (
      <View style={style.container}>
        <View style={toggle.container}>
          { menuItems.map(item => (
            <PressableView style={[
              toggle.item,
              slug === item.slug && toggle.itemSelected
            ]} onPress={() => this.props.onSelectPicker(item.slug) }>
              <Text style={[
                toggle.itemText,
                slug === item.slug && toggle.itemSelectedText
              ]}>{item.label}</Text>
            </PressableView>
          )) }
        </View>

        <View style={style.colorPickerContainer}>
          <Picker ref="picker" />
        </View>

        <View style={style.bottomControls}>
          <PressableView style={style.hideButton} onPress={this.onHide}>
            <Text style={style.hideButtonText}>v</Text>
          </PressableView>
          <PressableView style={style.submitButton} onPress={this.onSubmit}>
            <Text style={style.submitButtonText}>Send</Text>
          </PressableView>
        </View>
      </View>
    );
  },

  onHide: function () {
    if (this.props.onHide) this.props.onHide();
  },

  onSubmit: function () {
    if (this.props.onSubmit) this.props.onSubmit(this.refs.picker.getValue())
  }
});

let style = Style.create({
  container: {
    flex: 1
  },
  colorPickerContainer: {
    flex: 1,
    backgroundColor: '#666'
  },
  bottomControls: {
    flexDirection: 'row'
  },
  hideButton: {
    flex: 0
  },
  hideButtonText: {
    color: 'white',
    padding: 12,
    backgroundColor: '#777'
  },
  submitButton: {
    flex: 1
  },
  submitButtonText: {
    flex: 1,
    color: 'white',
    textAlign: 'center',
    padding: 12
  }
});

let toggle = Style.create({
  container: {
    backgroundColor: '#555',
    flexDirection: 'row'
  },
  item: {
    flex: 1,
    backgroundColor: '#444',
    padding: 12
  },
  itemText: {
    color: '#EFEFEF',
    textAlign: 'center'
  },
  itemSelected: {
    backgroundColor: '#555'
  },
  itemSelectedText: {
    color: 'white'
  }
});

export default NewMessageForm;
