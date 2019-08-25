import Menu from './js/components/menu.js';
import Filters from './js/components/filters.js';
import TripInfo from './js/components/trip-info.js';
import TripController from './js/components/trip-controller.js';
import {eventsData} from './js/data.js';
import {menuData} from './js/data.js';
import {filtersData} from './js/data.js';
import {tripInfoData} from './js/data.js';
import {getFullEventPrice} from './js/utils.js';
import {renderElement} from './js/utils.js';

const tripInfoContainer = document.querySelector(`.trip-main__trip-info`);
const menuContainer = document.querySelector(`.trip-main__visually-hidden-menu`);
const filterContainer = document.querySelector(`.trip-main__visually-hidden-filter`);
const eventsContent = document.querySelector(`.trip-events`);

const tripInfo = new TripInfo(tripInfoData);
const menu = new Menu(menuData);
const filters = new Filters(filtersData);
const tripController = new TripController(eventsContent, eventsData);

const renderPage = () => {
  renderElement(tripInfoContainer, tripInfo.getElement(), `afterbegin`);
  renderElement(menuContainer, menu.getElement(), `afterend`);
  renderElement(filterContainer, filters.getElement(), `afterend`);
  tripController.init();
};

renderPage();

const fullTripPriceElem = document.querySelector(`.trip-info__cost-value`);
fullTripPriceElem.textContent = getFullEventPrice(eventsData);
