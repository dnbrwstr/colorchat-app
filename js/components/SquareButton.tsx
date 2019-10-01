import React, {FC, useState, useRef, useCallback} from 'react';
import {
  Animated,
  View,
  Text,
  StyleProp,
  NativeSyntheticEvent,
  TargetedEvent,
} from 'react-native';
import Style from '../style';
import {useStyles} from '../lib/withStyles';
import PressableView from './PressableView';
import BaseText from './BaseText';

type PressEvent = NativeSyntheticEvent<TargetedEvent>;

const SquareButtonFC: FC<{
  label: string;
  onPressIn: (e: PressEvent) => void;
  onPressOut: (e: PressEvent) => void;
  onPress: (e: PressEvent) => void;
  style: StyleProp<View>;
  activeStyle: StyleProp<View>;
  textStyle: StyleProp<Text>;
  activeTextStyle: StyleProp<Text>;
}> = props => {
  const [isActive, setIsActive] = useState(false);
  const currentAnimation = useRef<Animated.CompositeAnimation>();
  const animatedScale = useRef(new Animated.Value(1));

  const runAnimation = (animation: Animated.CompositeAnimation) => {
    if (currentAnimation.current) {
      currentAnimation.current.stop();
    }
    currentAnimation.current = animation;
    animation.start(() => {
      currentAnimation.current = undefined;
    });
  };

  const onPressIn = useCallback(
    e => {
      let animation = Animated.timing(animatedScale.current, {
        toValue: 0.95,
        duration: 100,
      });
      runAnimation(animation);
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

  const onPress = useCallback(
    e => {
      let animation = Animated.timing(animatedScale.current, {
        toValue: 1,
        duration: 100,
      });
      runAnimation(animation);
      props.onPress && props.onPress(e);
    },
    [props.onPress],
  );

  const {styles} = useStyles(getStyles);

  let buttonStyles = [
    styles.button,
    props.style,
    {transform: [{scale: animatedScale.current}]},
  ];

  let textStyles = [
    styles.text,
    props.textStyle,
    isActive && styles.textActive,
    isActive && props.activeTextStyle,
  ];

  return (
    <PressableView
      style={buttonStyles}
      activeStyle={[styles.buttonActive, props.activeStyle]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
    >
      <BaseText style={textStyles}>{props.label}</BaseText>
    </PressableView>
  );
};

// let SquareButton = createReactClass({
//   displayName: 'SquareButton',

//   propTypes: {
//     label: PropTypes.string,
//     onPressIn: PropTypes.func,
//     onPressOut: PropTypes.func,
//     onPress: PropTypes.func,
//     style: Animated.View.propTypes.style,
//     activeStyle: ViewPropTypes.style,
//     textStyle: Text.propTypes.style,
//     activeTextStyle: ViewPropTypes.style,
//   },

//   getDefaultProps: function() {
//     return {
//       onPressIn: () => {},
//       onPressOut: () => {},
//       onPress: () => {},
//     };
//   },

//   getInitialState() {
//     return {
//       active: false,
//       animatedScale: new Animated.Value(1),
//     };
//   },

//   handlePressIn: function() {
//     let animation = Animated.timing(this.state.animatedScale, {
//       toValue: 0.95,
//       duration: 100,
//     });
//     this.runAnimation(animation);
//     this.setState({active: true});
//     this.props.onPressIn.apply(null, arguments);
//   },

//   handlePressOut: function() {
//     this.setState({active: false});
//     this.props.onPressOut.apply(null, arguments);
//   },

//   handlePress: function() {
//     let animation = Animated.timing(this.state.animatedScale, {
//       toValue: 1,
//       duration: 100,
//     });
//     this.runAnimation(animation);
//     this.props.onPress.apply(null, arguments);
//   },

//   runAnimation: function(animation) {
//     if (this.state.currentAnimation) {
//       this.state.currentAnimation.stop();
//     }
//     this.setState({currentAnimation: animation});
//     animation.start(() => {
//       this.setState({currentAnimation: null});
//     });
//   },

//   render: function() {
//     const {styles} = this.props;
//     let buttonStyles = [
//       styles.button,
//       this.props.style,
//       {transform: [{scale: this.state.animatedScale}]},
//     ];

//     let textStyles = [
//       styles.text,
//       this.props.textStyle,
//       this.state.active && styles.textActive,
//       this.state.active && this.props.activeTextStyle,
//     ];

//     return (
//       <PressableView
//         style={buttonStyles}
//         activeStyle={[styles.buttonActive, this.props.activeStyle]}
//         onPressIn={this.handlePressIn}
//         onPress={this.handlePress}
//       >
//         <BaseText style={textStyles}>{this.props.label}</BaseText>
//       </PressableView>
//     );
//   },
// });

let getStyles = theme => ({
  button: {
    flex: 0,
    justifyContent: 'center',
    height: Style.values.buttonHeight,
    margin: Style.values.outerPadding,
    padding: Style.values.basePadding * 1.5,
    borderColor: theme.primaryBorderColor,
    borderWidth: Style.values.borderWidth,
  },
  buttonActive: {},
  text: {
    textAlign: 'center',
  },
  textActive: {},
});

export default SquareButtonFC;
