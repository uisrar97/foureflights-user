/*
 *
 * FlightDetailsView actions
 *
 */

import { REQUEST_SINGLE_FLIGHT, QUERY_DATA } from './constants';

export function requestSingle(flight) {
  return {
    type: REQUEST_SINGLE_FLIGHT,
    singleFlight:flight
  };
}

export function addQuery(query) {
  return {
    type: QUERY_DATA,
    query: query
  };
}
