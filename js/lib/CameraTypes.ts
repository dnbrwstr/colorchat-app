export interface CameraColor {
  r: number;
  g: number;
  b: number;
  size: number;
}

export interface CameraColorChangeEvent {
  nativeEvent: {
    colors: CameraColor[];
  };
}

export type CameraLocation = 'front' | 'back';
