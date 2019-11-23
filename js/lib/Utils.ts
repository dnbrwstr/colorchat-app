import moment, {Moment} from 'moment';
import {TransformsStyle, StyleProp, ViewStyle} from 'react-native';
import {CameraColor} from './CameraTypes';
import Color from 'color';

export let bindObjectMethods = (object: {[key: string]: any}) => {
  for (var key in object) {
    if (typeof object[key] === 'function') {
      object[key] = object[key].bind(object);
    }
  }

  return object;
};

export let rand = (max: number) => {
  return Math.round(Math.random() * max);
};

export let constrain = (number: number, min: number, max: number) => {
  return Math.min(Math.max(number, min), max);
};

type DatePrimitive = Date | string | number;

let ensureDate = (date: DatePrimitive) => {
  if (date instanceof Date) {
    return date;
  } else {
    return new Date(date);
  }
};

const getReferenceTimes = () => {
  return {
    lastYear: moment(new Date()).subtract(1, 'years'),
    lastWeek: moment(new Date()).subtract(1, 'weeks'),
    yesterday: moment(new Date()).subtract(1, 'days'),
  };
};

type DateFormatter = ((m: Moment) => string) | string;

type DateFormatSettings = {
  lastYear: DateFormatter;
  currentYear: DateFormatter;
  currentWeek: DateFormatter;
  currentDay: DateFormatter;
};

export const isUndefined = (a: any): a is undefined => {
  return typeof a === 'undefined';
};

export const cameraColorToColor = ({r, g, b}: CameraColor) =>
  new Color({r, g, b});

const createDateFormatter = (formatObj: DateFormatSettings) => (
  date: DatePrimitive,
): string => {
  const refTimes = getReferenceTimes();
  const time = moment(ensureDate(date));
  let formatKey: keyof DateFormatSettings;

  if (time.isBefore(refTimes.lastYear)) {
    formatKey = 'lastYear';
  } else if (time.isBefore(refTimes.lastWeek)) {
    formatKey = 'currentYear';
  } else if (time.isBefore(refTimes.yesterday)) {
    formatKey = 'currentWeek';
  } else {
    formatKey = 'currentDay';
  }

  let format = formatObj[formatKey];

  if (typeof format === 'function') {
    return format(time);
  } else {
    return time.format(format);
  }
};

export let humanDate = (date: DatePrimitive) => {
  return createDateFormatter({
    lastYear: 'MMMM Do YYYY[\n]h:mm A',
    currentYear: 'MMMM Do[\n]h:mm A',
    currentWeek: 'dddd[\n]h:mm A',
    currentDay: m => m.fromNow(false),
  })(date);
};

export let shortHumanDate = (date: DatePrimitive) => {
  return createDateFormatter({
    lastYear: 'M/D/YY',
    currentYear: 'M/D',
    currentWeek: 'ddd',
    currentDay: 'h:mm A',
  })(date);
};

export let formatName = (firstName: string, lastName: string) => {
  return [firstName, lastName].filter(n => !!n).join(' ');
};

const timers: {[key: string]: Date} = {};

export const stopwatch = {
  start(label: string) {
    timers[label] = new Date();
  },
  stop(label: string) {
    console.log(label, new Date().getTime() - timers[label].getTime());
  },
};

export const clamp = (n: number, min: number, max: number) =>
  Math.max(Math.min(n, max), min);

export const makeArray = (n: number, f?: any) => {
  return new Array(n).fill(0).map((z, i) => {
    return typeof f === 'undefined' ? i : f;
  });
};

export const addZeros = (n: number, c = 3) => {
  let str = n.toString();
  while (str.length < c) {
    str = '0' + str;
  }
  return str;
};

export const lerp = (a: number, b: number, t: number) =>
  a + (b - a) * clamp(t, 0, 1);

export const makeColorString = ({
  r,
  g,
  b,
}: {
  r: number;
  g: number;
  b: number;
}) => {
  const values = [r, g, b].map(c => Math.round(c)).join(',');
  return `rgb(${values})`;
};

export const valSort = <T>(sortFn: (v: T) => number, reverse = false) => (
  a: T,
  b: T,
) => {
  const reverser = reverse ? -1 : 1;
  const valA = sortFn(a);
  const valB = sortFn(b);
  if (valA < valB) return -1 * reverser;
  else if (valA > valB) return 1 * reverser;
  else return 0;
};

type GetElementType<T extends Array<any>> = T extends (infer U)[] ? U : never;
type DefiniteTransform = GetElementType<Required<TransformsStyle>['transform']>;

export const getTransformsArray = (styleProp: StyleProp<ViewStyle>) => {
  const transforms = getTransforms(styleProp);
  if (transforms instanceof Array) return transforms;
  else return [transforms];
};

export const getTransforms = (
  styleProp: StyleProp<ViewStyle>,
): DefiniteTransform[] | DefiniteTransform => {
  if (styleProp instanceof Array)
    return styleProp
      .map(getTransforms)
      .reduce<DefiniteTransform[]>((memo, a) => {
        if (a instanceof Array) return [...memo, ...a];
        else return [...memo, a];
      }, []);
  else if (styleProp instanceof Object && styleProp.transform)
    return styleProp.transform;
  else return [];
};
