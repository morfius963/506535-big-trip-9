import Event from '../components/event.js';
import EditEvent from '../components/edit-event.js';
import moment from 'moment';
import {renderElement, unrenderElement} from '../utils.js';
import {tripTypesWithOptions, citiesWithDescription} from '../data.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

class PointController {
  constructor(container, data, mode, onChangeView, onDataChange) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._event = new Event(data);
    this._editEvent = new EditEvent(data, tripTypesWithOptions, citiesWithDescription);

    this.init(mode);
  }

  init(mode) {
    let renderPosition = `beforeend`;
    let currentView = this._event;

    if (mode === Mode.ADDING) {
      renderPosition = `afterbegin`;
      currentView = this._editEvent;
    }

    flatpickr(this._editEvent.getElement().querySelector(`#event-start-time-1`), {
      altInput: true,
      allowInput: true,
      defaultDate: this._data.eventTime.from.format(`DD/MM/YY HH:mm`),
      altFormat: `d/m/y H:i`,
      dateFormat: `d/m/y H:i`,
      enableTime: true
    });

    flatpickr(this._editEvent.getElement().querySelector(`#event-end-time-1`), {
      altInput: true,
      allowInput: true,
      defaultDate: this._data.eventTime.to.format(`DD/MM/YY HH:mm`),
      altFormat: `d/m/y H:i`,
      dateFormat: `d/m/y H:i`,
      enableTime: true
    });

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        if (this._editEvent.getElement().parentNode === this._container) {
          this._editEvent.resetForm();
          this._container.replaceChild(this._event.getElement(), this._editEvent.getElement());
        }

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
      if (mode === Mode.ADDING) {
        unrenderElement(this._editEvent.getElement());
        this._editEvent.removeElement();
        this._onDataChange(null, null);

      } else if (mode === Mode.DEFAULT) {
        this._editEvent.resetForm();
        this._container.replaceChild(this._event.getElement(), this._editEvent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    });

    this._editEvent.getElement()
      .querySelector(`.event--edit`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();

        const entry = this._buildNewData();
        this._onDataChange(entry, mode === Mode.DEFAULT ? this._data : null);

        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._editEvent.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        if (mode === Mode.ADDING) {
          unrenderElement(this._editEvent.getElement());
          this._editEvent.removeElement();
          this._onDataChange(null, null);
        } else if (mode === Mode.DEFAULT) {
          this._onDataChange(null, this._data);
        }
      });

    renderElement(this._container, currentView.getElement(), renderPosition);
  }

  _buildNewData() {
    const formData = new FormData(this._editEvent.getElement().querySelector(`.event--edit`));
    const checkedType = Array.from(this._editEvent.getElement().querySelectorAll(`.event__type-input`)).find((evtType) => evtType.checked);
    const pointImages = Array.from(this._editEvent.getElement().querySelectorAll(`.event__photo`)).map((img) => img.src);
    const pointDescription = this._editEvent.getElement().querySelector(`.event__destination-description`).textContent;

    const timeFrom = moment(formData.get(`event-start-time`), `DD/MM/YY HH:mm`);
    const timeTo = moment(formData.get(`event-end-time`), `DD/MM/YY HH:mm`);
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
      this._editEvent.resetForm();
    }
  }
}

export default PointController;
