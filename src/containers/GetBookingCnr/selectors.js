import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the getBookingCnr state domain
 */

const selectGetBookingCnrDomain = state => state.getBookingCnr || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by GetBookingCnr
 */

const makeSelectGetBookingCnr = () =>
  createSelector(
    selectGetBookingCnrDomain,
    substate => substate,
  );

export default makeSelectGetBookingCnr;
export { selectGetBookingCnrDomain };
