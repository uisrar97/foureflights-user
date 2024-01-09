/*
 *
 * Mult BookingForm actions
 *
 */

import { UPDATE_QUERY, REQUEST_API_DATA, RECEIVE_API_DATA, FLIGHT_REQUEST_FAILED, SELECTED_FLIGHT, BOOKING_REQUEST, 
  BOOKING_RESPONSE, BOOKING_ERROR, REQUEST_MULTI_PNR_FLIGHT, RECEIVE_MULTI_PNR_FLIGHT } from './constants';

export function updateQuery(data)
{
  return {
    type: UPDATE_QUERY,
    flightQuery: data.query,
    fieldsData: data.fieldsData,
  };
}

//Flight list actions

export function requestApiData(query, fields)
{
  return {
    type: REQUEST_API_DATA,
    query: query,
    fields: fields,
  };
}

export function receiveApiData(flights)
{
  return {
    type: RECEIVE_API_DATA,
    flights: flights,
    loading: true
  }
}

export function requestApiFailed(error)
{
  return {
    type: FLIGHT_REQUEST_FAILED,
    error: error,
    loading: true
  }
}

export function selectMultiFlight(data)
{
  return {
    type: SELECTED_FLIGHT,
      flight: data,
  };
}

// Multi Traveller Details Actions
export function bookingRequest(data)
{
  return {
    type: BOOKING_REQUEST,
    bookReq: data
  };
}

export function bookingResponse(data)
{
  return {
    type: BOOKING_RESPONSE,
    bookRes: data
  };
}

export function bookingFailed(data)
{
  return {
    type: BOOKING_ERROR,
    error: data
  };
}

// Multi Get Booking Actions
export function requestMultiPnrFlight (obj)
{
  return {
    type: REQUEST_MULTI_PNR_FLIGHT,
    pnr: obj.pnr,
    last_name: obj.last_name,
    endpoint: obj.endpoint,
  };
}

export function recevingMultiPnrFlight (pnrData)
{
  return {
    type: RECEIVE_MULTI_PNR_FLIGHT,
    pnrData: pnrData
  };
}
