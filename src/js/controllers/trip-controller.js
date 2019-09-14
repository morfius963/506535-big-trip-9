import Sort from "../components/sort.js";
import TripContent from "../components/trip-content.js";
import TripItemContent from "../components/trip-item-content.js";
import TripDayInfo from "../components/trip-day-info.js";
import EventsList from "../components/events-list.js";
import NoPoints from "../components/no-points.js";
import PointController, {Mode as PointControllerMode} from "./point-controller.js";
import moment from "moment";
import {renderElement, unrenderElement} from "../utils.js";

class TripController {
  constructor(container, trips, onDataChange, types, destinations) {
    this._container = container;
    this._trips = this._sortByDefault(trips);
    this._onDataChangeMain = onDataChange;
    this._tripTypes = types;
    this._destinations = destinations;

    this._filteredTrips = trips;

    this._sort = new Sort();
    this._tripContent = new TripContent();
    this._noPoints = new NoPoints();

    this._subscriptions = [];
    this._creatingPoint = null;

    this._onDataChange = this._onDataChange.bind(this);
    this.onChangeView = this.onChangeView.bind(this);

    this._sortEventsByTime = (a, b) => {
      const aTime = a.eventTime.to - a.eventTime.from;
      const bTime = b.eventTime.to - b.eventTime.from;

      return bTime - aTime;
    };
    this._sortEventsByPrice = (a, b) => b.cost - a.cost;
  }

  init() {
    this._container.innerHTML = ``;

    if (this._trips.length === 0) {
      renderElement(this._container, this._noPoints.getElement(), `beforeend`);

      return;
    }

    renderElement(this._container, this._sort.getElement(), `beforeend`);
    this._sort.getElement().addEventListener(`change`, (evt) => this._onSortListClick(evt));
    this.renderBoard();
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  show(trips) {
    if (trips !== this._trips) {
      this._setTrips(this._sortByDefault(trips));
    }

    this._container.classList.remove(`visually-hidden`);
  }

  renderBoard() {
    if (this._trips.length === 0) {
      this._container.innerHTML = ``;
      renderElement(this._container, this._noPoints.getElement(), `beforeend`);
      return;
    }

    const currentSortValue = Array.from(this._sort.getElement().querySelectorAll(`.trip-sort__input`)).find((sortItem) => sortItem.checked).dataset.sortType;
    this._filteredTrips = this._getFilteredTrips(this._trips);

    this._clearAllTrips();
    this._subscriptions.length = 0;
    renderElement(this._container, this._sort.getElement(), `beforeend`);

    switch (currentSortValue) {
      case `time`:
        this._renderBySortValue(this._filteredTrips, this._sortEventsByTime);
        break;
      case `price`:
        this._renderBySortValue(this._filteredTrips, this._sortEventsByPrice);
        break;
      case `default`:
        this._renderByDays(this._filteredTrips);
        break;
      default:
        this._renderByDays(this._filteredTrips);
    }
  }

  createTask() {
    let newPointContainer = this._container.querySelector(`.trip-events__list`);

    if (!newPointContainer) {
      this._createNewDay();
      newPointContainer = this._container.querySelector(`.trip-events__list`);
    }

    if (this._creatingPoint) {
      return;
    }

    const defaultPoint = {
      type: {
        value: ``,
        placeholder: ``
      },
      destination: {
        name: ``,
        pictures: [],
        description: ``
      },
      eventTime: {
        from: Date.now(),
        to: Date.now()
      },
      cost: 0,
      currency: `&euro;`,
      isFavorite: false,
      offers: []
    };

    this.onChangeView();
    this._creatingPoint = new PointController(newPointContainer, defaultPoint, PointControllerMode.ADDING, this.onChangeView, (...args) => {
      this._creatingPoint = null;
      this._onDataChange(...args);
    }, this._tripTypes, this._destinations);
  }

  onChangeView() {
    const allPoints = this._container.querySelectorAll(`.trip-events__item`);

    this._subscriptions.forEach((subscription) => subscription());

    if (allPoints.length > this._trips.length) {
      unrenderElement(allPoints[0]);
      this._creatingPoint = null;
    }
  }

  _onDataChange(actionType, update) {
    this._creatingPoint = null;
    this._onDataChangeMain(actionType, update);
  }

  _setTrips(trips) {
    this._trips = trips;
    this.renderBoard();
  }

  _createNewDay() {
    this._tripContent = new TripContent();
    const mainContainer = document.querySelector(`.trip-events`);
    const tripItemContent = new TripItemContent();
    const tripDayInfo = new TripDayInfo();
    const eventsList = new EventsList();

    mainContainer.innerHTML = ``;
    renderElement(mainContainer, this._tripContent.getElement(), `beforeend`);
    renderElement(this._tripContent.getElement(), tripItemContent.getElement(), `beforeend`);
    renderElement(tripItemContent.getElement(), tripDayInfo.getElement(), `beforeend`);
    renderElement(tripItemContent.getElement(), eventsList.getElement(), `beforeend`);
  }

  _renderEvent(eventsContainer, eventData) {
    const pointController = new PointController(eventsContainer, eventData, PointControllerMode.DEFAULT, this.onChangeView, this._onDataChange, this._tripTypes, this._destinations);
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _clearAllTrips() {
    unrenderElement(this._tripContent.getElement());
    this._tripContent.removeElement();
  }

  _renderByDays(trips) {
    const sortedFromDates = trips.map(({eventTime: {from}}) => from).sort((a, b) => a - b);
    const formattedDates = sortedFromDates.map((date) => moment(date).format(`MMM DD`));
    const uniqueFormattedDates = [...new Set(formattedDates)];

    renderElement(this._container, this._tripContent.getElement(), `beforeend`);

    uniqueFormattedDates.forEach((eventDate, i) => {
      const tripItemContent = new TripItemContent();
      const tripDayInfo = new TripDayInfo();
      const eventsList = new EventsList();
      const tripsForOneDay = trips.filter(({eventTime: {from}}) => moment(from).format(`MMM DD`) === eventDate);
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

  _renderBySortValue(list, fn) {
    const tripItemContent = new TripItemContent();
    const tripDayInfo = new TripDayInfo();
    const eventsList = new EventsList();
    const sortedTripsList = list.slice().sort(fn);

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
    this._clearAllTrips();

    switch (evt.target.dataset.sortType) {
      case `time`:
        this._renderBySortValue(this._filteredTrips, this._sortEventsByTime);
        break;
      case `price`:
        this._renderBySortValue(this._filteredTrips, this._sortEventsByPrice);
        break;
      case `default`:
        this._renderByDays(this._filteredTrips);
        break;
      default:
        this._renderByDays(this._filteredTrips);
    }
  }

  _sortByDefault(trips) {
    return trips.slice().sort((a, b) => a.eventTime.from - b.eventTime.from);
  }

  _getFilteredTrips() {
    let tripsData = this._trips;
    const currentFilterValue = Array.from(document.querySelectorAll(`.trip-filters__filter-input`)).find((input) => input.checked).value;
    const tripsEverything = this._trips;
    const tripsFuture = tripsData.filter((trip) => moment(trip.eventTime.from).isAfter(new Date(Date.now())));
    const tripsPast = tripsData.filter((trip) => moment(trip.eventTime.to).isBefore(new Date(Date.now())));

    this._isFoundedTrips([`future`, `past`], tripsFuture, tripsPast);

    switch (currentFilterValue) {
      case `everything`:
        tripsData = tripsEverything;
        break;
      case `future`:
        tripsData = tripsFuture;
        break;
      case `past`:
        tripsData = tripsPast;
        break;
      default:
        tripsData = tripsEverything;
    }

    return tripsData;
  }

  _isFoundedTrips(filterNames, ...trips) {
    trips.forEach((trip, i) => {
      const filterElem = document.querySelector(`#filter-${filterNames[i]}`);

      if (trip.length === 0) {
        filterElem.disabled = true;
      } else {
        filterElem.disabled = false;
      }
    });
  }
}

export default TripController;
