import Event from './event.js';
import EditEvent from './edit-event.js';
import moment from 'moment';
import {renderElement} from '../utils.js';
import {tripTypesWithOptions, citiesWithDescription} from '../data.js';

class PointController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._event = new Event(data);
    this._editEvent = new EditEvent(data, tripTypesWithOptions, citiesWithDescription);

    this.init();
  }

  init() {
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._container.replaceChild(this._event.getElement(), this._editEvent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._event.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onChangeView();

        this._container.replaceChild(this._editEvent.getElement(), this._event.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._editEvent.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      this._container.replaceChild(this._event.getElement(), this._editEvent.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    this._editEvent.getElement()
      .querySelector(`.event--edit`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();

        const entry = this._buildNewData();
        this._onDataChange(entry, this._data);

        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    renderElement(this._container, this._event.getElement(), `beforeend`);
  }

  _buildNewData() {
    const formData = new FormData(this._editEvent.getElement().querySelector(`.event--edit`));
    const checkedType = Array.from(this._editEvent.getElement().querySelectorAll(`.event__type-input`)).find((evtType) => evtType.checked);
    const pointImages = Array.from(this._editEvent.getElement().querySelectorAll(`.event__photo`)).map((img) => img.src);
    const pointDescription = this._editEvent.getElement().querySelector(`.event__destination-description`).textContent;

    const timeFrom = formData.get(`event-start-time`);
    const timeTo = formData.get(`event-end-time`);
    const timeDiff = moment(timeTo, `DD/MM/YY HH:mm`).diff(moment(timeFrom, `DD/MM/YY HH:mm`));
    const activityTime = moment.duration(timeDiff).valueOf();

    const pointOffers = Array.from(this._editEvent.getElement().querySelectorAll(`.event__offer-selector`)).map((offer) => {
      return ({
        name: offer.querySelector(`.event__offer-title`).textContent,
        id: offer.querySelector(`.event__offer-checkbox`).name,
        price: offer.querySelector(`.event__offer-price`).textContent,
        isChecked: offer.querySelector(`.event__offer-checkbox`).checked
      });
    });

    const entry = {
      type: {
        value: formData.get(`event-type`),
        placeholder: checkedType.dataset.placeholder
      },
      city: formData.get(`event-destination`),
      images: pointImages,
      description: pointDescription,
      eventTime: {
        from: timeFrom,
        to: timeTo,
        activityTime
      },
      cost: formData.get(`event-price`),
      isFavorite: Boolean(formData.get(`event-favorite`)),
      currency: `&euro;`,
      offers: pointOffers
    };

    return entry;
  }

  setDefaultView() {
    if (this._container.contains(this._editEvent.getElement())) {
      this._container.replaceChild(this._event.getElement(), this._editEvent.getElement());
    }
  }
}

export default PointController;
