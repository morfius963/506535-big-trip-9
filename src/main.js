import {makeMenuTemplate} from './js/components/menu.js';
import {makeFilterTemplate} from './js/components/filters.js';
import {makeEventItemTemplate} from './js/components/event.js';
import {makeEditEventTemplate} from './js/components/edit-event.js';
import {makeTripInfoTemplate} from './js/components/trip-info.js';
import {makeTripContentTemplate} from './js/components/trip-content.js';
import {makeSortListTemplate} from './js/components/sort-list.js';
import {makeDayContentTemplate} from './js/components/main-content.js';
import {events} from './js/data.js';
import {menuData} from './js/data.js';
import {filters} from './js/data.js';
import {tripInfo} from './js/data.js';
import {getFullEventPrice} from './js/utils.js';

const renderComponent = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripInfoContainer = document.querySelector(`.trip-main__trip-info`);
const menuContainer = document.querySelector(`.trip-main__visually-hidden-menu`);
const filterContainer = document.querySelector(`.trip-main__visually-hidden-filter`);
const eventsContainer = document.querySelector(`.trip-events`);

const renderMockComponents = () => {
  renderComponent(tripInfoContainer, makeTripInfoTemplate(tripInfo), `afterbegin`);
  renderComponent(menuContainer, makeMenuTemplate(menuData), `afterend`);
  renderComponent(filterContainer, makeFilterTemplate(filters), `afterend`);
  renderComponent(eventsContainer, makeSortListTemplate(), `beforeend`);
  renderComponent(eventsContainer, makeTripContentTemplate(), `beforeend`);

  const tripEventsContent = document.querySelector(`.trip-days`);
  renderComponent(tripEventsContent, makeDayContentTemplate(), `beforeend`);

  const tripEventsList = tripEventsContent.querySelector(`.trip-events__list`);
  renderComponent(tripEventsList, makeEditEventTemplate(events[0]), `beforeend`);

  for (let i = 1; i <= events.length - 1; i++) {
    renderComponent(tripEventsList, makeEventItemTemplate(events[i]), `beforeend`);
  }
};

renderMockComponents();

const fullTripPriceElem = document.querySelector(`.trip-info__cost-value`);
fullTripPriceElem.textContent = getFullEventPrice(events);
