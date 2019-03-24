import moment from "moment";

export let bindObjectMethods = object => {
  for (var key in object) {
    if (typeof object[key] === "function");
    object[key] = object[key].bind(object);
  }

  return object;
};

export let rand = max => {
  return Math.round(Math.random() * max);
};

export let constrain = (number, min, max) => {
  return Math.min(Math.max(number, min), max);
};

let ensureDate = date => {
  if (date instanceof Date) {
    return date;
  } else {
    return new Date(date);
  }
};

let getReferenceTimes = () => {
  return {
    lastYear: moment(new Date()).subtract(1, "years"),
    lastWeek: moment(new Date()).subtract(1, "weeks"),
    yesterday: moment(new Date()).subtract(1, "days")
  };
};

let createDateFormatter = formatObj => date => {
  let refTimes = getReferenceTimes();
  let time = moment(ensureDate(date));
  let formatKey;

  if (time.isBefore(refTimes.lastYear)) {
    formatKey = "lastYear";
  } else if (time.isBefore(refTimes.lastWeek)) {
    formatKey = "currentYear";
  } else if (time.isBefore(refTimes.yesterday)) {
    formatKey = "currentWeek";
  } else {
    formatKey = "currentDay";
  }

  let format = formatObj[formatKey];

  if (typeof format === "function") {
    return format(time);
  } else {
    return time.format(format);
  }
};

export let humanDate = date => {
  return createDateFormatter({
    lastYear: "MMM Do YYYY, h:mm A",
    currentYear: "MMM Do, h:mm A",
    currentWeek: "ddd, h:mm A",
    currentDay: m => m.fromNow(false)
  })(date);
};

export let shortHumanDate = date => {
  return createDateFormatter({
    lastYear: "M/D/YY",
    currentYear: "M/D",
    currentWeek: "ddd",
    currentDay: "h:mm A"
  })(date);
};

export let formatName = (firstName, lastName) => {
  return [firstName, lastName].filter(n => !!n).join(" ");
};

const timers = {};

export const stopwatch = {
  start(label) {
    timers[label] = new Date();
  },
  stop(label) {
    console.log(label, new Date() - timers[label]);
  }
};

export const clamp = (n, min, max) => Math.max(Math.min(n, max), min);

export const makeArray = n => {
  return new Array(n).fill(0).map((z, i) => i);
};

export const sat = color => rgb2hsv(color).s;

export const addZeros = (n, c = 3) => {
  let str = n.toString();
  while (str.length < c) {
    str = "0" + str;
  }
  return str;
};

export const lerp = (a, b, t) => a + (b - a) * clamp(t, 0, 1);

export const makeColorString = ({ r, g, b }) => {
  const values = [r, g, b].map(c => Math.round(c)).join(",");
  return `rgb(${values})`;
};

export const valSort = (sortFn, reverse = false) => (a, b) => {
  const reverser = reverse ? -1 : 1;
  const valA = sortFn(a);
  const valB = sortFn(b);
  if (valA < valB) return -1 * reverser;
  else if (valA > valB) return 1 * reverser;
  else return 0;
};

export const getTransforms = styleProp => {
  if (!styleProp) return [];
  else if (!(styleProp instanceof Array)) styleProp = [styleProp];
  return styleProp
    .map(o => o.transform)
    .filter(o => !!o)
    .reduce((memo, a) => {
      return [...memo, ...a];
    }, []);
};
