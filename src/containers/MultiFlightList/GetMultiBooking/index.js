import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose, bindActionCreators } from "redux";
import { useInjectSaga } from "../../../utils/injectSaga";
import { Link } from "react-router-dom";
import { Plane } from "react-loader-spinner";
import { requestMultiPnrFlight } from "../../NewBookingForm/Flights/Multi/actions";
import { makeSelectMultiSearchObj } from "../MultiTravellerDetails/selectors";
import saga from "../../NewBookingForm/Flights/Multi/saga";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import { FailedBooking } from "../../GetBookingPnr/wrapper/GetBookingStyle";
import TravelportBooking from "../MultiFlightBooking/TravelportBooking";
import AirblueBooking from "../MultiFlightBooking/AirblueBooking";

export function GetMultiBooking({ multiSearch, requestMultiPnrFlight }) {
  useInjectSaga({ key: "getMultiBooking", saga });

  const { getMultiBooking } = multiSearch;
  const { bookData, loading } = getMultiBooking;

  const pagelocation = "Multi Flight Booking";
  const params = useParams();
  let obj = {};

  let split = params.pnr.split("&");
  let pnr = split[0].split("=");
  let lastName = split[1].split("=");
  let page = split[2].split("=");

  obj.pnr = pnr[1];
  obj.last_name = lastName[1];
  if (page[1] === "200") {
    obj.endpoint = "api/get-booking-by-pnr";
  } else {
    obj.endpoint = "api/get-booking-by-pnr-db";
  }

  const FlightProvider = () => {
    const provider_type =
      loading === false && bookData.status === "200"
        ? bookData.data.provider_type
        : "400";

    if (provider_type === "travelport") {
      return <TravelportBooking bookingData={bookData} />;
    } else if (provider_type === "hitit") {
    } else if (provider_type === "airblue") {
      return (
        <AirblueBooking bookingData={bookData} query={{ cabin: "Economy" }} />
      );
    } else if (provider_type === "400") {
      return (
        <FailedBooking className="d-flex flex-column">
          <h4>Booking Not Found.</h4>
          <div className="foot">
            <Link to="/">Go Back to Homepage</Link>
          </div>
        </FailedBooking>
      );
    }
  };

  useEffect(() => {
    try {
      requestMultiPnrFlight(obj);
    } catch (error) {}
  }, []);

  return (
    <>
      <Helmet>
        <title>{pagelocation} | Four-E</title>
        <meta name="description" content="#" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navigation />
      {loading ? (
        <div className="flightlist-loader">
          <h3>Please wait. We Are Retrieving Your Information!</h3>
          <Plane color="#378edd" secondaryColor="#378edd" />
        </div>
      ) : (
        FlightProvider()
      )}

      <Footer />
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  multiSearch: makeSelectMultiSearchObj(),
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ requestMultiPnrFlight }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(GetMultiBooking);
