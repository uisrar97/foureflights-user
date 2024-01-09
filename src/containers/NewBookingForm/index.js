/**
 *
 * NewBookingForm
 *
 */
import React, { useState, useEffect, useCallback, useRef } from "react";
import Axios from "../../utils/service";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";

import { useInjectSaga } from "../../utils/injectSaga";
import { useInjectReducer } from "../../utils/injectReducer";
import makeSelectNewBookingForm from "./selectors";
import reducer from "./reducer";
import saga from "./saga";

import BackgroundSlider from "react-background-slider";
import { Slider } from "./wrapper/NewBookingFormStyle";
import Tabs from "./Tabs";
import BookingForm from "./Flights/Flights";
import MyBooking from "./MyBooking";
import Hotel from "./Hotel";

// Slider Images
import S1 from "../../assets/img/slider/s1.webp";
import S2 from "../../assets/img/slider/s2.jpg";
import S3 from "../../assets/img/slider/s3.jpg";
import S4 from "../../assets/img/slider/s4.jpg";
import S5 from "../../assets/img/slider/s5.webp";
import S6 from "../../assets/img/slider/s6.jpg";
import S7 from "../../assets/img/slider/s7.jpg";
import S8 from "../../assets/img/slider/s8.jpg";

export function NewBookingForm() {
  useInjectReducer({ key: "newBookingForm", reducer });
  useInjectSaga({ key: "newBookingForm", saga });

  const [regions, setRegions] = useState({});
  const [sectors, setSectors] = useState({});
  const [loader, setLoader] = useState(true);

  const [regionVal, setRegionVal] = useState(0);
  const [sectorVal, setSectorVal] = useState(0);

  const isMounted = useRef();

  let date = new Date().setDate(new Date().getDate() + 1);
  date = new Date(date);
  const [checkInDate, setCheckInDate] = useState(date);
  const [checkOutDate, setCheckOutDate] = useState();

  const fetchcities = useCallback(async () => {
    Axios.get("admin/getsectors").then((response) => {
      const res = response.data;
      if (res.status === "200" && res.data) {
        setSectors(res.data);
        setLoader(false);
        isMounted.current = false;
      } else {
        setLoader(true);
      }
    });
  }, []);

  const fetchcountries = useCallback(async () => {
    Axios.get("admin/getregions").then((response) => {
      const res = response.data;
      if (res.status === "200" && res.data) {
        setRegions(res.data);
        fetchcities();
      } else {
        setLoader(true);
      }
    });
  }, [fetchcities]);

  const regionChange = (event) => {
    setRegionVal(Number(event.value));
  };
  const sectorChange = (event) => {
    setSectorVal(Number(event.value));
  };

  // useEffect(() => {
  //   if (isMounted.current)
  //   {
  //     return;
  //   }
  //   if (loader)
  //   {
  //     fetchcountries();
  //   }
  //   if (!loader)
  //   {
  //     if (regions && regions.length > 0)
  //     {
  //       regions.map((region)=>{
  //         if (region.region_name === 'Pakistan')
  //         {
  //           setRegionVal(region.id);
  //         }
  //         return '';
  //       });
  //     }
  //   }
  //   isMounted.current = true;
  // }, [fetchcountries, loader, regions])

  return (
    <div className="">
      <Slider id="slider">
        <BackgroundSlider
          images={[S1, S2, S3, S4, S5, S6, S7, S8]}
          duration={5}
          transition={2}
        />
        <div className="  w-100 d-flex justify-content-center  ">
          <Tabs>
            <div className="w-100 bg-info " label="Flight">
              <BookingForm />
            </div>
            <div label="Hotels">
              {/* <Hotel 
            regions={regions} 
            sectors={sectors} 
            loader={loader} 
            regionChange={regionChange} 
            regionVal={regionVal} 
            setRegionVal={setRegionVal}
            sectorChange={sectorChange} 
            checkInDate={checkInDate} 
            setCheckInDate={setCheckInDate} 
            checkOutDate={checkOutDate} 
            setCheckOutDate={setCheckOutDate}
            sectorVal={sectorVal}
          /> */}
              <div className="New-Booking-Coming-Soon d-flex">
                <img alt="Coming Soon" src="/com.jpg" />
              </div>
            </div>
            <div label="My Booking">
              <MyBooking />
            </div>
            {/* <div label="Tours">
          <div className="New-Booking-Coming-Soon d-flex">
            <img alt='Coming Soon' src="/com.jpg" />
          </div>
        </div> */}
          </Tabs>
        </div>
      </Slider>
    </div>
  );
}

NewBookingForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  newBookingForm: makeSelectNewBookingForm(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(NewBookingForm);
