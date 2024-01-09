/**
 *
 * HotelDetailView
 *
 */

import React from 'react';
import Helmet from "react-helmet";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import { useInjectSaga } from '../../../utils/injectSaga';
import { useInjectReducer } from '../../../utils/injectReducer';
import { useParams, Link } from 'react-router-dom';
import { selectedRoomsList } from '../actions';
import makeSelectHotelDetailView from './selectors';
import reducer from '../reducer';
import saga from './saga';

import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import ModifyHotelSearch from '../ModifyHotelSearch';
import HotelDetails from './HotelDetails';

export function HotelDetailView({hotelState, selectedRoomsList})
{
  useInjectReducer({ key: 'hotelDetailView', reducer });
  useInjectSaga({ key: 'hotelDetailView', saga });
  window.scrollTo(0, 0);

  const pagelocation = 'Hotel Details View';
  const params = useParams();
  const hotelSearch = (hotelState.hotelsSearch.HotelSearchQuery && hotelState.hotelsSearch.HotelSearchQuery !== {}) ? hotelState.hotelsSearch.HotelSearchQuery : false;
  const hotelList = (hotelState.hotelsList.hotelLoading === false && hotelState.hotelsList.hotelslist) ? hotelState.hotelsList.hotelslist : false;
  const hotelAreas = (hotelState.hotelsList.areaLoading === false && hotelState.hotelsList.areaList.status === '200' && hotelState.hotelsList.areaList.data.length > 0) ? hotelState.hotelsList.areaList.data : false;

  const decodedId = Number(atob(params.hotel));

  let selectedHotel = (hotelList !== false && hotelList.data && hotelList.data.length > 0) ? 
    hotelList.data.map((hotel)=>{
      if(hotel.id === decodedId)
      {
        return hotel;
      }
      else
      {
        return '';
      }
    }) 
  :
    false;
    
  if(selectedHotel !== false)
  {
    selectedHotel = selectedHotel.filter(Boolean);
  }
  
  return (
    <>
      <Helmet>
        <title>{pagelocation} | Four-E</title>
        <meta name="description" content="#" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navigation/>
      <div className='m-4'>
        <ModifyHotelSearch
          query={hotelSearch}
          hotelSearch={hotelSearch}
          details={true}
        />
      </div>
      {
        (hotelSearch && hotelList && hotelAreas) ?
          <HotelDetails hotel={selectedHotel[0]} search={hotelSearch} areas={hotelAreas} selectedRoomsList={selectedRoomsList} />
        :
          <div className='w-100 text-center not-found'>
            <span style={{ color: '#fcb040', fontSize: '30px' }}>Please Search Again</span>
            <div className="flightListBackToHome">
              <Link to="/">Go Back to Homepage</Link>
            </div>
          </div>
      }
      <Footer/>
    </>
  );
}

// HotelDetailView.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  hotelState: makeSelectHotelDetailView(),
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { selectedRoomsList },
    dispatch,
  );
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(HotelDetailView);
