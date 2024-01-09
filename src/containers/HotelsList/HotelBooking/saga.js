import { call, put, takeLatest } from 'redux-saga/effects';

import { submitHotelBookingDetails } from './api';
import { hotelBookingResponse } from './actions';
import { REQUEST_HOTEL_BOOKING } from './constants';


export function* submitHotelBookingData(action)
{
  try
  {
    const response = yield call(submitHotelBookingDetails, action.hotelBookingReq);
      yield put(hotelBookingResponse(response));
  }
  catch (error)
  {
    console.error(error);
  }
}

// Individual exports for testing
export default function* hotelBookingSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(REQUEST_HOTEL_BOOKING, submitHotelBookingData);
}