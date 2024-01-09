/*
 *
 * GetBookingPnr reducer
 *
 */
import produce from 'immer';
import { REQUEST_CNR_HOTEL,RECEIVE_CNR_HOTEL } from './constants';

export const initialState = { };

/* eslint-disable default-case, no-param-reassign */
const getBookingPnrReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case REQUEST_CNR_HOTEL:
          return {...state, booking: [], loading: true};
      case RECEIVE_CNR_HOTEL:
        return  { ...state, booking: action.cnrData, error: action.cnrData.message, loading: false };
      default:
        return state;
    }
  });

export default getBookingPnrReducer;
