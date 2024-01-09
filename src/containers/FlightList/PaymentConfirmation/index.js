/**
 *
 * PaymentConfirmation
 *
 */

import React, { memo } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import { useInjectSaga } from "../../../utils/injectSaga";
import { useInjectReducer } from "../../../utils/injectReducer";
import makeSelectPaymentConfirmation from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import Navigation from "../../../components/Navigation";
import { Plane } from "react-loader-spinner";
import Footer from "./../../../components/Footer";
import TravelportTicket from "./TravelportTicket";
import HititTicket from "./HititTicket";
import AirblueTicket from "./AirblueTicket";
import AirSialTicket from "./AirSialTicket";

import { LoaderMain, FailedBooking } from "./wrapper/ConfirmPaymentStyle";

import ErrorBoundary from "./../../../helper/ErrorBoundary";

export function PaymentConfirmation({ paymentConfirmation }) {
  // console.clear();
  window.onbeforeunload = function () {
    return "Your Booking Details Have Been Emailed to You";
  };
  useInjectReducer({ key: "paymentConfirmation", reducer });
  useInjectSaga({ key: "paymentConfirmation", saga });

  const bookingData =
    paymentConfirmation.travellerDetails &&
    paymentConfirmation.travellerDetails.bookingResponse &&
    paymentConfirmation.travellerDetails.bookingResponse.message !==
      "Network Error"
      ? paymentConfirmation.travellerDetails.bookingResponse
      : { status: "400" };
  const query = paymentConfirmation.search.query;
  const loading =
    paymentConfirmation.travellerDetails &&
    paymentConfirmation.travellerDetails.loading
      ? true
      : false;

  window.scrollTo(0, 0);

  // Airline Filter Function
  const airlineFilter = (bookingData) => {
    if (bookingData.status === "400") {
      return (
        <FailedBooking className="d-flex flex-column">
          <h4>Booking Unsuccessful. Please Try Again.</h4>
          <div className="foot">
            <Link to="/">Go Back to Homepage</Link>
          </div>
        </FailedBooking>
      );
    } else if (bookingData.data.provider_type === "travelport") {
      return <TravelportTicket bookingData={bookingData} query={query} />;
    } else if (bookingData.data.provider_type === "hitit") {
      return <HititTicket bookingData={bookingData} query={query} />;
    } else if (bookingData.data.provider_type === "airblue") {
      return <AirblueTicket bookingData={bookingData} query={query} />;
    } else if (
      bookingData.data.provider_type === "airsial" ||
      bookingData.data.validTill
    ) {
      return <AirSialTicket bookingData={bookingData} query={query} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {loading
            ? "Loading | "
            : bookingData.status === "400"
            ? ""
            : !paymentConfirmation.travellerDetails ||
              bookingData.status === "400"
            ? "Booking Unsuccessful | "
            : "Booking Successful | "}
          Four-E
        </title>
        <meta name="description" content="#" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navigation />
      {paymentConfirmation.travellerDetails &&
      paymentConfirmation.travellerDetails.loading ? (
        <LoaderMain>
          <h3>Please be patient. Your Details are being retrieved!</h3>
          <Plane color="#378edd" secondaryColor="#378edd" />
        </LoaderMain>
      ) : (
        <>
          <ErrorBoundary>
            {!paymentConfirmation.travellerDetails ? (
              <FailedBooking className="d-flex flex-column">
                <h4>Your Booking Details Have Been Emailed to You.</h4>
                <div className="foot">
                  <Link to="/">Go Back to Homepage</Link>
                </div>
              </FailedBooking>
            ) : bookingData.data ? (
              airlineFilter(bookingData)
            ) : (
              <FailedBooking className="d-flex flex-column">
                <h4>Booking Unsuccessful. Please Try Again.</h4>
                <div className="foot">
                  <Link to="/">Go Back to Homepage</Link>
                </div>
              </FailedBooking>
            )}
          </ErrorBoundary>
        </>
      )}
      <Footer />
    </>
  );
}

// PaymentConfirmation.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  paymentConfirmation: makeSelectPaymentConfirmation(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(PaymentConfirmation);
