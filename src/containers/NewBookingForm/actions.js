/*
 *
 * NewBookingForm actions
 *
 */

import { DEFAULT_ACTION, HOTELS_LIST_QUERY } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function hotelsSearchRequest (obj)
{
  return {
    type: HOTELS_LIST_QUERY,
    sector: obj.sector,
    checkin: obj.checkin,
    checkout: obj.checkout,
    sName: obj.sector_name,
    locations: obj.locations,
  };
}
