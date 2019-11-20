import React, {Component} from 'react';
import {StyleSheet, Animated, StyleProp, ViewStyle} from 'react-native';
import SimpleColorPicker from './SimpleColorPicker';

interface AvatarEditorProps {
  initialValue: string;
  style: StyleProp<ViewStyle>;
  scaleAxis: 'x' | 'y' | 'both';
  onInteractionStart: Function;
  onInteractionEnd: Function;
  onChange: (color: string) => void;
}

class AvatarEditor extends Component<AvatarEditorProps> {
  scale = new Animated.Value(1);
  animation?: Animated.CompositeAnimation;

  static defaultProps = {
    scaleAxis: 'both',
  };

  render() {
    const {style, scaleAxis} = this.props;
    const scaleX = scaleAxis === 'x' || scaleAxis === 'both';
    const scaleY = scaleAxis === 'y' || scaleAxis === 'both';

    const transform = [];
    if (scaleX) transform.push({scaleX: this.scale});
    if (scaleY) transform.push({scaleY: this.scale});

    const viewStyles = ([
      styles.container,
      {transform},
      style,
    ] as any[]) as ViewStyle[];

    return (
      <SimpleColorPicker
        initialValue={this.props.initialValue}
        style={viewStyles}
        onInteractionStart={this.handleInteractionStart}
        onInteractionEnd={this.handleInteractionEnd}
        onChange={this.handleChange}
      />
    );
  }

  handleInteractionStart = () => {
    this.props.onInteractionStart && this.props.onInteractionStart();

    this.animation && this.animation.stop();

    this.animation = Animated.spring(this.scale, {
      toValue: 1.03,
      friction: 7,
      tension: 150,
    });

    this.animation.start();
  };

  handleInteractionEnd = () => {
    this.props.onInteractionEnd && this.props.onInteractionEnd();

    this.animation && this.animation.stop();

    this.animation = Animated.spring(this.scale, {
      toValue: 1,
      friction: 7,
      tension: 150,
    });

    this.animation.start();
  };

  handleChange = (color: string) => {
    this.props.onChange && this.props.onChange(color);
  };
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 250,
    borderRadius: 1000,
  },
});

export default AvatarEditor;
