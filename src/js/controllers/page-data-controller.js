import {renderElement, getFullEventPrice, getTripInfoData} from "../utils";
import TripInfo from "../components/trip-info.js";

class PageDataController {
  constructor() {
    this._newTripinfo = new TripInfo();
    this._tripInfoParent = document.querySelector(`.trip-main__trip-info`);
    this._fullTripPriceElem = document.querySelector(`.trip-info__cost-value`);
  }

  updatePage(points) {
    const tripInfoContainer = document.querySelector(`.trip-info__main`);
    const sortedPoints = points.slice().sort((a, b) => a.eventTime.from - b.eventTime.from);
    const newTripInfoData = getTripInfoData(sortedPoints);

    this._newTripinfo.setTripInfoData(newTripInfoData);
    this._tripInfoParent.removeChild(tripInfoContainer);
    renderElement(this._tripInfoParent, this._newTripinfo.getElement(), `afterbegin`);
    this._fullTripPriceElem.textContent = getFullEventPrice(sortedPoints);
  }
}

export default PageDataController;
