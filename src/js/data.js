import {getRandomArray} from './utils.js';
import {getRandomNum} from './utils.js';

const RANDOM_STR = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;
const MOCK_DATA_COUNT = {
  DESCRIPTION: {
    MIN: 1,
    MAX: 3
  },
  OFFERS: {
    MIN: 0,
    MAX: 2
  },
  EVENTS: {
    COUNT: 4
  }
};

const getEventData = () => {
  const RANDOM_DATE = new Array(2)
    .fill(``)
    .map(() => Date.now() + Math.round(Math.random() * 7 * 24 * 60 * 60 * 1000))
    .sort((a, b) => a - b);
  const [FROM_DATE, TO_DATE] = RANDOM_DATE;

  return ({
    type: eventTypes[Math.floor(Math.random() * 10)],

    city: [`Island`, `Paris`, `Malaga`, `Geneva`, `Ternopil`, `New York`, `Chicago`, `London`][Math.floor(Math.random() * 8)],

    images: new Array(6).fill(``).map(() => `${`http://picsum.photos/300/150?r=${Math.random()}`}`),

    description: getRandomArray(RANDOM_STR.split(`. `), MOCK_DATA_COUNT.DESCRIPTION.MIN, MOCK_DATA_COUNT.DESCRIPTION.MAX).join(`. `),

    eventTime: {
      from: FROM_DATE,
      to: TO_DATE,
      activityTime: TO_DATE - FROM_DATE
    },

    cost: getRandomNum(100, 500),

    currency: `&euro;`,

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
};

const getMenuData = (value) => ({
  name: value,
  isActive: value === `table` ? true : false
});

const getFilterData = (value) => ({
  name: value,
  isChecked: value === `everything` ? true : false
});

const getTripInfoData = (trips) => trips.length > 0
  ? ({
    cities: trips.map(({city}) => city),
    date: {
      start: trips[0].eventTime.from,
      end: trips[trips.length - 1].eventTime.to
    }
  })
  : ({
    cities: [],
    date: {}
  });

const menuValues = [`table`, `stats`];
const filterValues = [`everything`, `future`, `past`];
const eventTypes = [
  {
    value: `taxi`,
    placeholder: `to`
  },
  {
    value: `bus`,
    placeholder: `to`
  },
  {
    value: `train`,
    placeholder: `to`
  },
  {
    value: `ship`,
    placeholder: `to`
  },
  {
    value: `transport`,
    placeholder: `to`
  },
  {
    value: `drive`,
    placeholder: `to`
  },
  {
    value: `flight`,
    placeholder: `to`
  },
  {
    value: `restaurant`,
    placeholder: `in`
  },
  {
    value: `check-in`,
    placeholder: `in`
  },
  {
    value: `sightseeing`,
    placeholder: `in`
  }
];

export const eventsData = new Array(MOCK_DATA_COUNT.EVENTS.COUNT).fill(``).map(getEventData).sort((a, b) => a.eventTime.from - b.eventTime.from);
export const menuData = menuValues.map(getMenuData);
export const filtersData = filterValues.map(getFilterData);
export const tripInfoData = getTripInfoData(eventsData);
