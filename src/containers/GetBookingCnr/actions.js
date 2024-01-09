/*
 *
 * GetBookingCnr actions
 *
 */

import { REQUEST_CNR_HOTEL, RECEIVE_CNR_HOTEL } from './constants';

export function requestCnrHotel(obj) {
  return {
    type: REQUEST_CNR_HOTEL,
    cnr: obj.cnr,
    last_name: obj.last_name,
    endpoint: obj.endpoint,
  };
}

export function recevingCnrHotel (cnrData) {
  return {
    type: RECEIVE_CNR_HOTEL,
    cnrData: cnrData
  };
}