import Sort from './sort.js';
import TripContent from './trip-content.js';
import TripItemContent from './trip-item-content.js';
import TripDayInfo from './trip-day-info.js';
import EventsList from './events-list.js';
import NoPoints from './no-points.js';
import PointController from './point-controller.js';

import moment from 'moment';
import {renderElement, unrenderElement, getDateDiff} from '../utils.js';

class TripController {
  constructor(container, trips) {
    this._container = container;
    this._trips = trips.slice().sort((a, b) => getDateDiff(a.eventTime.from, b.eventTime.from));
    this._sort = new Sort();
    this._tripContent = new TripContent();
    this._noPoints = new NoPoints();

    this._sortedTrips = this._trips;

    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);

    this._sortEventsByTime = (a, b) => b.eventTime.activityTime - a.eventTime.activityTime;
    this._sortEventsByPrice = (a, b) => b.cost - a.cost;
  }

  init() {
    if (this._trips.length === 0) {
      renderElement(this._container, this._noPoints.getElement(), `beforeend`);
      return;
    }

    renderElement(this._container, this._sort.getElement(), `beforeend`);
    this._renderEventsByDay();
    this._sort.getElement().addEventListener(`change`, (evt) => this._onSortListClick(evt));
  }

  _renderEvent(eventsContainer, eventData) {
    const pointController = new PointController(eventsContainer, eventData, this._onDataChange, this._onChangeView);
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _onDataChange(newData, oldData) {
    this._trips[this._trips.findIndex((it) => it === oldData)] = newData;
    this._sortedTrips[this._sortedTrips.findIndex((it) => it === oldData)] = newData;
    this._renderBoard();
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _renderBoard() {
    const currentSortValue = Array.from(this._sort.getElement().querySelectorAll(`.trip-sort__input`)).find((sortItem) => sortItem.checked).dataset.sortType;

    switch (currentSortValue) {
      case `time`:
        this._sortEventsByValue(this._sortedTrips, this._sortEventsByTime);
        break;
      case `price`:
        this._sortEventsByValue(this._sortedTrips, this._sortEventsByPrice);
        break;
      case `default`:
        this._clearAllTrips();
        this._renderEventsByDay();
        break;
    }
  }

  _clearAllTrips() {
    unrenderElement(this._tripContent.getElement());
    this._tripContent.removeElement();
  }

  _renderEventsByDay() {
    const fromDates = this._trips.map(({eventTime: {from}}) => from).sort((a, b) => getDateDiff(a, b));
    const formattedDates = fromDates.map((date) => moment(date, `DD/MM/YY HH:mm`).format(`MMM DD`));
    const uniqueFromDates = [...new Set(formattedDates)];

    this._sortedTrips = this._trips;

    renderElement(this._container, this._tripContent.getElement(), `beforeend`);

    uniqueFromDates.forEach((eventDate, i) => {
      const tripItemContent = new TripItemContent();
      const tripDayInfo = new TripDayInfo();
      const eventsList = new EventsList();
      const tripsForOneDay = this._trips.filter(({eventTime: {from}}) => moment(from, `DD/MM/YY HH:mm`).format(`MMM DD`) === eventDate);
      const stringToObjDate = new Date(`${eventDate} ${moment(Date.now()).format(`YYYY`)}`);

      renderElement(this._tripContent.getElement(), tripItemContent.getElement(), `beforeend`);
      renderElement(tripItemContent.getElement(), tripDayInfo.getElement(), `beforeend`);
      renderElement(tripItemContent.getElement(), eventsList.getElement(), `beforeend`);

      tripDayInfo.getElement().querySelector(`.day__counter`).textContent = i + 1;
      tripDayInfo.getElement().querySelector(`.day__date`).textContent = moment(stringToObjDate).format(`MMM DD`);
      tripDayInfo.getElement().querySelector(`.day__date`).value = moment(stringToObjDate).format(`YYYY-MM-DD`);

      tripsForOneDay.forEach((trip) => {
        this._renderEvent(eventsList.getElement(), trip);
      });
    });
  }

  _sortEventsByValue(list, fn) {
    const tripItemContent = new TripItemContent();
    const tripDayInfo = new TripDayInfo();
    const eventsList = new EventsList();
    const sortedTripsList = list.slice().sort(fn);

    this._sortedTrips = sortedTripsList;
    this._clearAllTrips();

    renderElement(this._container, this._tripContent.getElement(), `beforeend`);
    renderElement(this._tripContent.getElement(), tripItemContent.getElement(), `beforeend`);
    renderElement(tripItemContent.getElement(), tripDayInfo.getElement(), `beforeend`);
    renderElement(tripItemContent.getElement(), eventsList.getElement(), `beforeend`);

    tripDayInfo.getElement().querySelector(`.day__counter`).textContent = ``;
    tripDayInfo.getElement().querySelector(`.day__date`).textContent = ``;
    tripDayInfo.getElement().querySelector(`.day__date`).value = ``;

    sortedTripsList.forEach((trip) => {
      this._renderEvent(eventsList.getElement(), trip);
    });
  }

  _onSortListClick(evt) {
    switch (evt.target.dataset.sortType) {
      case `time`:
        this._sortEventsByValue(this._trips, this._sortEventsByTime);
        break;
      case `price`:
        this._sortEventsByValue(this._trips, this._sortEventsByPrice);
        break;
      case `default`:
        this._clearAllTrips();
        this._renderEventsByDay();
        break;
    }
  }
}

export default TripController;
