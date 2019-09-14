import Event from "../components/event.js";
import EditEvent from "../components/edit-event.js";
import {renderElement, unrenderElement} from "../utils.js";
import moment from "moment";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

class PointController {
  constructor(container, data, mode, onChangeView, onDataChange, types, destinations) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._event = new Event(data);
    this._editEvent = new EditEvent(data, types, destinations);

    this.init(mode);
  }

  init(mode) {
    let renderPosition = `beforeend`;
    let currentView = this._event;

    if (mode === Mode.ADDING) {
      renderPosition = `afterbegin`;
      currentView = this._editEvent;
      this._editEvent.getElement().querySelector(`.event__reset-btn`).textContent = `Cancel`;
    }

    flatpickr(this._editEvent.getElement().querySelector(`#event-start-time-1`), {
      allowInput: false,
      defaultDate: moment(this._data.eventTime.from).format(`DD/MM/YY HH:mm`),
      dateFormat: `d/m/y H:i`,
      enableTime: true,
      onChange(selectedDates) {
        if (moment(selectedDates[0]).valueOf() > moment(document.querySelector(`#event-end-time-1`).value, `DD/MM/YY HH:mm`).valueOf()) {
          document.querySelector(`#event-end-time-1`).value = moment(selectedDates[0]).format(`DD/MM/YY HH:mm`);
        }
      }
    });

    flatpickr(this._editEvent.getElement().querySelector(`#event-end-time-1`), {
      allowInput: false,
      defaultDate: moment(this._data.eventTime.to).format(`DD/MM/YY HH:mm`),
      dateFormat: `d/m/y H:i`,
      enableTime: true,
      onChange(selectedDates) {
        if (moment(selectedDates[0]).valueOf() < moment(document.querySelector(`#event-start-time-1`).value, `DD/MM/YY HH:mm`).valueOf()) {
          document.querySelector(`#event-start-time-1`).value = moment(selectedDates[0]).format(`DD/MM/YY HH:mm`);
        }
      }
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
        this._onDataChange(mode === Mode.DEFAULT ? `update` : `create`, entry);

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
          this._onDataChange(`delete`, this._data);
        }
      });

    renderElement(this._container, currentView.getElement(), renderPosition);
  }

  _buildNewData() {
    const pointId = this._editEvent.getElement().id;
    const formData = new FormData(this._editEvent.getElement().querySelector(`.event--edit`));
    const checkedType = Array.from(this._editEvent.getElement().querySelectorAll(`.event__type-input`)).find((evtType) => evtType.checked);
    const pointImages = Array.from(this._editEvent.getElement().querySelectorAll(`.event__photo`)).map((img) => ({
      src: img.src,
      description: img.alt
    }));
    const pointDescription = this._editEvent.getElement().querySelector(`.event__destination-description`).textContent;

    const timeFrom = moment(formData.get(`event-start-time`), `DD/MM/YY HH:mm`).valueOf();
    const timeTo = moment(formData.get(`event-end-time`), `DD/MM/YY HH:mm`).valueOf();

    const pointOffers = Array.from(this._editEvent.getElement().querySelectorAll(`.event__offer-selector`)).map((offer) => {
      return ({
        title: offer.querySelector(`.event__offer-title`).textContent,
        price: Number(offer.querySelector(`.event__offer-price`).textContent),
        accepted: offer.querySelector(`.event__offer-checkbox`).checked
      });
    });

    const entry = {
      id: pointId,
      type: {
        value: formData.get(`event-type`),
        placeholder: checkedType.dataset.placeholder
      },
      destination: {
        name: formData.get(`event-destination`),
        description: pointDescription,
        pictures: pointImages,
      },
      eventTime: {
        from: timeFrom,
        to: timeTo
      },
      cost: Number(formData.get(`event-price`)),
      isFavorite: Boolean(formData.get(`event-favorite`)),
      currency: `&euro;`,
      offers: pointOffers,
      toRAW() {
        return {
          'id': this.id,
          'type': this.type.value,
          'destination': this.destination,
          'date_from': this.eventTime.from,
          'date_to': this.eventTime.to,
          'base_price': this.cost,
          'is_favorite': this.isFavorite,
          'offers': this.offers
        };
      }
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
