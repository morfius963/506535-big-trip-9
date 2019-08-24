import {eventTypes} from '../data.js';
import {makeFirstSymUp} from '../utils.js';
import {formattedDate} from '../utils.js';
import AbstractComponent from './abstract-component.js';

class EditEvent extends AbstractComponent {
  constructor({type: {value, placeholder}, city, eventTime: {from, to}, cost, currency, offers, description, images}) {
    super();
    this._typeValue = value;
    this._typePlaceholder = placeholder;
    this._city = city;
    this._eventTimeFrom = from;
    this._eventTimeTo = to;
    this._cost = cost;
    this._currency = currency;
    this._offers = offers;
    this._description = description;
    this._images = images;
  }

  getTemplate() {
    return `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._typeValue}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>

                ${eventTypes.filter((it) => it.group === `transfer`).map((type) => `<div class="event__type-item">
                  <input id="event-type-${type.value}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.value}">
                  <label class="event__type-label  event__type-label--${type.value}" for="event-type-${type.value}-1">${makeFirstSymUp(type.value)}</label>
                </div>`).join(``)}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>

                ${eventTypes.filter((it) => it.group === `activity`).map((type) => `<div class="event__type-item">
                  <input id="event-type-${type.value}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.value}">
                  <label class="event__type-label  event__type-label--${type.value}" for="event-type-${type.value}-1">${makeFirstSymUp(type.value)}</label>
                </div>`).join(``)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${makeFirstSymUp(this._typeValue)} ${this._typePlaceholder}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formattedDate(this._eventTimeFrom, `date`)} ${formattedDate(this._eventTimeFrom, `time`)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formattedDate(this._eventTimeTo, `date`)} ${formattedDate(this._eventTimeTo, `time`)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              ${this._currency}
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._cost}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">

          <section class="event__section  event__section--offers ${this._offers.length > 0 ? `` : `visually-hidden`}">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${this._offers.map(({name, id, price, isChecked}) => `<div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-1" type="checkbox" name="event-offer-${id}" ${isChecked ? `checked` : ``}>
                <label class="event__offer-label" for="event-offer-${id}-1">
                  <span class="event__offer-title">${name}</span>
                  &plus;
                  &euro;&nbsp;<span class="event__offer-price">${price}</span>
                </label>
              </div>`).join(``)}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${this._description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${this._images.map((img) => `<img class="event__photo" src="${img}" alt="Event photo">`).join(``)}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`;
  }
}

export default EditEvent;
