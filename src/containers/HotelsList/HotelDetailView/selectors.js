import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the hotelDetailView state domain
 */

const selectHotelDetailViewDomain = state =>
  state || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by HotelDetailView
 */

const makeSelectHotelDetailView = () =>
  createSelector(
    selectHotelDetailViewDomain,
    substate => substate,
  );

export default makeSelectHotelDetailView;
export { selectHotelDetailViewDomain };
