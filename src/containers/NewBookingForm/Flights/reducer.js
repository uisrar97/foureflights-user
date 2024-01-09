/*
 *
 * FlightList reducer
 *
 */
import produce from 'immer';
import { UPDATE_QUERY, REQUEST_API_DATA, RECEIVE_API_DATA,FLIGHT_REQUEST_FAILED } from './constants';

export const initialState = { flightList: [], query:[] };

/* eslint-disable default-case, no-param-reassign */
const queryReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case UPDATE_QUERY:
        return  {...state, query: action.flightQuery}

      // Flight list reducers cases
      case REQUEST_API_DATA:
          return {...state, flightList: {flights: [], loading: true}};
      case RECEIVE_API_DATA:
        return  { ...state, flightList: {flights: action.flights, error: action.flights.message, loading: false} };
      case FLIGHT_REQUEST_FAILED:
        return {...state, flightList: {flights: [], error: action.error, loading: false}};

      default:
        return state;
    }
  });

export default queryReducer;


