import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the hotelBooking state domain
 */

const selectHotelBookingDomain = state => [state.roomsList, state.hotelsSearch] || initialState ;

/**
 * Other specific selectors
 */

/**
 * Default selector used by HotelBooking
 */

const makeSelectHotelBooking = () =>
  createSelector(
    selectHotelBookingDomain,
    substate => substate,
  );

export default makeSelectHotelBooking;
export { selectHotelBookingDomain };
