/*
 *
 * HotelBooking actions
 *
 */

import { REQUEST_HOTEL_BOOKING, RECEIVE_HOTEL_BOOKING } from './constants';

export function hotelBookingRequest(data) {
  return {
    type: REQUEST_HOTEL_BOOKING,
    hotelBookingReq: data
  };
}

export function hotelBookingResponse(data){
  return {
    type: RECEIVE_HOTEL_BOOKING,
    hotelBookingRes: data
  };
}
