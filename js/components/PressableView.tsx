import React, {FC, useState, useCallback, PropsWithRef, Ref} from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  ViewProps,
  StyleProp,
  TouchableWithoutFeedbackProps,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';

type PressableViewProps = PropsWithRef<
  ViewProps & {
    onPress?: (e: GestureResponderEvent) => void;
    onPressIn?: (e: GestureResponderEvent) => void;
    onPressOut?: (e: GestureResponderEvent) => void;
    activeStyle?: StyleProp<ViewStyle>;
    ref?: Ref<TouchableWithoutFeedback>;
  }
>;

const PressableViewFC: FC<PressableViewProps> = props => {
  const [isActive, setIsActive] = useState(false);
  const {onPress, ...rest} = props;

  const onPressIn = useCallback(
    e => {
      setIsActive(true);
      props.onPressIn && props.onPressIn(e);
    },
    [props.onPressIn],
  );

  const onPressOut = useCallback(
    e => {
      setIsActive(false);
      props.onPressOut && props.onPressOut(e);
    },
    [props.onPressOut],
  );

  const style = [props.style, isActive && props.activeStyle];

  return (
    <TouchableWithoutFeedback
      ref={props.ref}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View {...rest} style={style} />
    </TouchableWithoutFeedback>
  );
};

// let PressableView = createReactClass<PressableViewProps, {}>({
//   displayName: 'PressableView',

//   getDefaultProps: function() {
//     return {
//       onPressIn: () => {},
//       onPressOut: () => {},
//     };
//   },

//   getInitialState: () => ({active: false}),

//   render: function() {
//     const {onPressIn, onPressOut, onPress, ...rest} = this.props;

//     return (
//       <TouchableWithoutFeedback
//         onPress={onPress}
//         onPressIn={this.onPressIn}
//         onPressOut={this.onPressOut}>
//         <Animated.View {...rest} style={this.getStyle()}>
//           {this.props.children}
//         </Animated.View>
//       </TouchableWithoutFeedback>
//     );
//   },

//   getStyle: function() {
//     let baseStyle = this.props.style;
//     let style = baseStyle instanceof Array ? baseStyle.slice(0) : [baseStyle];

//     if (this.state.active) {
//       style.push(this.props.activeStyle);
//     }

//     return style;
//   },

//   onPressIn: function() {
//     this.setState({
//       active: true,
//     });

//     this.props.onPressIn.apply(null, arguments);
//   },

//   onPressOut: function() {
//     this.setState({
//       active: false,
//     });

//     this.props.onPressOut.apply(null, arguments);
//   },
// });

export default PressableViewFC;
