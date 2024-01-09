/**
 *
 * HotelsList
 *
 */

import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { requestHotelsList, requestAreaList } from './actions';
import makeSelectHotelsList, { makeSelectHotelsSearch } from './selectors';
import reducer from './reducer';
import saga from './saga';
import Helmet from "react-helmet";
import { Plane } from 'react-loader-spinner';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ModifyHotelSearch from './ModifyHotelSearch';
import HotelSidebar from './HotelSidebar';
import HotelList from './list/HotelList';
import { HotelSearchList } from './wrapper/HotelListStyle';

export function HotelsList({ hotelsList, hotelSearch, requestHotelsList, requestAreaList }) {
  useInjectReducer({ key: 'hotelsList', reducer });
  useInjectSaga({ key: 'hotelsList', saga });
  

  const { areaLoading, hotelLoading } = hotelsList;
  
  const pagelocation = 'Hotel Search Result';
  const isMounted = useRef();

  const params = useParams();
  let sortHtls = [];

  const [obj, setObj] = useState({});
  const [loading, setLoading] = useState(true);
  const [hotelList, setHotelList] = useState({});
  const [areaList, setAreaList] = useState({});
  const [status, setStatus] = useState('');

  const [checkedRatings, setCheckedRatings] = useState([]);
  const [checkedAreas, setCheckedAreas] = useState([]);
  const [checkedVendorTypes, setCheckedVendorTypes] = useState([]);
  const [checkedRefundTypes, setCheckedRefundTypes] = useState([]);

  // let htList = {};

  // async function loadingState() {
  //   if (hotelsList.areaLoading || hotelsList.hotelLoading) {
  //     setLoading(true);
  //   }
  //   else if (!hotelsList.areaLoading && !hotelsList.hotelLoading) {
  //     setLoading(false);
  //   }
  // }

  async function loadingData()
  {
    if (!areaLoading && !hotelLoading && loading)
    {
      if (hotelsList.hotelslist && hotelsList.areaList.status === '200')
      {
        setHotelList(hotelsList.hotelslist);
      }
      if (hotelsList.areaList && hotelsList.areaList.status === '200')
      {
        setAreaList(hotelsList.areaList.data);
      }
      if ((hotelsList.hotelslist && hotelsList.hotelslist.status === '200') && 
      (hotelsList.areaList && hotelsList.areaList.status === '200'))
      {
        setStatus('200');
      }
      setLoading(false);
    }
  }
  if (!areaLoading && !hotelLoading) {
    loadingData();
  }
  useEffect(() => {
    if (isMounted.current) {
      return;
    }
    const split = params.sector.split('&');
    let sectorId = split[0].split('=');
    let checkIn = split[1].split('=');
    let checkOut = split[2].split('=');
    let sName = split[3].split('=');

    const serachQuery = {
      sector: sectorId[1],
      checkin: checkIn[1],
      checkout: checkOut[1],
      sName: sName[1],
      api: `api/getvendors?sector=${sectorId[1]}`,
    };
    try {
      requestHotelsList(serachQuery);
      setObj(serachQuery);
      requestAreaList();
    }
    catch (error) { }

    isMounted.current = true;
  }, [params, requestAreaList, requestHotelsList, loading])

  const vendorTypes = [
    { id: '1', title: 'Hotel', name: 'hotel' },
    { id: '2', title: 'Apartment', name: 'apartment' },
    { id: '3', title: 'Guest House', name: 'guest-house' },
    { id: '4', title: 'Cottage', name: 'cottage' },
    { id: '5', title: 'Resort', name: 'resort' },
  ];

  const refundTypes = [
    { id: '1', title: 'Yes' },
    { id: '2', title: 'No' }
  ];

  const handleRatingChange = event => {
    setCheckedRatings({
      ...checkedRatings,
      [event.target.name]: event.target.checked,
    });
  };

  const handleAreasChange = event => {
    setCheckedAreas({
      ...checkedAreas,
      [event.target.value]: event.target.checked,
    });
  }

  const handleVendorTypeChange = event => {
    setCheckedVendorTypes({
      ...checkedVendorTypes,
      [event.target.name]: event.target.checked,
    });
  }

  const handleRefundChange = event => {
    setCheckedRefundTypes({
      ...checkedRefundTypes,
      [event.target.name]: event.target.checked,
    });
  }

  if (status === "200" && loading === false)
  {
    let tempHotels = [];
    tempHotels = JSON.parse(JSON.stringify(hotelList));
    
    tempHotels.data = tempHotels.data.filter(Boolean);

    sortHtls.status = tempHotels.status;
    sortHtls.message = tempHotels.message;
    sortHtls.data = [];

    for (const i of Array.from(tempHotels.data)) {
      let loc = i;
      let price = 100000000;
      if (tempHotels.data.length > 0) {
        tempHotels.data.map((hotel, index) => {
          if (hotel.rooms.length > 0) {
            if (Number(hotel.rooms[0].one_night_price) < Number(price)) {
              loc = index;
              price = Number(hotel.rooms[0].one_night_price);
            }
          }
          return 0;
        })
        sortHtls.data.push(tempHotels.data[loc]);
        delete tempHotels.data[loc];
      }
    }
    sortHtls.data = sortHtls.data.filter(Boolean);
    // htList = sortHtls;
  }
  
  return (
    <>
      <Helmet>
        <title>{pagelocation} | Four-E</title>
        <meta name="description" content="#" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {
        (loading || status === '' || status === undefined) ?
          <div className="flightlist-loader">
            <h3 className='mb-4'>Please be patient we are finding best solution for you!</h3>
            <Plane color="#378edd" />
          </div>
          :
          <>
            <Navigation />
            <div className='m-4'>
              <ModifyHotelSearch
                query={obj}
                hotelSearch={hotelSearch.HotelSearchQuery}
                setModify={setLoading}
                details={false}
              />
            </div>
            <HotelSearchList className='col-md-12 mt-3'>
              {
                (status === '200') ?
                  <>
                    <HotelSidebar
                      hotelList={hotelList}
                      areaList={areaList}
                      sectorId={Number(obj.sector)}
                      vendorTypes={vendorTypes}
                      refundTypes={refundTypes}
                      handleRatingChange={handleRatingChange}
                      handleAreasChange={handleAreasChange}
                      handleVendorTypeChange={handleVendorTypeChange}
                      handleRefundChange={handleRefundChange}
                    />
                    <HotelList
                      hotelList={hotelList}
                      cities={hotelSearch.HotelSearchQuery.locations.cities}
                      selectedRatings={checkedRatings}
                      selectedAreas={checkedAreas}
                      selectedVendorTypes={checkedVendorTypes}
                      selectedRefundTypes={checkedRefundTypes}
                    />
                  </>
                  :
                  <div className='w-100 text-center not-found'>
                    <span style={{ color: '#fcb040', fontSize: '30px' }}>No Result Found. Please Try Again</span>
                    <div className="flightListBackToHome">
                      <Link to="/">Go Back to Homepage</Link>
                    </div>
                  </div>
              }
            </HotelSearchList>
            <Footer />
          </>
      }

    </>
  );
}

// HotelsList.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  hotelsList: makeSelectHotelsList(),
  hotelSearch: makeSelectHotelsSearch(),
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { requestHotelsList, requestAreaList },
    dispatch,
  );
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(HotelsList);
