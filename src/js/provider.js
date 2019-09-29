import ModelPoint from "./model-point.js";
import {objectToArray} from "./utils.js";

class Provider {
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
  }

  getData({url}) {
    if (this._isOnline()) {
      return this._api.getData({url});
    }

    const rawPointsMap = this._store.getAll();
    const rawPoints = objectToArray(rawPointsMap);
    const points = ModelPoint.parsePoints(rawPoints);

    return Promise.resolve(points);
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
      .then((points) => {
        points.map((it) => this._store.setItem({key: it.id, item: it.toRAW()}));
        return points;
      });
    }

    const rawPointsMap = this._store.getAll();
    const rawPoints = objectToArray(rawPointsMap);
    const points = ModelPoint.parsePoints(rawPoints);

    return Promise.resolve(points);
  }

  createPoint({point}) {
    if (this._isOnline()) {
      return this._api.createPoint({point})
      .then((pointItem) => {
        this._store.setItem({key: pointItem.id, item: pointItem.toRAW()});
        return pointItem;
      });
    }

    point.id = this._generateId();

    this._store.setItem({key: point.id, item: point});
    return Promise.resolve(ModelPoint.parsePoint(point));
  }

  updatePoint({id, point}) {
    if (this._isOnline()) {
      return this._api.updatePoint({id, point})
      .then((pointItem) => {
        this._store.setItem({key: pointItem.id, item: pointItem.toRAW()});
        return pointItem;
      });
    }

    const pointItem = point;
    this._store.setItem({key: pointItem.id, item: pointItem});
    return Promise.resolve(ModelPoint.parsePoint(pointItem));
  }

  deletePoint({id}) {
    console.log(window.navigator.onLine);
    if (this._isOnline()) {
      return this._api.deletePoint({id})
      .then(() => {
        this._store.removeItem({key: id});
      });
    }

    this._store.removeItem({key: id});
    return Promise.resolve(true);
  }

  syncPoints() {
    return this._api.syncPoints({points: objectToArray(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}

export default Provider;
