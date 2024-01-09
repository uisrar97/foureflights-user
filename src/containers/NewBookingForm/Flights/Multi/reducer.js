/*
 *
 * FlightList reducer
 *
 */
import produce from 'immer';
import { UPDATE_QUERY, REQUEST_API_DATA, RECEIVE_API_DATA, FLIGHT_REQUEST_FAILED, SELECTED_FLIGHT, BOOKING_REQUEST, 
  BOOKING_RESPONSE, REQUEST_MULTI_PNR_FLIGHT, RECEIVE_MULTI_PNR_FLIGHT } from './constants';

export const initialState = { multiFlightList: [], query:[], fieldsData: [], selectedFlight: [], multiBooking: [], getMultiBooking: [] };

/* eslint-disable default-case, no-param-reassign */
const MultiQueryReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type)
    {
      case UPDATE_QUERY:
        return {...state, query: action.flightQuery, fieldsData: action.fieldsData }
      case REQUEST_API_DATA:
        return { ...state, multiFlightList: { flights: [], loading: true } };
      case RECEIVE_API_DATA:
        return { ...state, multiFlightList: { flights: action.flights, loading: false } };
      case FLIGHT_REQUEST_FAILED:
        return { ...state, multiFlightList: { flights: [], error: action.error, loading: false }} ;
      case SELECTED_FLIGHT:
        return { ...state, selectedFlight: action.flight};
      case BOOKING_REQUEST:
        return { ...state, multiBooking: { bookRes: {}, loading: true } };
      case BOOKING_RESPONSE:
        return { ...state, multiBooking: { bookRes: action.bookRes, loading: false } }
      case REQUEST_MULTI_PNR_FLIGHT:
        return { ...state, getMultiBooking: { bookData: {}, loading: true } }
      case RECEIVE_MULTI_PNR_FLIGHT:
        return { ...state, getMultiBooking: { bookData: action.pnrData, loading: false } }
      default:
        return state;
    }
  });

export default MultiQueryReducer;


