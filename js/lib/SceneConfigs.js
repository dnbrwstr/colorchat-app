/**
Adapted from 
https://github.com/facebook/react-native/blob/master/Libraries/CustomComponents/Navigator/NavigatorSceneConfigs.js
**/

import buildStyleInterpolator from 'react-native/Libraries/Utilities/buildStyleInterpolator';
import { Dimensions, PixelRatio } from 'react-native';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let Base = {
  gestures: null,
  defaultTransitionVelocity: 3,
  springFriction: 20,
  springTension: 400,
};

let BaseLeftToRightGesture = {
  isDetachable: false,
  gestureDetectMovement: 2,
  notMoving: 0.3,
  directionRatio: 0.66,
  snapVelocity: 2,
  edgeHitWidth: 30,
  stillCompletionRatio: 3 / 5,
  fullDistance: screenWidth,
  direction: 'left-to-right',
};

let BaseRightToLeftGesture = {
  ...BaseLeftToRightGesture,
  direction: 'right-to-left'
};

let ConstantOpacity = {
  opacity: {
    value: 1.0,
    type: 'constant',
  }
}

let TransformPropBase = {
  min: 0,
  max: 1,
  type: 'linear',
  extrapolate: true,
  round: PixelRatio.get()
};

export let FromBottom = {
  ...Base,
  animationInterpolators: {
    into: buildStyleInterpolator({
      ...ConstantOpacity,
      transformTranslate: {
        ...TransformPropBase,
        from: {x: 0, y: screenHeight, z: 0},
        to: {x: 0, y: 0, z: 0}
      },
      translateY: {
        ...TransformPropBase,
        from: screenHeight,
        to: 0
      },
      scaleX: {
        value: 1,
        type: 'constant',
      },
      scaleY: {
        value: 1,
        type: 'constant',
      }
    }),
    out: buildStyleInterpolator({
      opacity: {
        ...TransformPropBase,
        from: 1,
        to : .7,
        extrapolate: false,
        round: 100
      }
    })
  }
};

export let SlideFromRight = {
  ...Base,
  gestures: {
    jumpBack: {
      ...BaseLeftToRightGesture
    }
  },
  animationInterpolators: {
    into: buildStyleInterpolator({
      ...ConstantOpacity,
      transformTranslate: {
        ...TransformPropBase,
        from: {x: screenWidth, y: 0, z: 0},
        to: {x: 0, y: 0, z: 0}
      },
      translateX: {
        ...TransformPropBase,
        from: screenWidth,
        to: 0
      }
    }),
    out: buildStyleInterpolator({
      ...ConstantOpacity,
      transformTranslate: {
        ...TransformPropBase,
        from: {x: 0, y: 0, z: 0},
        to: {x: -screenWidth, y: 0, z: 0}
      },
      translateX: {
        ...TransformPropBase,
        from: 0,
        to: -screenWidth
      }
    })
  }
}

export let SlideFromLeft = {
  ...Base,
  gestures: {
    jumpForward: {
      ...BaseRightToLeftGesture
    }
  },
  animationInterpolators: {
    into: buildStyleInterpolator({
      ...ConstantOpacity,
      transformTranslate: {
        ...TransformPropBase,
        from: {x: -screenWidth, y: 0, z: 0},
        to: {x: 0, y: 0, z: 0}
      },
      translateX: {
        ...TransformPropBase,
        from: -screenWidth,
        to: 0
      }
    }),
    out: buildStyleInterpolator({
      ...ConstantOpacity,
      transformTranslate: {
        ...TransformPropBase,
        from: {x: 0, y: 0, z: 0},
        to: {x: -screenWidth, y: 0, z: 0}
      },
      translateX: {
        ...TransformPropBase,
        from: 0,
        to: -screenWidth
      }
    })
  }
}