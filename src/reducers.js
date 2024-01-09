/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import history from './utils/history';
import languageProviderReducer from './containers/LanguageProvider/reducer';
import hotelsListReducer from './containers/HotelsList/reducer';
import QueryReducer from './containers/NewBookingForm/Flights/reducer';
import MultiQueryReducer from './containers/NewBookingForm/Flights/Multi/reducer';
import newBookingFormReducer from './containers/NewBookingForm/reducer';
import flightListReducer from './containers/FlightList/reducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {})
{
  const globalPersistConfig = {
    key: 'global',
    storage,
  };

  const hotelsSearchPersistConfig = {
    key: 'hotelSearchQuery',
    storage,
  };
  
  const queryPersistConfig = {
    key: 'query',
    storage,
  };

  const flightListPersistConfig = {
    key: 'flightList',
    storage,
  };

  // const hotelsListPersistConfig = {
  //   key: 'HotelsList',
  //   storage,
  // };

  // const languagePersistConfig = {
  //   key: 'language',
  //   storage,
  // };
  // const routerPersistConfig = {
  //   key: 'router',
  //   storage,
  // };

  const rootReducer = combineReducers({
    language: persistReducer(globalPersistConfig, languageProviderReducer),
    router: connectRouter(history),
    search: persistReducer(queryPersistConfig, QueryReducer),
    multiSearch: persistReducer(globalPersistConfig, MultiQueryReducer),
    hotelsSearch: persistReducer(hotelsSearchPersistConfig, newBookingFormReducer),
    hotelsList: persistReducer(globalPersistConfig, hotelsListReducer),
    roomsList: persistReducer(globalPersistConfig, hotelsListReducer),
    flightList: persistReducer(flightListPersistConfig, flightListReducer),
    ...injectedReducers,
  });

  return rootReducer;
}
