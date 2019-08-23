import {createElement} from '../utils.js';
import {removeElem} from '../utils.js';

const BIG_SEPARATOR = ` &mdash; ... &mdash; `;
const SMALL_SEPARATOR = ` &mdash; `;

class TripInfo {
  constructor({cities, date: {start, end}}) {
    this._cities = cities;
    this._dateStart = start;
    this._dateEnd = end;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    removeElem(this._element);
    this._element = null;
  }

  getCitiesString() {
    const {_cities: cities} = this;

    if (cities.length > 3) {
      return `${this._cities[0]}${BIG_SEPARATOR}${this._cities[this._cities.length - 1]}`;
    }

    if (cities.length > 0) {
      return `${this._cities.join(SMALL_SEPARATOR)}`;
    }

    return SMALL_SEPARATOR;
  }

  getDatesString() {
    const {_dateStart: start, _dateEnd: end} = this;

    if (start && end) {
      return `${this._dateStart}${SMALL_SEPARATOR}${this._dateEnd}`;
    }

    return SMALL_SEPARATOR;
  }

  getTemplate() {
    return `<div class="trip-info__main">
      <h1 class="trip-info__title">${this.getCitiesString()}</h1>
      <p class="trip-info__dates">${this.getDatesString()}</p>
    </div>`;
  }
}

export default TripInfo;
