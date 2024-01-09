import { call, put, takeLatest } from 'redux-saga/effects';


import { REQUEST_CNR_HOTEL } from './constants';
import { recevingCnrHotel} from './actions';
import { fetchEvents } from './api';

export function* getHotelData(action)
{
  try {
    const booking = yield call(fetchEvents, action.cnr, action.last_name, action.endpoint);
    yield put(recevingCnrHotel(booking));
  } catch (error) {
    console.log("Hotel Get Booking Error: " + error);
    // yield put(requestApiFailed(error.error));
  }
}

// Individual exports for testing
export default function* getBookingCnrSaga() {
  yield takeLatest(REQUEST_CNR_HOTEL, getHotelData);
}
