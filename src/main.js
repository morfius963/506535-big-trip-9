import {makeMenuTemplate} from './js/components/menu.js';
import {makeFilterTemplate} from './js/components/filters.js';
import {makeEventItemTemplate} from './js/components/event.js';
import {makeEditEventTemplate} from './js/components/edit-event.js';
import {makeTripInfoTemplate} from './js/components/trip-info.js';
import {makeTripContentTemplate} from './js/components/trip-content.js';
import {makeSortListTemplate} from './js/components/sort-list.js';

const EVENTS_COUNT = 3;

const renderComponent = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripInfoContainer = document.querySelector(`.trip-main__trip-info`);
const menuContainer = document.querySelector(`.trip-main__visually-hidden-menu`);
const filterContainer = document.querySelector(`.trip-main__visually-hidden-filter`);
const eventsContainer = document.querySelector(`.trip-events`);

const renderMockComponents = () => {
  renderComponent(tripInfoContainer, makeTripInfoTemplate(), `afterbegin`);
  renderComponent(menuContainer, makeMenuTemplate(), `afterend`);
  renderComponent(filterContainer, makeFilterTemplate(), `afterend`);
  renderComponent(eventsContainer, makeSortListTemplate(), `beforeend`);
  renderComponent(eventsContainer, makeTripContentTemplate(), `beforeend`);

  const tripEventsContent = document.querySelector(`.trip-days`);

  renderComponent(tripEventsContent, makeEditEventTemplate(), `beforeend`);

  for (let i = 1; i <= EVENTS_COUNT; i++) {
    renderComponent(tripEventsContent, makeEventItemTemplate(), `beforeend`);
  }
};

renderMockComponents();
