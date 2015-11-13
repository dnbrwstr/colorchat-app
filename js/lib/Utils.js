import moment from 'moment';

export let bindObjectMethods = object => {
  for (var key in object) {
    if (typeof object[key] === 'function');
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
    lastYear: moment(new Date()).subtract(1, 'years'),
    lastWeek: moment(new Date()).subtract(1, 'weeks'),
    yesterday: moment(new Date()).subtract(1, 'days')
  }
};

let createDateFormatter = formatObj => date => {
  let refTimes = getReferenceTimes();
  let time = moment(ensureDate(date));
  let formatKey;

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

export let humanDate = date => {
  return createDateFormatter({
    lastYear: 'MMM Do YYYY, h:mm A',
    currentYear: 'MMM Do, h:mm A',
    currentWeek: 'ddd, h:mm A',
    currentDay: m => m.fromNow(false)
  })(date);
};

export let shortHumanDate = date => {
  return createDateFormatter({
    lastYear: 'M/D/YY',
    currentYear: 'M/D',
    currentWeek: 'ddd',
    currentDay: 'h:mm A'
  })(date);
};
