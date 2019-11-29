import React, {Component} from 'react';
import {Animated, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import PressableBlob from './PressableBlob';

export interface SpringButtonProps {
  visible?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export interface SpringButtonState {
  shouldRender: boolean;
}

class SpringButton extends Component<SpringButtonProps, SpringButtonState> {
  static defaultProps = {
    visible: true,
  };

  constructor(props: SpringButtonProps) {
    super(props);

    this.state = {
      shouldRender: !!props.visible,
    };
  }

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
      if (nextOpacity === 1) {
        this.setState({shouldRender: true});
      }
      this.opacityAnimation.start(({finished}) => {
        if (finished && nextOpacity === 0) {
          this.setState({shouldRender: false});
        }
      });
    }
  }

  render() {
    const opacityStyle = {
      opacity: this.animatedOpacity,
    };

    return this.state.shouldRender ? (
      <Animated.View style={[this.props.style, opacityStyle]}>
        <PressableBlob
          style={[styles.content, this.props.contentStyle]}
          onPress={this.handlePress}
        >
          {this.props.children}
        </PressableBlob>
      </Animated.View>
    ) : null;
  }

  handlePress = () => {
    this.props.visible && this.props.onPress && this.props.onPress();
  };
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

export default SpringButton;
