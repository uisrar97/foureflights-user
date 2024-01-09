import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the hotelsList state domain
 */

const selectHotelsListDomain = state => state.hotelsList || initialState;


const hotelSearchDomain = state => state.hotelsSearch || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by HotelsList
 */

const makeSelectHotelsList = () =>
  createSelector(
    selectHotelsListDomain,
    substate => substate,
  );
const makeSelectHotelsSearch = () =>
  createSelector(
    hotelSearchDomain,
    substate => substate,
  );
export default makeSelectHotelsList;
export { selectHotelsListDomain, hotelSearchDomain, makeSelectHotelsSearch };
