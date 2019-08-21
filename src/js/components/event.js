import {makeFirstSymUp} from '../utils.js';
import {createElement} from '../utils.js';
import {removeElem} from '../utils.js';

class Event {
  constructor({type: {value, placeholder}, city, eventTime: {from, to, activityTime}, cost, currency}) {
    this._typeValue = value;
    this._typePlaceholder = placeholder;
    this._city = city;
    this._eventTimeFrom = from;
    this._eventTimeTo = to;
    this._activityTime = activityTime;
    this._cost = cost;
    this._currency = currency;
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

  getTemplate() {
    return `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${this._typeValue}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${makeFirstSymUp(this._typeValue)} ${this._typePlaceholder} ${this._city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${this._eventTimeFrom.date}T${this._eventTimeFrom.time}">${this._eventTimeFrom.time}</time>
            &mdash;
            <time class="event__end-time" datetime="${this._eventTimeTo.date}T${this._eventTimeTo.time}">${this._eventTimeTo.time}</time>
          </p>
          <p class="event__duration">${this._activityTime}</p>
        </div>

        <p class="event__price">
          ${this._currency}&nbsp;<span class="event__price-value">${this._cost}</span>
        </p>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
  }
}

export default Event;
