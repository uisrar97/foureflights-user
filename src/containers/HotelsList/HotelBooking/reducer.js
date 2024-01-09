/*
 *
 * HotelBooking reducer
 *
 */
import produce from 'immer';
import { REQUEST_HOTEL_BOOKING, RECEIVE_HOTEL_BOOKING } from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const hotelBookingReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case REQUEST_HOTEL_BOOKING:
        return {...state, hotelBookingResponse: [], loading:true};
      case RECEIVE_HOTEL_BOOKING:
        return {...state, hotelBookingResponse: action.hotelBookingRes, loading:false};
      default:
        return state;
    }
  });

export default hotelBookingReducer;
