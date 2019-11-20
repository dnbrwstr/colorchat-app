import React, {Component} from 'react';
import {Animated, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import PressableBlob from './PressableBlob';

export interface SpringButtonProps {
  visible: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
}

class SpringButton extends Component<SpringButtonProps> {
  animatedOpacity = new Animated.Value(this.props.visible ? 1 : 0);
  opacityAnimation?: Animated.CompositeAnimation;

  componentDidUpdate(prevProps: SpringButtonProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.opacityAnimation) this.opacityAnimation.stop();
      const nextOpacity = this.props.visible ? 1 : 0;
      this.opacityAnimation = Animated.timing(this.animatedOpacity, {
        toValue: nextOpacity,
        duration: 200,
      });
      this.opacityAnimation.start();
    }
  }

  render() {
    const opacityStyle = {
      opacity: this.animatedOpacity,
    };

    return (
      <Animated.View style={[this.props.style, opacityStyle]}>
        <PressableBlob
          style={[styles.content, this.props.contentStyle]}
          onPress={this.props.onPress}
        >
          {this.props.children}
        </PressableBlob>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

export default SpringButton;
