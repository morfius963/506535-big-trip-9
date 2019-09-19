import Menu from "./js/components/menu.js";
import Filters from "./js/components/filters.js";
import TripInfo from "./js/components/trip-info.js";
import TripController from "./js/controllers/trip-controller.js";
import Statistics from "./js/components/statistics.js";
import LoadingMessage from "./js/components/loading-message.js";
import PageDataController from "./js/controllers/page-data-controller.js";
import API from "./js/api.js";
import {getFullEventPrice, renderElement, getTripInfoData, getMenuData, getFilterData, unrenderElement} from "./js/utils.js";

const MENU_VALUES = [`table`, `stats`];
const FILTER_VALUES = [`everything`, `future`, `past`];

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;

const tripInfoContainer = document.querySelector(`.trip-main__trip-info`);
const menuContainer = document.querySelector(`.trip-main__visually-hidden-menu`);
const filterContainer = document.querySelector(`.trip-main__visually-hidden-filter`);
const eventsContent = document.querySelector(`.trip-events`);
const pageBodyContainer = document.querySelector(`.page-main .page-body__container`);
const fullTripPriceElem = document.querySelector(`.trip-info__cost-value`);
const addNewPointBtn = document.querySelector(`.trip-main__event-add-btn`);

const onDataChange = (actionType, update, onError) => {
  if (actionType === null || update === null) {
    tripController.renderBoard();
    return;
  }

  switch (actionType) {
    case `update`:
      api.updatePoint({
        id: update.id,
        point: update.toRAW()
      })
        .then(() => api.getPoints())
        .then((points) => {
          tripsData = points;
          tripController.show(points);
          pageDataController.updatePage(points);
        })
        .catch(() => {
          onError();
        });
      break;
    case `delete`:
      api.deletePoint({
        id: update.id
      })
        .then(() => api.getPoints())
        .then((points) => {
          tripsData = points;
          tripController.show(points);
          pageDataController.updatePage(points);
        })
        .catch(() => {
          onError();
        });
      break;
    case `create`:
      api.createPoint({
        point: update.toRAW()
      })
        .then(() => api.getPoints())
        .then((points) => {
          tripsData = points;
          tripController.show(points);
          pageDataController.updatePage(points);
        })
        .catch(() => {
          onError();
        });
      break;
    default:
      throw new Error(`Wrong action type`);
  }
};

const setDisabledValue = (elements, value) => {
  elements.forEach((elem) => {
    elem.disabled = value;
  });
};

let tripsData = null;
let tripInfoData = null;
let tripTypesWithOptions = null;
let citiesWithDescription = null;
const menuData = MENU_VALUES.map(getMenuData);
const filtersData = FILTER_VALUES.map(getFilterData);

let tripController = null;
const pageDataController = new PageDataController();
const menu = new Menu(menuData);
const filters = new Filters(filtersData);
const tripInfo = new TripInfo();
const statistics = new Statistics();
const loadingMessage = new LoadingMessage();
const api = new API(END_POINT, AUTHORIZATION);

const promises = [
  () => api.getData({url: `offers`}).then((offers) => {
    tripTypesWithOptions = offers;
  }),

  () => api.getData({url: `destinations`}).then((destinations) => {
    citiesWithDescription = destinations;
  }),

  () => api.getPoints()
    .then((points) => {
      tripsData = points;
      tripInfoData = getTripInfoData(points.slice().sort((a, b) => a - b));
    })
    .then(() => {
      tripInfo.setTripInfoData(tripInfoData);
      tripController = new TripController(eventsContent, tripsData, onDataChange, tripTypesWithOptions, citiesWithDescription);
    })
    .then(() => {
      unrenderElement(loadingMessage.getElement());
      loadingMessage.removeElement();
      tripController.init();
      fullTripPriceElem.textContent = getFullEventPrice(tripsData);
      document.querySelector(`.trip-info__main`).replaceWith(tripInfo.getElement());
    })
];

promises.reduce((acc, promise) => acc.then(promise), Promise.resolve());

renderElement(tripInfoContainer, TripInfo.getMockElement(), `afterbegin`);
renderElement(menuContainer, menu.getElement(), `afterend`);
renderElement(filterContainer, filters.getElement(), `afterend`);
renderElement(pageBodyContainer, statistics.getElement(), `beforeend`);
renderElement(eventsContent, loadingMessage.getElement(), `beforeend`);
statistics.hide();

menu.getElement().addEventListener(`click`, (evt) => {
  evt.preventDefault();
  const target = evt.target;

  if (target.tagName.toLowerCase() !== `a`) {
    return;
  }

  target.classList.add(`trip-tabs__btn--active`);

  if (target.previousElementSibling) {
    target.previousElementSibling.classList.remove(`trip-tabs__btn--active`);
  } else {
    target.nextElementSibling.classList.remove(`trip-tabs__btn--active`);
  }

  switch (target.dataset.switch) {
    case `table`:
      statistics.hide();
      tripController.show(tripsData);
      setDisabledValue(filters.getElement().querySelectorAll(`.trip-filters__filter-input`), false);
      break;
    case `stats`:
      tripController.onChangeView();
      tripController.hide();
      statistics.show(tripsData);
      setDisabledValue(filters.getElement().querySelectorAll(`.trip-filters__filter-input`), true);
      break;
  }
});

addNewPointBtn.addEventListener(`click`, () => {
  menu.getElement().querySelector(`a[data-switch="table"]`).classList.add(`trip-tabs__btn--active`);
  menu.getElement().querySelector(`a[data-switch="stats"]`).classList.remove(`trip-tabs__btn--active`);
  statistics.hide();
  tripController.show(tripsData);
  tripController.createTask();
  setDisabledValue(filters.getElement().querySelectorAll(`.trip-filters__filter-input`), false);
});

const tripFilters = document.querySelector(`.trip-filters`);
tripFilters.addEventListener(`change`, () => {
  tripController.renderBoard();
});
