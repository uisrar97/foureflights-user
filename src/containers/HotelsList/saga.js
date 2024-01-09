import { call, put, takeLatest } from 'redux-saga/effects';

import { REQUEST_HOTELS_LIST, REQUEST_AREA_LIST } from './constants';
import { receiveHotelsList, receiveAreaList } from './actions';
import { fetchEvents } from './api';

export function* getHotelsList(action) {
  try {
    const hotelListReq = yield call(fetchEvents, action.api);
    // const hotelListReq = yield call(fetchEvents, action.sector, action.checkin, action.checkout, action.api);
    yield put(receiveHotelsList(hotelListReq));
  } catch (error) {
    console.log("Hotel List Error: " + error);
    // yield put(requestApiFailed(error.error));
  }
}
export function* getAreasList(action) {
  try {
    const areaListReq = yield call(fetchEvents, action.api);
    // const hotelListReq = yield call(fetchEvents, action.sector, action.checkin, action.checkout, action.api);
    yield put(receiveAreaList(areaListReq));
  } catch (error) {
    console.log("Area List Error: " + error);
    // yield put(requestApiFailed(error.error));
  }
}

// Individual exports for testing
export default function* hotelsListSaga() {
  yield takeLatest(REQUEST_HOTELS_LIST, getHotelsList);
  yield takeLatest(REQUEST_AREA_LIST, getAreasList);
  // See example in containers/HomePage/saga.js
}
