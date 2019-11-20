import {useRef, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';

export const useUpdateEffect = (fn: () => void, watchVars: any[]) => {
  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
    } else {
      return fn();
    }
  }, watchVars);
};

export const useAnimatedValue = (initialValue: number) => {
  return useMemo(() => {
    return new Animated.Value(initialValue);
  }, []);
};
