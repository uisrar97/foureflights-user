import { call, put, takeLatest } from 'redux-saga/effects';


import { REQUEST_PNR_FLIGHT } from './constants';
import { recevingPnrFlight} from './actions';
import { fetchEvents } from './api';

export function* getFlightData(action){
  try {
    const booking = yield call(fetchEvents, action.pnr, action.last_name, action.endpoint);
    yield put(recevingPnrFlight(booking));
  } catch (error) {
    console.log("Flight Get Booking Error: " + error);
    // yield put(requestApiFailed(error.error));
  }
}

// Individual exports for testing
export default function* flightListSaga() {
  yield takeLatest(REQUEST_PNR_FLIGHT, getFlightData);
}
