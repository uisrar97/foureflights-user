/*
 *
 * BookingForm actions
 *
 */

import { UPDATE_QUERY, REQUEST_API_DATA, RECEIVE_API_DATA,FLIGHT_REQUEST_FAILED } from './constants';

export function updateQuery(data) {
  return {
    type: UPDATE_QUERY,
    flightQuery: data,
  };
}


//Flight list actions

export function requestApiData(flights) {
  return {
    type: REQUEST_API_DATA,
    flights: flights,
  };
}

export function receiveApiData (flights) {
  return {
    type: RECEIVE_API_DATA,
    flights: flights,
    loading: true
  }
}

export function requestApiFailed (error) {
    return {
      type: FLIGHT_REQUEST_FAILED,
      error:error,
      loading: true
    }
}
