/*
 *
 * HotelsList actions
 *
 */

import { REQUEST_HOTELS_LIST, RECEIVE_HOTELS_LIST, SELECTED_ROOMS_LIST, REQUEST_AREA_LIST, RECEIVE_AREA_LIST} from './constants';

export function requestHotelsList (obj) {
  return {
    type: REQUEST_HOTELS_LIST,
    api: obj.api,
  };
}

export function receiveHotelsList (list) {
  return {
    type: RECEIVE_HOTELS_LIST,
    hotelslist: list
  };
}

export function selectedRoomsList (obj) {
  return {
    type: SELECTED_ROOMS_LIST,
    roomslist: obj
  };
}

export function requestAreaList()
{
  return {
    type: REQUEST_AREA_LIST,
    api: 'admin/getareas',
  };
}
export function receiveAreaList(list)
{
  return {
    type: RECEIVE_AREA_LIST,
    areaList: list,
  };
}
