/*
 *
 * HotelsList reducer
 *
 */
import produce from 'immer';
import { REQUEST_HOTELS_LIST, RECEIVE_HOTELS_LIST, SELECTED_ROOMS_LIST, REQUEST_AREA_LIST, RECEIVE_AREA_LIST} from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const hotelsListReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case REQUEST_HOTELS_LIST:
        return {...state, hotelslist: [], hotelLoading: true};

      case RECEIVE_HOTELS_LIST:
        return { ...state, hotelslist: action.hotelslist, message: action.hotelslist.message, hotelLoading: false };
      
      case SELECTED_ROOMS_LIST:
        return {...state, roomsList: action.roomslist, loading: false};

      case REQUEST_AREA_LIST:
        return {...state, areaList: [], areaLoading: true};
      
      case RECEIVE_AREA_LIST:
        return { ...state, areaList: action.areaList, areaLoading: false };
        
      default:
        return state;
    }
  });

export default hotelsListReducer;
