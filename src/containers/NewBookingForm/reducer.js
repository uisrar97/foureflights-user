/*
 *
 * NewBookingForm reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, HOTELS_LIST_QUERY } from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const newBookingFormReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case HOTELS_LIST_QUERY:
        return {...state, 
          HotelSearchQuery: {
            sector: action.sector, 
            checkin: action.checkin, 
            checkout: action.checkout, 
            sName: action.sName,
            locations: action.locations
          }, loading: true};
      case DEFAULT_ACTION:
        break;
    }
  });

export default newBookingFormReducer;
