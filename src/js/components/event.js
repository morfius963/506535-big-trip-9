import {makeFirstSymUp, getFormattedTimeDifference} from "../utils.js";
import moment from "moment";
import AbstractComponent from "./abstract-component.js";

class Event extends AbstractComponent {
  constructor({id, type: {value, placeholder}, destination: {name}, eventTime: {from, to}, cost, currency, offers}) {
    super();
    this._id = id;
    this._typeValue = value === `` ? `taxi` : value;
    this._typePlaceholder = placeholder === `` ? `to` : placeholder;
    this._city = name;
    this._eventTimeFrom = moment(from);
    this._eventTimeTo = moment(to);
    this._cost = Number(cost);
    this._currency = currency;
    this._offers = offers;
    this._MAX_OFFERS_COUNT = 3;
  }

  getTemplate() {
    return `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${this._typeValue}.png" alt="Event type icon" id="${this._id}">
        </div>
        <h3 class="event__title">${makeFirstSymUp(this._typeValue)} ${this._typePlaceholder} ${this._city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${this._eventTimeFrom.format(`DD/MM/YY`)}T${this._eventTimeFrom.format(`HH:mm`)}">${this._eventTimeFrom.format(`HH:mm`)}</time>
            &mdash;
            <time class="event__end-time" datetime="${this._eventTimeTo.format(`DD/MM/YY`)}T${this._eventTimeTo.format(`HH:mm`)}">${this._eventTimeTo.format(`HH:mm`)}</time>
          </p>
          <p class="event__duration">${getFormattedTimeDifference(this._eventTimeFrom, this._eventTimeTo)}</p>
        </div>

        <p class="event__price">
          ${this._currency}&nbsp;<span class="event__price-value">${this._cost}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${this._offers.filter(({accepted}) => accepted).map(({title, price}) => `<li class="event__offer">
              <span class="event__offer-title">${title}</span>
              &plus;
              ${this._currency}&nbsp;<span class="event__offer-price">${price}</span>
            </li>`).slice(0, this._MAX_OFFERS_COUNT).join(``)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
  }
}

export default Event;
