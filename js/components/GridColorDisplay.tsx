import React, {Component} from 'react';
import {View, Animated} from 'react-native';
import {makeArray} from '../lib/Utils';
import PressableBlob from './PressableBlob';
import withStyles, {InjectedStyles, makeStyleCreator} from '../lib/withStyles';
import {Theme} from '../style/themes';
import {DetectedColor} from 'react-native-color-camera';

interface GridColorDisplayProps {
  styles: InjectedStyles<typeof getStyles>;
  lastColors: DetectedColor[];
  animatedColors: Animated.AnimatedInterpolation[];
  animatedAbsoluteSizes: Animated.AnimatedInterpolation[];
  getColorValue: (i: number) => DetectedColor;
  onSelectColor?: (color: DetectedColor) => void;
}

class GridColorDisplay extends Component<GridColorDisplayProps> {
  render() {
    const {styles} = this.props;
    const hasColors = this.props.lastColors && this.props.lastColors.length;

    return (
      <View style={styles.container}>
        {hasColors && this.renderGridColors()}
      </View>
    );
  }

  renderGridColors = () => {
    const {styles} = this.props;
    const rows = 4;
    const columns = 4;

    return makeArray(columns).map(y => {
      return (
        <Animated.View style={styles.gridColorColumn} key={y}>
          {makeArray(rows).map(x => {
            const i = x * rows + y;
            return this.renderColor(i);
          })}
        </Animated.View>
      );
    });
  };

  renderColor(i: number) {
    const {
      styles,
      animatedColors: colors,
      animatedAbsoluteSizes: sizes,
    } = this.props;

    const sizeStyle = {
      // flexBasis: sizes[i].interpolate({
      //   inputRange: [20, 100],
      //   outputRange: [2000, 10000]
      // })
    };

    const colorStyle = {
      backgroundColor: colors[i],
    };

    return (
      <Animated.View style={[styles.gridColor, sizeStyle]} key={i}>
        <PressableBlob
          style={styles.gridColorButton}
          onPress={() => this.handleSelectColor(i)}
        >
          <Animated.View style={[styles.gridColorBackground, colorStyle]} />
        </PressableBlob>
      </Animated.View>
    );
  }

  handleSelectColor = (i: number) => {
    const value = this.props.getColorValue(i);
    this.props.onSelectColor && this.props.onSelectColor(value);
  };
}

const getStyles = makeStyleCreator((theme: Theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 1,
  },
  gridColorColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  gridColor: {
    flex: 1,
    marginTop: -1,
  },
  gridColorButton: {
    flex: 1,
  },
  gridColorBackground: {
    flex: 1,
  },
  colorFill: {
    flex: 1,
  },
}));

export default withStyles(getStyles)(GridColorDisplay);
