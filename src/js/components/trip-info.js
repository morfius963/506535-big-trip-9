import AbstractComponent from "./abstract-component.js";
import moment from "moment";
import {createElement} from "../utils.js";

class TripInfo extends AbstractComponent {
  constructor() {
    super();
    this._cities = null;
    this._dateStart = null;
    this._dateEnd = null;
    this._BIG_SEPARATOR = ` &mdash; ... &mdash; `;
    this._SMALL_SEPARATOR = ` &mdash; `;
  }

  static getMockElement() {
    return createElement(`<div class="trip-info__main">
      <h1 class="trip-info__title"> &mdash; </h1>
      <p class="trip-info__dates"> &mdash; </p>
    </div>`);
  }

  setTripInfoData({cities, date: {start, end}}) {
    this.removeElement();
    this._cities = cities;
    this._dateStart = moment(start);
    this._dateEnd = moment(end);
  }

  getTemplate() {
    return `<div class="trip-info__main">
      <h1 class="trip-info__title">${this._getCitiesString()}</h1>
      <p class="trip-info__dates">${this._getDatesString()}</p>
    </div>`;
  }

  _getCitiesString() {
    const {_cities: cities} = this;

    if (cities.length > 3) {
      return `${this._cities[0]}${this._BIG_SEPARATOR}${this._cities[this._cities.length - 1]}`;
    }

    if (cities.length > 0) {
      return `${this._cities.join(this._SMALL_SEPARATOR)}`;
    }

    return this._SMALL_SEPARATOR;
  }

  _getDatesString() {
    const {_dateStart: start, _dateEnd: end} = this;

    if (start && end) {
      return `${this._dateStart.format(`DD MMM`)}${this._SMALL_SEPARATOR}${this._dateEnd.format(`DD MMM`)}`;
    }

    return this._SMALL_SEPARATOR;
  }
}

export default TripInfo;
