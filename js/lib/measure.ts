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
    if (!ref.current) {
      console.log('unable to measure, no ref');
      return resolve();
    }
    const handle = findNodeHandle(ref.current);
    if (!handle) {
      console.log('unable to mesarteu, coudnt find handle');
      return resolve;
    }
    UIManager.measure(handle, (x, y, width, height, pageX, pageY) =>
      resolve({
        x,
        y,
        width,
        height,
        left: pageX,
        top: pageY,
      }),
    );
  });
