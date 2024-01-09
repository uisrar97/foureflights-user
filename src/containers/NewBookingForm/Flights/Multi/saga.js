import { call, put, takeLatest } from 'redux-saga/effects';
import { REQUEST_API_DATA, BOOKING_REQUEST, REQUEST_MULTI_PNR_FLIGHT } from './constants';
import { receiveApiData, requestApiFailed, bookingResponse, bookingFailed, recevingMultiPnrFlight } from './actions';
import { fetchEvents, bookMultiFlight, getMultiFlight } from './api';

export function* getFlightData(action)
{
  try
  {
    const flights = yield call(fetchEvents, action.query, action.fields);
    yield put(receiveApiData(flights));
  }
  catch (error)
  {
    yield put(requestApiFailed(error));
  }
}

export function* bookMultiFlightSaga(action)
{
  try
  {
    const booking = yield call(bookMultiFlight, action.bookReq)
    yield put(bookingResponse(booking));
  }
  catch (error)
  {
    yield put(bookingFailed(error));
  }
}

export function* getMultiFlightData(action)
{
  try
  {
    const booking = yield call(getMultiFlight, action.pnr, action.last_name, action.endpoint)
    yield put(recevingMultiPnrFlight(booking));
  }
  catch (error)
  {
    yield put(recevingMultiPnrFlight(error));
  }
}

// Individual exports for testing
export default function* flightListSaga()
{
  yield takeLatest(REQUEST_API_DATA, getFlightData);
  yield takeLatest(BOOKING_REQUEST, bookMultiFlightSaga);
  yield takeLatest(REQUEST_MULTI_PNR_FLIGHT, getMultiFlightData);
}
