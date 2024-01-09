import { call, put, takeLatest } from 'redux-saga/effects';


import { REQUEST_API_DATA } from './constants';
import { receiveApiData,requestApiFailed} from './actions';
import { fetchEvents } from './api';

export function* getFlightData(action){
  try {
    const flights = yield call(fetchEvents, action.flights);
    yield put(receiveApiData(flights));
  } catch (error) {
    yield put(requestApiFailed(error.error));
  }
}

// Individual exports for testing
export default function* flightListSaga() {
  yield takeLatest(REQUEST_API_DATA, getFlightData);
}
