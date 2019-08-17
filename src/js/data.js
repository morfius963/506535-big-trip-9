import {getRandomArray} from './utils.js';
import {getRandomNum} from './utils.js';
import {sortEventsByDate} from './utils.js';

const EVENTS_COUNT = 4;
const RANDOM_STR = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;
const MOCK_DATA_COUNT = {
  DESCRIPTION: {
    MIN: 1,
    MAX: 3
  },
  OFFERS: {
    MIN: 0,
    MAX: 2
  }
};

// структура данних однієї точки
const getEventData = () => ({
  type: eventTypes[Math.floor(Math.random() * 10)],

  city: [`Island`, `Paris`, `Malaga`, `Geneva`, `Ternopil`, `New York`, `Chicago`, `London`][Math.floor(Math.random() * 8)],

  images: new Array(6).fill(``).map(() => `${`http://picsum.photos/300/150?r=${Math.random()}`}`),

  description: getRandomArray(RANDOM_STR.split(`. `), MOCK_DATA_COUNT.DESCRIPTION.MIN, MOCK_DATA_COUNT.DESCRIPTION.MAX).join(`. `),

  eventTime: {
    from: {
      date: `18/11/19`,
      time: `10:30`
    },
    to: {
      date: `20/11/19`,
      time: `18:00`
    },
    activityTime: `07H 30M`
  },

  cost: getRandomNum(100, 500),

  offers: getRandomArray([
    {
      name: `Add luggage`,
      id: `luggage`,
      price: 10,
      isChecked: Boolean(Math.round(Math.random()))
    },
    {
      name: ` Switch to comfort class`,
      id: `comfort`,
      price: 150,
      isChecked: Boolean(Math.round(Math.random()))
    },
    {
      name: `Add meal`,
      id: `meal`,
      price: 2,
      isChecked: Boolean(Math.round(Math.random()))
    },
    {
      name: `Choose seats`,
      id: `seats`,
      price: 9,
      isChecked: Boolean(Math.round(Math.random()))
    },
  ], MOCK_DATA_COUNT.OFFERS.MIN, MOCK_DATA_COUNT.OFFERS.MAX),
});

// структура данних путнку меню
const getMenuData = (value) => ({
  name: value,
  isActive: value === `table` ? true : false
});

// структура данних фільтру
const getFilterData = (value) => ({
  name: value,
  isChecked: value === `everything` ? true : false
});

// структура данних інформації про подорож
const getTripInfoData = (trips) => ({
  cities: trips.map(({city}) => city),
  date: {
    start: trips[0].eventTime.from.date,
    end: trips[trips.length - 1].eventTime.to.date
  }
});

const menuValues = [`table`, `stats`];
const filterValues = [`everything`, `future`, `past`];

export const eventTypes = [
  {
    value: `taxi`,
    group: `transfer`,
    placeholder: `to`
  },
  {
    value: `bus`,
    group: `transfer`,
    placeholder: `to`
  },
  {
    value: `train`,
    group: `transfer`,
    placeholder: `to`
  },
  {
    value: `ship`,
    group: `transfer`,
    placeholder: `to`
  },
  {
    value: `transport`,
    group: `transfer`,
    placeholder: `to`
  },
  {
    value: `drive`,
    group: `transfer`,
    placeholder: `to`
  },
  {
    value: `flight`,
    group: `transfer`,
    placeholder: `to`
  },
  {
    value: `restaurant`,
    group: `activity`,
    placeholder: `in`
  },
  {
    value: `check-in`,
    group: `activity`,
    placeholder: `in`
  },
  {
    value: `sightseeing`,
    group: `activity`,
    placeholder: `in`
  }
];

export const events = new Array(EVENTS_COUNT).fill(``).map(getEventData).sort(sortEventsByDate);
export const menuData = menuValues.map(getMenuData);
export const filters = filterValues.map(getFilterData);
export const tripInfo = getTripInfoData(events);
