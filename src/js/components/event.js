import {makeFirstSymUp} from '../utils.js';
import {formattedDate} from '../utils.js';
import {formattedTimeDifference} from '../utils.js';
import AbstractComponent from './abstract-component.js';

class Event extends AbstractComponent {
  constructor({type: {value, placeholder}, city, eventTime: {from, to, activityTime}, cost, currency, offers}) {
    super();
    this._typeValue = value;
    this._typePlaceholder = placeholder;
    this._city = city;
    this._eventTimeFrom = from;
    this._eventTimeTo = to;
    this._activityTime = activityTime;
    this._cost = cost;
    this._currency = currency;
    this._offers = offers;
    this._MAX_OFFERS_COUNT = 3;
  }

  getTemplate() {
    return `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${this._typeValue}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${makeFirstSymUp(this._typeValue)} ${this._typePlaceholder} ${this._city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formattedDate(this._eventTimeFrom, `date`)}T${formattedDate(this._eventTimeFrom, `time`)}">${formattedDate(this._eventTimeFrom, `time`)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formattedDate(this._eventTimeTo, `date`)}T${formattedDate(this._eventTimeTo, `time`)}">${formattedDate(this._eventTimeTo, `time`)}</time>
          </p>
          <p class="event__duration">${formattedTimeDifference(this._activityTime)}</p>
        </div>

        <p class="event__price">
          ${this._currency}&nbsp;<span class="event__price-value">${this._cost}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${this._offers.slice(0, this._MAX_OFFERS_COUNT).filter(({isChecked}) => isChecked).map(({name, price}) => `<li class="event__offer">
              <span class="event__offer-title">${name}</span>
              &plus;
              ${this._currency}&nbsp;<span class="event__offer-price">${price}</span>
            </li>`).join(``)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
  }
}

export default Event;
