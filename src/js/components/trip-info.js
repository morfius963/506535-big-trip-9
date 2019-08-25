import {formattedDate} from '../utils.js';
import AbstractComponent from "./abstract-component.js";

class TripInfo extends AbstractComponent {
  constructor({cities, date: {start, end}}) {
    super();
    this._cities = cities;
    this._dateStart = start;
    this._dateEnd = end;
    this._BIG_SEPARATOR = ` &mdash; ... &mdash; `;
    this._SMALL_SEPARATOR = ` &mdash; `;
  }

  getCitiesString() {
    const {_cities: cities} = this;

    if (cities.length > 3) {
      return `${this._cities[0]}${this._BIG_SEPARATOR}${this._cities[this._cities.length - 1]}`;
    }

    if (cities.length > 0) {
      return `${this._cities.join(this._SMALL_SEPARATOR)}`;
    }

    return this._SMALL_SEPARATOR;
  }

  getDatesString() {
    const {_dateStart: start, _dateEnd: end} = this;

    if (start && end) {
      return `${formattedDate(this._dateStart, `date`)}${this._SMALL_SEPARATOR}${formattedDate(this._dateEnd, `date`)}`;
    }

    return this._SMALL_SEPARATOR;
  }

  getTemplate() {
    return `<div class="trip-info__main">
      <h1 class="trip-info__title">${this.getCitiesString()}</h1>
      <p class="trip-info__dates">${this.getDatesString()}</p>
    </div>`;
  }
}

export default TripInfo;
