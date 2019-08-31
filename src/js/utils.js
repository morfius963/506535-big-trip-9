import moment from 'moment';

export const getRandomNum = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

export const makeFirstSymUp = (value) => `${value[0].toUpperCase()}${value.substring(1)}`;

export const getRandomArray = (arr, min, max) => {
  const sortedArray = arr.slice().sort(() => Math.random() - 0.5);
  const randomMax = getRandomNum(min, max);

  return sortedArray.slice(min, randomMax);
};

export const getFullEventPrice = (eventsList) => (
  eventsList.reduce((acc, {cost, offers}) => {
    const offerFullPrice = offers.reduce((accum, {price, isChecked}) => (isChecked ? accum + price : accum), 0);

    return acc + cost + offerFullPrice;
  }, 0)
);

export const formattedDate = (ts, value = `date`) => {
  const date = moment(ts, `DD/MM/YY HH:mm`);

  if (value === `date`) {
    return date.format(`DD/MM/YY`);
  }

  return date.format(`HH:mm`);
};

export const formattedTimeDifference = (ts1, ts2) => {
  const dateFrom = moment(ts1, `DD/MM/YY HH:mm`);
  const dateTo = moment(ts2, `DD/MM/YY HH:mm`);
  const diff = dateTo.diff(dateFrom);
  const duration = moment.duration(diff);

  const minutesPart = `${String(duration.minutes()).padStart(2, `0`)}M`;
  const hoursPart = (duration.days() > 0 || duration.hours() > 0) ? `${String(duration.hours()).padStart(2, `0`)}H` : ``;
  const daysPart = duration.days() > 0 ? `${String(duration.days()).padStart(2, `0`)}D` : ``;

  return `${daysPart} ${hoursPart} ${minutesPart}`;
};

export const getDateDiff = (a, b) => moment(a, `DD/MM/YY HH:mm`).valueOf() - moment(b, `DD/MM/YY HH:mm`).valueOf();

export const POSITION = {
  afterbegin: `afterbegin`,
  beforeend: `beforeend`,
  afterend: `afterend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const renderElement = (container, element, place) => {
  switch (place) {
    case POSITION.afterbegin:
      container.prepend(element);
      break;
    case POSITION.beforeend:
      container.append(element);
      break;
    case POSITION.afterend:
      container.after(element);
      break;
  }
};

export const unrenderElement = (element) => {
  if (element) {
    element.remove();
  }
};
