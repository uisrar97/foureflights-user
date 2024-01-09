/**
 *
 * GetBookingPnr
 *
 */

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose, bindActionCreators } from "redux";

import { useInjectSaga } from "../../utils/injectSaga";
import { useInjectReducer } from "../../utils/injectReducer";
import makeSelectGetBookingPnr from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import { requestPnrFlight } from "./actions";
import { Link } from "react-router-dom";
import { Plane } from "react-loader-spinner";
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

// Ticket Imports
import TravelportTicket from "./TravelportTicket";
import HititTicket from "./HititTicket";
import AirblueTicket from "./AirblueTicket";
import AirSialTicket from "./AirSialTicket";

import { FailedBooking } from "./wrapper/GetBookingStyle";

import Helmet from "react-helmet";
import Navigation from "./../../components/Navigation";
import Footer from "./../../components/Footer";
import { useParams } from "react-router-dom";

export function GetBookingPnr({ getBookingPnr, requestPnrFlight }) {
  useInjectReducer({ key: "getBookingPnr", reducer });
  useInjectSaga({ key: "getBookingPnr", saga });

  const { booking, loading } = getBookingPnr;
  const pagelocation = "Flight Booking";
  const params = useParams();
  let obj = {};
  const isIframe = window.self !== window.top;

  let split = params.pnr.split("&");
  let pnr = split[0].split("=");
  let lastName = split[1].split("=");
  let page = split[2].split("=");
  let userData = split[3] ? split[3].split("=") : [];
  let userId = userData[1] !== undefined ? userData[1] : "";
  obj.userId = userId;
  obj.pnr = pnr[1];
  obj.last_name = lastName[1];
  if (page[1] === "200") {
    obj.endpoint = "api/get-booking-by-pnr";
  } else {
    obj.endpoint = "api/get-booking-by-pnr-db";
  }

  useEffect(() => {
    try {
      requestPnrFlight(obj);
    } catch (error) {}
  }, []);

  const getBooking = () => {
    let provider_type =
      loading === false && booking.status === "200"
        ? booking.data.provider_type
        : "400";

    if (provider_type === "travelport") {
      return <TravelportTicket userId={userId} bookingData={booking} />;
    } else if (provider_type === "hitit") {
      return <HititTicket userId={userId} bookingData={booking} />;
    } else if (provider_type === "airblue") {
      return <AirblueTicket bookingData={booking} userId={userId} />;
    } else if (provider_type === "airsial") {
      return <AirSialTicket userId={userId} bookingData={booking} />;
    } else if (provider_type === "400") {
      const isIframe = window.self !== window.top;
      return (
        <FailedBooking className="d-flex flex-column">
          <h4>Booking Not Found.</h4>
          {!isIframe && (
            <div className="foot">
              <Link to="/">Go Back to Homepage</Link>
            </div>
          )}
        </FailedBooking>
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>{pagelocation} | Four-E</title>
        <meta name="description" content="#" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {!isIframe && <Navigation />}
      {loading ? (
        <div className="flightlist-loader">
          <h3>Please wait. We Are Retrieving Your Information!</h3>
          <Plane color="#378edd" secondaryColor="#378edd" />
        </div>
      ) : (
        getBooking()
      )}
      {!isIframe && <Footer />}
    </>
  );
}

// GetBookingPnr.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  getBookingPnr: makeSelectGetBookingPnr(),
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ requestPnrFlight }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(GetBookingPnr);
