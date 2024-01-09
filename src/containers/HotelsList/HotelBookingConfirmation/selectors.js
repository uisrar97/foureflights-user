import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the hotelBookingConfirmation state domain
 */

const selectHotelBookingConfirmationDomain = state =>
  state.hotelBooking || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by HotelBookingConfirmation
 */

const makeSelectHotelBookingConfirmation = () =>
  createSelector(
    selectHotelBookingConfirmationDomain,
    substate => substate,
  );

export default makeSelectHotelBookingConfirmation;
export { selectHotelBookingConfirmationDomain };
