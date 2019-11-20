import {UIManager, findNodeHandle} from 'react-native';
import {Component, RefObject} from 'react';

export interface NodeMeasurement {
  x: number;
  y: number;
  width: number;
  height: number;
  left: number;
  top: number;
}

export default <T extends RefObject<Component>>(
  ref: T,
): Promise<NodeMeasurement> =>
  new Promise((resolve, reject) => {
    if (!ref.current) return;
    const handle = findNodeHandle(ref.current);
    if (!handle) return;
    UIManager.measure(handle, (x, y, width, height, left, top) =>
      resolve({
        x,
        y,
        width,
        height,
        left,
        top,
      }),
    );
  });
