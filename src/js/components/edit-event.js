import {makeFirstSymUp} from "../utils.js";
import AbstractComponent from "./abstract-component.js";

class EditEvent extends AbstractComponent {
  constructor({type: {value, placeholder}, city, eventTime: {from, to}, cost, currency, isFavorite, offers, description, images}, tripTypes, cities) {
    super();
    this._typeValue = value === `` ? `taxi` : value;
    this._typePlaceholder = placeholder === `` ? `to` : placeholder;
    this._city = city;
    this._eventTimeFrom = from;
    this._eventTimeTo = to;
    this._cost = Number(cost);
    this._currency = currency;
    this._isFavorite = isFavorite;
    this._offers = offers;
    this._description = description;
    this._images = images;
    this._cities = cities;
    this._tripTypes = tripTypes;

    this._setCurrentTypeChecked();
    this._changeOptionsByType();
    this._changeDescByCity();
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

                <div class="event__type-item">
                  <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" data-placeholder="to">
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" data-placeholder="to" checked>
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" data-placeholder="to">
                  <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" data-placeholder="to">
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport" data-placeholder="to">
                  <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" data-placeholder="to">
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" data-placeholder="to">
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                </div>
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>

                <div class="event__type-item">
                  <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" data-placeholder="in">
                  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" data-placeholder="in">
                  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" data-placeholder="in">
                  <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${makeFirstSymUp(this._typeValue)} ${this._typePlaceholder}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${this._cities.map(({city}) => `<option value="${city}"></option>`).join(``)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${this._eventTimeFrom.format(`DD/MM/YY`)} ${this._eventTimeFrom.format(`HH:mm`)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${this._eventTimeTo.format(`DD/MM/YY`)} ${this._eventTimeTo.format(`HH:mm`)}">
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

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
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
                <input class="event__offer-checkbox  visually-hidden" id="${id}-1" type="checkbox" name="${id}" ${isChecked ? `checked` : ``}>
                <label class="event__offer-label" for="${id}-1">
                  <span class="event__offer-title">${name}</span>
                  &plus;
                  &euro;&nbsp;<span class="event__offer-price">${price}</span>
                </label>
              </div>`).join(``)}
            </div>
          </section>

          <section class="event__section  event__section--destination ${this._isDestination() ? `` : `visually-hidden`}">
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

  resetForm() {
    this.getElement().querySelector(`.event--edit`).reset();
    this.getElement().querySelector(`.event__type-icon`).src = `img/icons/${this._typeValue}.png`;
    this.getElement().querySelector(`.event__type-output`).textContent = `${makeFirstSymUp(this._typeValue)} ${this._typePlaceholder}`;
    this.getElement().querySelector(`.event__destination-description`).textContent = `${this._description}`;
    this.getElement().querySelector(`.event__favorite-checkbox`).checked = this._isFavorite;
    this._setCurrentTypeChecked();

    if (this._offers.length > 0) {
      this.getElement().querySelector(`.event__section--offers`).classList.remove(`visually-hidden`);
      this.getElement().querySelector(`.event__available-offers`).innerHTML = ``;
      this.getElement().querySelector(`.event__available-offers`).insertAdjacentHTML(`beforeend`, `${this._offers.map(({name, id, price, isChecked}) => `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${id}-1" type="checkbox" name="${id}" ${isChecked ? `checked` : ``}>
        <label class="event__offer-label" for="${id}-1">
          <span class="event__offer-title">${name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`).join(``)}`);
    } else if (!this.getElement().querySelector(`.event__section--offers`).classList.contains(`visually-hidden`)) {
      this.getElement().querySelector(`.event__section--offers`).classList.add(`visually-hidden`);
    }
  }

  _isDestination() {
    return !!this._city;
  }

  _setCurrentTypeChecked() {
    const foundElement = Array.from(this.getElement().querySelectorAll(`input[name="event-type"]`)).find((eventType) => eventType.value === this._typeValue);

    if (foundElement) {
      foundElement.checked = true;
    }
  }

  _changeOptionsByType() {
    this.getElement()
      .querySelectorAll(`.event__type-input`)
      .forEach((typeItem) => {
        typeItem.addEventListener(`click`, (evt) => {
          const target = evt.currentTarget;
          const typeData = this._tripTypes.find(({type}) => type.value === target.value);

          if (typeData.options.length === 0) {
            this.getElement().querySelector(`.event__section--offers`).classList.add(`visually-hidden`);
          } else {
            this.getElement().querySelector(`.event__section--offers`).classList.remove(`visually-hidden`);
          }

          this.getElement().querySelector(`.event__type-icon`).src = `img/icons/${typeData.type.value}.png`;
          this.getElement().querySelector(`.event__type-output`).textContent = `${makeFirstSymUp(typeData.type.value)} ${typeData.type.placeholder}`;
          this.getElement().querySelector(`.event__type-toggle`).checked = false;

          this.getElement().querySelector(`.event__available-offers`).innerHTML = ``;
          this.getElement().querySelector(`.event__available-offers`).insertAdjacentHTML(`beforeend`,
              `${typeData.options.map(({name, id, price, isChecked}) => `<div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="${id}-1" type="checkbox" name="${id}" ${isChecked ? `checked` : ``}>
                <label class="event__offer-label" for="${id}-1">
                  <span class="event__offer-title">${name}</span>
                  &plus;
                  &euro;&nbsp;<span class="event__offer-price">${price}</span>
                </label>
              </div>`).join(``)}`);
        });
      });
  }

  _changeDescByCity() {
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        const target = evt.currentTarget;
        const cityData = this._cities.find(({city}) => city === target.value);

        if (cityData) {
          this.getElement().querySelector(`.event__destination-description`).textContent = cityData.description;
          this.getElement().querySelector(`.event__section--destination`).classList.remove(`visually-hidden`);
        } else {
          this.getElement().querySelector(`.event__destination-description`).textContent = ``;
          this.getElement().querySelector(`.event__section--destination`).classList.add(`visually-hidden`);
        }
      });
  }
}

export default EditEvent;
